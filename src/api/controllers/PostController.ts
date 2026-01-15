import { Request, Response } from 'express';
import { PostService } from '../services/PostService';

export class PostController {
    private postService: PostService;

    constructor() {
        this.postService = new PostService();
    }

    public getAll = async (req: Request, res: Response): Promise<void> => {
        const result = await this.postService.getAll();
        res.status(200).json({ status: 'success', ...result });
    };

    public getById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const post = await this.postService.getById(id);
        res.status(200).json({ status: 'success', ...post.toJSON() });
    };

    public create = async (req: Request, res: Response): Promise<void> => {
        const newPost = await this.postService.create(req.body);
        res.status(201).json({ status: 'success', ...newPost.toJSON() });
    };

    public update = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const updatedPost = await this.postService.update(id, req.body);
        res.status(200).json({ status: 'success', ...updatedPost.toJSON() });
    };

    public delete = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await this.postService.delete(id);
        res.status(200).json({ status: 'success' });
    };

    public search = async (req: Request, res: Response): Promise<void> => {
        const query = req.query.q as string || '';
        const result = await this.postService.search(query);
        res.status(200).json({ status: 'success', ...result });
    };
}
