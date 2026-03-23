import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { AuthUser } from '../api/services/AuthService';

export interface AuthenticatedRequest extends Request {
    authUser?: AuthUser;
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Token de autenticação não fornecido.', 401);
    }

    const token = authHeader.replace('Bearer ', '').trim();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'diario-secret-dev') as AuthUser;
        (req as AuthenticatedRequest).authUser = decoded;
        next();
    } catch {
        throw new AppError('Token inválido ou expirado.', 401);
    }
};