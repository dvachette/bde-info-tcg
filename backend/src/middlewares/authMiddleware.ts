import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/token.js';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        res.status(401).json({ error: 'Non authentifié' });
        return;
    }

    try {
        const payload = verifyAccessToken(accessToken);
        req.userId = payload.userId;
        req.userRole = payload.role;
        next();
    } catch {
        res.status(401).json({ error: 'Token invalide ou expiré' });
    }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
    if (req.userRole !== 'ADMIN') {
        res.status(403).json({ error: 'Accès refusé' });
        return;
    }
    next();
}