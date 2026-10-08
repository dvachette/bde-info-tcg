import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {
    generateAccessToken,
    generateRefreshToken,
    rotateRefreshToken,
    setAuthCookies,
    clearAuthCookies,
    decodeRefreshTokenJti,
} from '#services/token.js';
import { loginSchema, registerSchema } from '#services/validation.js';
import { prisma } from '#services/prisma.js';

export async function login(req: Request, res: Response): Promise<void> {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues.map(i => i.message) });
        return;
    }
    const { identifier, password } = parsed.data;

    const user = await prisma.user.findFirst({
        where: { OR: [{ username: identifier }, { email: identifier }] },
    });

    if (!user) {
        res.status(401).json({ error: 'Identifiants invalides' });
        return;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
        res.status(401).json({ error: 'Identifiants invalides' });
        return;
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = await generateRefreshToken(user.id);

    setAuthCookies(res, accessToken, refreshToken);
    res.status(200).json({ message: 'Connecté' });
}

export async function refresh(req: Request, res: Response): Promise<void> {
    const oldRefreshToken = req.cookies?.refreshToken;

    if (!oldRefreshToken) {
        res.status(401).json({ error: 'Refresh token manquant' });
        return;
    }

    try {
        const { accessToken, refreshToken } = await rotateRefreshToken(oldRefreshToken);
        setAuthCookies(res, accessToken, refreshToken);
        res.status(200).json({ message: 'Token rafraîchi' });
    } catch (error) {
        clearAuthCookies(res);
        res.status(401).json({ error: 'Refresh token invalide' });
    }
}

export async function logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
        const jti = decodeRefreshTokenJti(refreshToken);
        if (jti) {
            await prisma.refreshToken.updateMany({
                where: { jti },
                data: { status: 'REVOKED' },
            });
        }
    }

    clearAuthCookies(res);
    res.status(200).json({ message: 'Déconnecté' });
}

export async function me(req: Request, res: Response): Promise<void> {
    const userId = req.userId;

    if (!userId) {
        res.status(401).json({ error: 'Non authentifié' });
        return;
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            keysBalance: true,
        },
    });

    if (!user) {
        res.status(404).json({ error: 'Utilisateur introuvable' });
        return;
    }

    res.status(200).json({ user });
}

export async function register(req: Request, res: Response): Promise<void> {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues.map(i => i.message) });
        return;
    }
    const { username, email, password } = parsed.data;

    const existing = await prisma.user.findFirst({
        where: { OR: [{ username }, { email }] },
    });

    if (existing) {
        res.status(409).json({ error: 'Username ou email déjà utilisé' });
        return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { username, email, passwordHash } });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = await generateRefreshToken(user.id);

    setAuthCookies(res, accessToken, refreshToken);
    res.status(201).json({ message: 'Compte créé' });
}
