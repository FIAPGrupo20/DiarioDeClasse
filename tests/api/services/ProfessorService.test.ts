import { ProfessorService } from '../../../src/api/services/ProfessorService';
import { ProfessorRepository } from '../../../src/api/repositories/ProfessorRepository';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed-password')
}));

const makeProfessorRepositoryMock = () => {
    return {
        findAll: jest.fn(),
        findById: jest.fn(),
        findByEmail: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    } as unknown as ProfessorRepository;
};

describe('ProfessorService', () => {
    let professorService: ProfessorService;
    let professorRepositoryMock: ReturnType<typeof makeProfessorRepositoryMock>;

    beforeEach(() => {
        professorRepositoryMock = makeProfessorRepositoryMock();
        professorService = new ProfessorService(professorRepositoryMock);
    });

    describe('create', () => {
        it('deve criar um professor com sucesso quando os dados são válidos', async () => {
            const professorData = {
                nome: 'João da Silva',
                email: 'joao@escola.edu.br',
                disciplina: 'Matemática',
                senha: '123456'
            };
            const createdProfessor = { id: 1, dataCriacao: new Date(), nome: professorData.nome, email: professorData.email, disciplina: professorData.disciplina };

            (professorRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(null);
            (professorRepositoryMock.create as jest.Mock).mockResolvedValue(createdProfessor);

            const result = await professorService.create(professorData);

            expect(result).toEqual(createdProfessor);
            expect(professorRepositoryMock.findByEmail).toHaveBeenCalledWith(professorData.email);
            expect(bcrypt.hash).toHaveBeenCalledWith(professorData.senha, 10);
            expect(professorRepositoryMock.create).toHaveBeenCalledWith({
                nome: professorData.nome,
                email: professorData.email,
                disciplina: professorData.disciplina,
                passwordHash: 'hashed-password'
            });
        });

        it('deve lançar AppError se o e-mail já estiver cadastrado', async () => {
            const professorData = {
                nome: 'João da Silva',
                email: 'joao@escola.edu.br',
                disciplina: 'Matemática',
                senha: '123456'
            };

            (professorRepositoryMock.findByEmail as jest.Mock).mockResolvedValue({ id: 10, ...professorData });

            await expect(professorService.create(professorData))
                .rejects
                .toThrow('Já existe professor cadastrado com este e-mail.');
        });

        it('deve lançar AppError se o nome for inválido', async () => {
            await expect(professorService.create({ nome: 'Oi', email: 'joao@escola.edu.br', disciplina: 'Matemática', senha: '123456' }))
                .rejects
                .toThrow('O nome é obrigatório e deve ter pelo menos 3 caracteres.');
        });

        it('deve lançar AppError se o e-mail for inválido', async () => {
            await expect(professorService.create({ nome: 'João', email: 'email-invalido', disciplina: 'Matemática', senha: '123456' }))
                .rejects
                .toThrow('O e-mail é obrigatório e deve ser válido.');
        });

        it('deve lançar AppError se a disciplina for inválida', async () => {
            await expect(professorService.create({ nome: 'João', email: 'joao@escola.edu.br', disciplina: 'TI', senha: '123456' }))
                .rejects
                .toThrow('A disciplina é obrigatória e deve ter pelo menos 3 caracteres.');
        });

        it('deve lançar AppError se a senha for inválida', async () => {
            await expect(professorService.create({ nome: 'João', email: 'joao@escola.edu.br', disciplina: 'Matemática', senha: '123' }))
                .rejects
                .toThrow('A senha é obrigatória e deve ter pelo menos 6 caracteres.');
        });
    });

    describe('getAll', () => {
        it('deve retornar todos os professores com sucesso', async () => {
            const professores = [
                { id: 1, nome: 'João', email: 'joao@escola.edu.br', disciplina: 'Matemática', dataCriacao: new Date() },
                { id: 2, nome: 'Maria', email: 'maria@escola.edu.br', disciplina: 'História', dataCriacao: new Date() }
            ];
            (professorRepositoryMock.findAll as jest.Mock).mockResolvedValue(professores);

            const result = await professorService.getAll();

            expect(result.total).toBe(2);
            expect(result.professores).toEqual(professores);
        });
    });

    describe('getById', () => {
        it('deve retornar um professor por ID com sucesso', async () => {
            const professor = { id: 1, nome: 'João', email: 'joao@escola.edu.br', disciplina: 'Matemática', dataCriacao: new Date() };
            (professorRepositoryMock.findById as jest.Mock).mockResolvedValue(professor);

            const result = await professorService.getById(1);

            expect(result).toEqual(professor);
            expect(professorRepositoryMock.findById).toHaveBeenCalledWith(1);
        });

        it('deve lançar AppError quando professor não existe', async () => {
            (professorRepositoryMock.findById as jest.Mock).mockResolvedValue(null);

            await expect(professorService.getById(999))
                .rejects
                .toThrow('Professor não encontrado.');
        });
    });

    describe('update', () => {
        it('deve atualizar um professor com sucesso', async () => {
            const updateData = { disciplina: 'Física' };
            const updatedProfessor = { id: 1, nome: 'João', email: 'joao@escola.edu.br', disciplina: 'Física', dataCriacao: new Date() };

            (professorRepositoryMock.update as jest.Mock).mockResolvedValue(updatedProfessor);

            const result = await professorService.update(1, updateData);

            expect(result).toEqual(updatedProfessor);
            expect(professorRepositoryMock.update).toHaveBeenCalledWith(1, updateData);
        });

        it('deve impedir atualização para e-mail já usado por outro professor', async () => {
            (professorRepositoryMock.findByEmail as jest.Mock).mockResolvedValue({
                id: 2,
                nome: 'Maria',
                email: 'maria@escola.edu.br',
                disciplina: 'História',
                dataCriacao: new Date()
            });

            await expect(professorService.update(1, { email: 'maria@escola.edu.br' }))
                .rejects
                .toThrow('Já existe professor cadastrado com este e-mail.');
        });
    });

    describe('delete', () => {
        it('deve deletar um professor com sucesso', async () => {
            (professorRepositoryMock.delete as jest.Mock).mockResolvedValue(true);

            await professorService.delete(1);

            expect(professorRepositoryMock.delete).toHaveBeenCalledWith(1);
        });
    });
});