import { Router } from 'express';
import { PostController } from '../api/controllers/PostController';

const router = Router();
const postController = new PostController();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Gerenciamento de postagens do diário
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Lista todas as postagens
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de posts recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 total:
 *                   type: integer
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 */
router.get('/posts', postController.getAll);

/**
 * @swagger
 * /posts/search:
 *   get:
 *     summary: Busca postagens por termo (título ou conteúdo)
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Termo de pesquisa
 *     responses:
 *       200:
 *         description: Resultados da busca
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 total:
 *                   type: integer
 *                 query:
 *                   type: string
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       400:
 *         description: Termo de busca inválido
 */
router.get('/posts/search', postController.search);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Obtém uma postagem pelo ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico do post
 *     responses:
 *       200:
 *         description: Detalhes do post
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Post'
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: success
 *       404:
 *         description: Post não encontrado
 */
router.get('/posts/:id', postController.getById);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Cria uma nova postagem
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - conteudo
 *               - autor
 *             properties:
 *               titulo:
 *                 type: string
 *               conteudo:
 *                 type: string
 *               autor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Post'
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: success
 *       422:
 *         description: Erro de validação (campos obrigatórios ou inválidos)
 */
router.post('/posts', postController.create);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Atualiza uma postagem existente
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               conteudo:
 *                 type: string
 *               autor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Post'
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: success
 *       404:
 *         description: Post não encontrado
 */
router.put('/posts/:id', postController.update);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Remove uma postagem
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do post
 *     responses:
 *       200:
 *         description: Post removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Post não encontrado
 */
router.delete('/posts/:id', postController.delete);

export { router };