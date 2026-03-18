import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { AuthenticatedRequest } from './authenticate';
import { UserRole } from '../api/services/AuthService';

export const authorizeRoles = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authUser = (req as AuthenticatedRequest).authUser;

        if (!authUser) {
            throw new AppError('Usuário não autenticado.', 401);
        }

        if (!roles.includes(authUser.role)) {
            throw new AppError('Usuário sem permissão para acessar este recurso.', 403);
        }

        next();
    };
};