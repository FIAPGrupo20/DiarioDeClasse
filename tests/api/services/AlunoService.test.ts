import { AlunoService } from '../../../src/api/services/AlunoService';
import { AlunoRepository } from '../../../src/api/repositories/AlunoRepository';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed-password')
}));

const makeAlunoRepositoryMock = () => {
    return {
        findAll: jest.fn(),
        findById: jest.fn(),
        findByEmail: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    } as unknown as AlunoRepository;
};

describe('AlunoService', () => {
    let alunoService: AlunoService;
    let alunoRepositoryMock: ReturnType<typeof makeAlunoRepositoryMock>;

    beforeEach(() => {
        alunoRepositoryMock = makeAlunoRepositoryMock();
        alunoService = new AlunoService(alunoRepositoryMock);
    });

    describe('create', () => {
        it('deve criar um aluno com sucesso quando os dados são válidos', async () => {
            const alunoData = {
                nome: 'Ana Souza',
                email: 'ana@escola.edu.br',
                turma: '7A',
                senha: '123456'
            };
            const createdAluno = { id: 1, dataCriacao: new Date(), nome: alunoData.nome, email: alunoData.email, turma: alunoData.turma };

            (alunoRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(null);
            (alunoRepositoryMock.create as jest.Mock).mockResolvedValue(createdAluno);

            const result = await alunoService.create(alunoData);

            expect(result).toEqual(createdAluno);
            expect(alunoRepositoryMock.findByEmail).toHaveBeenCalledWith(alunoData.email);
            expect(bcrypt.hash).toHaveBeenCalledWith(alunoData.senha, 10);
            expect(alunoRepositoryMock.create).toHaveBeenCalledWith({
                nome: alunoData.nome,
                email: alunoData.email,
                turma: alunoData.turma,
                passwordHash: 'hashed-password'
            });
        });

        it('deve lançar AppError se o e-mail já estiver cadastrado', async () => {
            const alunoData = {
                nome: 'Ana Souza',
                email: 'ana@escola.edu.br',
                turma: '7A',
                senha: '123456'
            };

            (alunoRepositoryMock.findByEmail as jest.Mock).mockResolvedValue({ id: 10, ...alunoData });

            await expect(alunoService.create(alunoData))
                .rejects
                .toThrow('Já existe aluno cadastrado com este e-mail.');
        });

        it('deve lançar AppError se a senha for inválida', async () => {
            await expect(alunoService.create({ nome: 'Ana Souza', email: 'ana@escola.edu.br', turma: '7A', senha: '123' }))
                .rejects
                .toThrow('A senha é obrigatória e deve ter pelo menos 6 caracteres.');
        });
    });

    describe('getAll', () => {
        it('deve retornar todos os alunos com sucesso', async () => {
            const alunos = [
                { id: 1, nome: 'Ana', email: 'ana@escola.edu.br', turma: '7A', dataCriacao: new Date() },
                { id: 2, nome: 'Bruno', email: 'bruno@escola.edu.br', turma: '8B', dataCriacao: new Date() }
            ];
            (alunoRepositoryMock.findAll as jest.Mock).mockResolvedValue(alunos);

            const result = await alunoService.getAll();

            expect(result.total).toBe(2);
            expect(result.alunos).toEqual(alunos);
        });
    });

    describe('getById', () => {
        it('deve retornar um aluno por ID com sucesso', async () => {
            const aluno = { id: 1, nome: 'Ana', email: 'ana@escola.edu.br', turma: '7A', dataCriacao: new Date() };
            (alunoRepositoryMock.findById as jest.Mock).mockResolvedValue(aluno);

            const result = await alunoService.getById(1);

            expect(result).toEqual(aluno);
        });
    });

    describe('update', () => {
        it('deve atualizar um aluno com sucesso', async () => {
            const updateData = { turma: '8A' };
            const updatedAluno = { id: 1, nome: 'Ana', email: 'ana@escola.edu.br', turma: '8A', dataCriacao: new Date() };

            (alunoRepositoryMock.update as jest.Mock).mockResolvedValue(updatedAluno);

            const result = await alunoService.update(1, updateData);

            expect(result).toEqual(updatedAluno);
            expect(alunoRepositoryMock.update).toHaveBeenCalledWith(1, updateData);
        });
    });

    describe('delete', () => {
        it('deve deletar um aluno com sucesso', async () => {
            (alunoRepositoryMock.delete as jest.Mock).mockResolvedValue(true);

            await alunoService.delete(1);

            expect(alunoRepositoryMock.delete).toHaveBeenCalledWith(1);
        });
    });
});