import { z } from 'zod';

export const usernameSchema = z
    .string()
    .min(3, 'Le username doit faire au moins 3 caractères')
    .max(16, 'Le username doit faire au plus 16 caractères')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Le username ne peut contenir que lettres, chiffres, _ . -');

export const passwordSchema = z
    .string()
    .min(8, 'Le mot de passe doit faire au moins 8 caractères')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre');

export const emailSchema = z.email('Email invalide');

export const registerSchema = z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
});

// Login : identifier peut être un username OU un email, donc pas de contrainte
// de format d'email stricte ; seule la forme "username" (3-16, charset) est
// garantie de matcher les deux cas puisque l'email a un charset plus large.
// On valide juste la présence et une longueur raisonnable, pas la complexité du password.
export const loginSchema = z.object({
    identifier: z.string().min(1, 'Identifier requis').max(255),
    password: z.string().min(1, 'Password requis'),
});

export const userIdParamSchema = z.object({ userId: z.uuid() });

export const cardParamsSchema = z.object({
    userId: z.uuid(),
    cardId: z.string().min(1),
});

export const setQuantitySchema = z.object({ quantity: z.int().min(0) });