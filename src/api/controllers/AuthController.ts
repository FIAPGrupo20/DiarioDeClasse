import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        const result = await this.authService.login(req.body);
        res.status(200).json({ status: 'success', ...result });
    };

    public me = async (req: Request, res: Response): Promise<void> => {
        res.status(200).json({ status: 'success', user: (req as any).authUser });
    };
}