import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import ms from 'ms';
import { Response } from 'express';
import { PrismaClient, Role, RefreshTokenStatus } from '@prisma/client';

const prisma = new PrismaClient();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m';
const REFRESH_EXPIRES_IN_DAYS = Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS ?? 7);
const REFRESH_EXPIRES_IN_MS = REFRESH_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000;
const REFRESH_EXPIRES_IN_SECONDS = REFRESH_EXPIRES_IN_DAYS * 24 * 60 * 60;

// Calculé une seule fois à partir de la même variable d'env que jwt.sign,
// garantit que le cookie et le JWT expirent au même moment.
const ACCESS_TOKEN_MAX_AGE_MS = ms(ACCESS_EXPIRES_IN as ms.StringValue);

const isProd = process.env.NODE_ENV === 'production';

interface AccessTokenPayload {
    userId: string;
    role: Role;
}

export function generateAccessToken(userId: string, role: Role): string {
    const payload: AccessTokenPayload = { userId, role };
    const options: SignOptions = {
        expiresIn: ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, ACCESS_SECRET, options);
}

export async function generateRefreshToken(userId: string, familyId?: string): Promise<string> {
    const jti = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_IN_MS);

    await prisma.refreshToken.create({
        data: {
            jti,
            userId,
            familyId: familyId ?? crypto.randomUUID(),
            status: RefreshTokenStatus.ACTIVE,
            expiresAt,
        },
    });

    const options: SignOptions = { expiresIn: REFRESH_EXPIRES_IN_SECONDS };
    return jwt.sign({ jti }, REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
}

export async function verifyRefreshToken(token: string) {
    const decoded = jwt.verify(token, REFRESH_SECRET) as { jti: string };

    const stored = await prisma.refreshToken.findUnique({
        where: { jti: decoded.jti },
        include: { user: true },
    });

    if (!stored) throw new Error('Refresh token introuvable');
    if (stored.status !== RefreshTokenStatus.ACTIVE) throw new Error('Refresh token révoqué');
    if (stored.expiresAt < new Date()) throw new Error('Refresh token expiré');

    return stored;
}

export async function rotateRefreshToken(oldToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
}> {
    const decoded = jwt.verify(oldToken, REFRESH_SECRET) as { jti: string };

    const stored = await prisma.refreshToken.findUnique({
        where: { jti: decoded.jti },
        include: { user: true },
    });

    if (!stored) throw new Error('Refresh token introuvable');

    if (stored.status === RefreshTokenStatus.REVOKED) {
        await prisma.refreshToken.updateMany({
            where: { familyId: stored.familyId, status: RefreshTokenStatus.ACTIVE },
            data: { status: RefreshTokenStatus.REVOKED },
        });
        throw new Error('Rejeu détecté : famille de tokens révoquée');
    }

    if (stored.expiresAt < new Date()) throw new Error('Refresh token expiré');

    const newJti = crypto.randomUUID();
    const newExpiresAt = new Date(Date.now() + REFRESH_EXPIRES_IN_MS);

    await prisma.$transaction([
        prisma.refreshToken.update({
            where: { jti: stored.jti },
            data: { status: RefreshTokenStatus.REVOKED, replacedBy: newJti },
        }),
        prisma.refreshToken.create({
            data: {
                jti: newJti,
                userId: stored.userId,
                familyId: stored.familyId,
                status: RefreshTokenStatus.ACTIVE,
                expiresAt: newExpiresAt,
            },
        }),
    ]);

    const refreshOptions: SignOptions = { expiresIn: REFRESH_EXPIRES_IN_SECONDS };
    const newRefreshToken = jwt.sign({ jti: newJti }, REFRESH_SECRET, refreshOptions);
    const newAccessToken = generateAccessToken(stored.userId, stored.user.role);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'strict',
        path: '/',
        maxAge: ACCESS_TOKEN_MAX_AGE_MS,
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'strict',
        path: '/auth',
        maxAge: REFRESH_EXPIRES_IN_MS,
    });
}

export function clearAuthCookies(res: Response): void {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/auth' });
}

export function decodeRefreshTokenJti(token: string): string | null {
    const decoded = jwt.decode(token) as { jti: string } | null;
    return decoded?.jti ?? null;
}