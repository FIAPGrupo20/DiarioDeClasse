import { Request, Response } from 'express';
import { ProfessorService } from '../services/ProfessorService';

export class ProfessorController {
    private professorService: ProfessorService;

    constructor() {
        this.professorService = new ProfessorService();
    }

    public getAll = async (req: Request, res: Response): Promise<void> => {
        const result = await this.professorService.getAll();
        res.status(200).json({ status: 'success', ...result });
    };

    public getById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const professor = await this.professorService.getById(id);
        res.status(200).json({ status: 'success', ...professor.toJSON() });
    };

    public create = async (req: Request, res: Response): Promise<void> => {
        const newProfessor = await this.professorService.create(req.body);
        res.status(201).json({ status: 'success', ...newProfessor.toJSON() });
    };

    public update = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const updatedProfessor = await this.professorService.update(id, req.body);
        res.status(200).json({ status: 'success', ...updatedProfessor.toJSON() });
    };

    public delete = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await this.professorService.delete(id);
        res.status(200).json({ status: 'success' });
    };
}