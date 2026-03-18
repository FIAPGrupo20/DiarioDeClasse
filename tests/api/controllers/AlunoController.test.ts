import { Request, Response } from 'express';
import { AlunoController } from '../../../src/api/controllers/AlunoController';
import { AlunoService } from '../../../src/api/services/AlunoService';
import { AppError } from '../../../src/utils/AppError';
import { Aluno } from '../../../src/api/models/Aluno';

jest.mock('../../../src/api/services/AlunoService');

describe('AlunoController', () => {
    let alunoController: AlunoController;
    let mockAlunoService: jest.Mocked<AlunoService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockAlunoService = new AlunoService() as jest.Mocked<AlunoService>;

        alunoController = new AlunoController();
        (alunoController as any).alunoService = mockAlunoService;

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        mockRequest = {};
    });

    it('deve criar um aluno com sucesso', async () => {
        const newAlunoData = {
            nome: 'Ana Souza',
            email: 'ana@escola.edu.br',
            turma: '7A',
            senha: '123456'
        };
        const createdAlunoData = {
            id: 1,
            nome: 'Ana Souza',
            email: 'ana@escola.edu.br',
            turma: '7A',
            dataCriacao: new Date()
        };
        const createdAluno = { ...createdAlunoData, toJSON: jest.fn().mockReturnValue(createdAlunoData) } as unknown as Aluno;
        mockRequest.body = newAlunoData;
        mockAlunoService.create.mockResolvedValue(createdAluno);

        await alunoController.create(mockRequest as Request, mockResponse as Response);

        expect(mockAlunoService.create).toHaveBeenCalledWith(newAlunoData);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'success',
            ...createdAlunoData
        });
    });

    it('deve retornar todos os alunos com sucesso', async () => {
        const alunosData = [
            { id: 1, nome: 'Ana', email: 'ana@escola.edu.br', turma: '7A', dataCriacao: new Date() },
            { id: 2, nome: 'Bruno', email: 'bruno@escola.edu.br', turma: '8B', dataCriacao: new Date() }
        ];
        const alunos = alunosData.map(a => ({ ...a, toJSON: jest.fn().mockReturnValue(a) })) as unknown as Aluno[];
        mockAlunoService.getAll.mockResolvedValue({ total: 2, alunos });

        await alunoController.getAll(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ status: 'success', total: 2, alunos });
    });

    it('deve retornar 404 ao buscar aluno inexistente', async () => {
        mockRequest.params = { id: '999' };
        mockAlunoService.getById.mockRejectedValue(new AppError('Aluno não encontrado.', 404));

        await expect(alunoController.getById(mockRequest as Request, mockResponse as Response))
            .rejects
            .toMatchObject({ message: 'Aluno não encontrado.', statusCode: 404 });
    });
});