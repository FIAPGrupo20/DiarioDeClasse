import { Router } from 'express';
import { AlunoController } from '../api/controllers/AlunoController';

const router = Router();
const alunoController = new AlunoController();

/**
 * @swagger
 * tags:
 *   name: Alunos
 *   description: Gerenciamento de alunos
 */

/**
 * @swagger
 * /alunos:
 *   get:
 *     summary: Lista todos os alunos
 *     tags: [Alunos]
 *     responses:
 *       200:
 *         description: Lista de alunos recuperada com sucesso
 */
router.get('/alunos', alunoController.getAll);

/**
 * @swagger
 * /alunos/{id}:
 *   get:
 *     summary: Obtém um aluno pelo ID
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico do aluno
 *     responses:
 *       200:
 *         description: Detalhes do aluno
 *       404:
 *         description: Aluno não encontrado
 */
router.get('/alunos/:id', alunoController.getById);

/**
 * @swagger
 * /alunos:
 *   post:
 *     summary: Cadastra um novo aluno
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - turma
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               turma:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 *       409:
 *         description: E-mail já cadastrado
 */
router.post('/alunos', alunoController.create);

/**
 * @swagger
 * /alunos/{id}:
 *   put:
 *     summary: Atualiza um aluno existente
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               turma:
 *                 type: string
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *       404:
 *         description: Aluno não encontrado
 */
router.put('/alunos/:id', alunoController.update);

/**
 * @swagger
 * /alunos/{id}:
 *   delete:
 *     summary: Remove um aluno
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Aluno removido com sucesso
 *       404:
 *         description: Aluno não encontrado
 */
router.delete('/alunos/:id', alunoController.delete);

export { router as alunoRouter };