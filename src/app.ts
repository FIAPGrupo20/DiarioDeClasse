import 'express-async-errors'; // Deve ser importado no topo
import express, { Request, Response, NextFunction } from 'express';
import { router } from './routes/PostRoutes';
import { AppError } from './utils/AppError';

const app = express();

// Middlewares
app.use(express.json());

// Rotas
app.use(router);

// Middleware Global de Tratamento de Erros
app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message,
        });
    }

    // Para erros não esperados (erros de servidor)
    console.error(error);
    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});

export { app };
