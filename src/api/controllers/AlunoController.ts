import { Request, Response } from 'express';
import { AlunoService } from '../services/AlunoService';

export class AlunoController {
    private alunoService: AlunoService;

    constructor() {
        this.alunoService = new AlunoService();
    }

    public getAll = async (req: Request, res: Response): Promise<void> => {
        const result = await this.alunoService.getAll();
        res.status(200).json({ status: 'success', ...result });
    };

    public getById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const aluno = await this.alunoService.getById(id);
        res.status(200).json({ status: 'success', ...aluno.toJSON() });
    };

    public create = async (req: Request, res: Response): Promise<void> => {
        const newAluno = await this.alunoService.create(req.body);
        res.status(201).json({ status: 'success', ...newAluno.toJSON() });
    };

    public update = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const updatedAluno = await this.alunoService.update(id, req.body);
        res.status(200).json({ status: 'success', ...updatedAluno.toJSON() });
    };

    public delete = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await this.alunoService.delete(id);
        res.status(200).json({ status: 'success' });
    };
}