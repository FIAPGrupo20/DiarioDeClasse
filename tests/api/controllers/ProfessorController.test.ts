import { Request, Response } from 'express';
import { ProfessorController } from '../../../src/api/controllers/ProfessorController';
import { ProfessorService } from '../../../src/api/services/ProfessorService';
import { AppError } from '../../../src/utils/AppError';
import { Professor } from '../../../src/api/models/Professor';

jest.mock('../../../src/api/services/ProfessorService');

describe('ProfessorController', () => {
    let professorController: ProfessorController;
    let mockProfessorService: jest.Mocked<ProfessorService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockProfessorService = new ProfessorService() as jest.Mocked<ProfessorService>;

        professorController = new ProfessorController();
        (professorController as any).professorService = mockProfessorService;

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        mockRequest = {};
    });

    it('deve criar um professor com sucesso', async () => {
        const newProfessorData = {
            nome: 'João da Silva',
            email: 'joao@escola.edu.br',
            disciplina: 'Matemática',
            senha: '123456'
        };
        const createdProfessorData = {
            id: 1,
            nome: 'João da Silva',
            email: 'joao@escola.edu.br',
            disciplina: 'Matemática',
            dataCriacao: new Date()
        };
        const createdProfessor = { ...createdProfessorData, toJSON: jest.fn().mockReturnValue(createdProfessorData) } as unknown as Professor;
        mockRequest.body = newProfessorData;
        mockProfessorService.create.mockResolvedValue(createdProfessor);

        await professorController.create(mockRequest as Request, mockResponse as Response);

        expect(mockProfessorService.create).toHaveBeenCalledWith(newProfessorData);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'success',
            ...createdProfessorData
        });
    });

    it('deve retornar todos os professores com sucesso', async () => {
        const professoresData = [
            { id: 1, nome: 'João', email: 'joao@escola.edu.br', disciplina: 'Matemática', dataCriacao: new Date() },
            { id: 2, nome: 'Maria', email: 'maria@escola.edu.br', disciplina: 'História', dataCriacao: new Date() }
        ];
        const professores = professoresData.map(p => ({ ...p, toJSON: jest.fn().mockReturnValue(p) })) as unknown as Professor[];
        mockProfessorService.getAll.mockResolvedValue({ total: 2, professores });

        await professorController.getAll(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ status: 'success', total: 2, professores });
    });

    it('deve retornar 404 ao buscar professor inexistente', async () => {
        mockRequest.params = { id: '999' };
        mockProfessorService.getById.mockRejectedValue(new AppError('Professor não encontrado.', 404));

        await expect(professorController.getById(mockRequest as Request, mockResponse as Response))
            .rejects
            .toMatchObject({ message: 'Professor não encontrado.', statusCode: 404 });
    });
});