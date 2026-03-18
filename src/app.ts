import 'express-async-errors'; // Deve ser importado no topo
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { router as postRouter } from './routes/PostRoutes';
import { professorRouter } from './routes/ProfessorRoutes';
import { alunoRouter } from './routes/AlunoRoutes';
import { authRouter } from './routes/AuthRoutes';
import { AppError } from './utils/AppError';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Documentação da API (Swagger)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use(postRouter);
app.use(professorRouter);
app.use(alunoRouter);
app.use(authRouter);

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
