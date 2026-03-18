import { Router } from 'express';
import { ProfessorController } from '../api/controllers/ProfessorController';

const router = Router();
const professorController = new ProfessorController();

/**
 * @swagger
 * tags:
 *   name: Professores
 *   description: Gerenciamento de professores
 */

/**
 * @swagger
 * /professores:
 *   get:
 *     summary: Lista todos os professores
 *     tags: [Professores]
 *     responses:
 *       200:
 *         description: Lista de professores recuperada com sucesso
 */
router.get('/professores', professorController.getAll);

/**
 * @swagger
 * /professores/{id}:
 *   get:
 *     summary: Obtém um professor pelo ID
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico do professor
 *     responses:
 *       200:
 *         description: Detalhes do professor
 *       404:
 *         description: Professor não encontrado
 */
router.get('/professores/:id', professorController.getById);

/**
 * @swagger
 * /professores:
 *   post:
 *     summary: Cadastra um novo professor
 *     tags: [Professores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - disciplina
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               disciplina:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Professor criado com sucesso
 *       409:
 *         description: E-mail já cadastrado
 */
router.post('/professores', professorController.create);

/**
 * @swagger
 * /professores/{id}:
 *   put:
 *     summary: Atualiza um professor existente
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do professor
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
 *               disciplina:
 *                 type: string
 *     responses:
 *       200:
 *         description: Professor atualizado com sucesso
 *       404:
 *         description: Professor não encontrado
 */
router.put('/professores/:id', professorController.update);

/**
 * @swagger
 * /professores/{id}:
 *   delete:
 *     summary: Remove um professor
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Professor removido com sucesso
 *       404:
 *         description: Professor não encontrado
 */
router.delete('/professores/:id', professorController.delete);

export { router as professorRouter };