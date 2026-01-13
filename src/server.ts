import express, { Request, Response } from 'express';
import routes from './routes';

const app = express();
const PORT = 3000;

// ========== MIDDLEWARES ==========
app.use(express.json());

// ========== ROTAS ==========
app.use(routes);

// ========== TRATAMENTO DE ERROS E ROTAS NÃO ENCONTRADAS ==========

// Rota não encontrada
app.use((req: Request, res: Response) => {
    res.status(404).json({
        sucesso: false,
        erro: 'Rota não encontrada'
    });
});

// ========== INICIAR SERVIDOR ==========
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});