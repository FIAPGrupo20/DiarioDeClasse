import { Router } from 'express';
import { PostController } from '../api/controllers/PostController';

const router = Router();
const postController = new PostController();

router.get('/posts', postController.getAll);
router.get('/posts/search', postController.search);
router.get('/posts/:id', postController.getById);
router.post('/posts', postController.create);
router.put('/posts/:id', postController.update);
router.delete('/posts/:id', postController.delete);

export { router };