import { Request, Response } from 'express';
import { PostService } from '../services/PostService';

export class PostController {
    private postService: PostService;

    constructor() {
        this.postService = new PostService();
    }
    
    public getAll = (req: Request, res: Response): void => {
        const result = this.postService.getAll();
        res.status(200).json({ status: 'success', ...result });
    };

    public getById = (req: Request, res: Response): void => {
        const id = Number(req.params.id);
        const post = this.postService.getById(id);
        res.status(200).json({ status: 'success', ...post });
    };

    public create = (req: Request, res: Response): void => {
        const newPost = this.postService.create(req.body);
        res.status(201).json({ status: 'success', ...newPost });
    };

    public update = (req: Request, res: Response): void => {
        const id = Number(req.params.id);
        const updatedPost = this.postService.update(id, req.body);
        res.status(200).json({ status: 'success', ...updatedPost });
    };

    public delete = (req: Request, res: Response): void => {
        const id = Number(req.params.id);
        this.postService.delete(id);
        res.status(200).json({ status: 'success' });
    };

    public search = (req: Request, res: Response): void => {
        const query = req.query.q as string || '';
        const result = this.postService.search(query);
        res.status(200).json({ status: 'success', ...result });
    };
}
