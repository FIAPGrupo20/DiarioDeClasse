import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../../src/api/services/AuthService';
import { ProfessorRepository } from '../../../src/api/repositories/ProfessorRepository';
import { AlunoRepository } from '../../../src/api/repositories/AlunoRepository';

jest.mock('bcryptjs', () => ({
    compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('token-fake')
}));

const makeProfessorRepositoryMock = () => ({
    findByEmail: jest.fn()
}) as unknown as ProfessorRepository;

const makeAlunoRepositoryMock = () => ({
    findByEmail: jest.fn()
}) as unknown as AlunoRepository;

describe('AuthService', () => {
    it('deve autenticar professor com sucesso', async () => {
        const professorRepository = makeProfessorRepositoryMock();
        const alunoRepository = makeAlunoRepositoryMock();
        const authService = new AuthService(professorRepository, alunoRepository);

        (professorRepository.findByEmail as jest.Mock).mockResolvedValue({
            id: 1,
            nome: 'João',
            email: 'joao@escola.edu.br',
            disciplina: 'Matemática',
            passwordHash: 'hash'
        });
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const result = await authService.login({ email: 'joao@escola.edu.br', senha: '123456', role: 'professor' });

        expect(result.token).toBe('token-fake');
        expect(result.user.role).toBe('professor');
        expect(jwt.sign).toHaveBeenCalled();
    });

    it('deve autenticar aluno com sucesso', async () => {
        const professorRepository = makeProfessorRepositoryMock();
        const alunoRepository = makeAlunoRepositoryMock();
        const authService = new AuthService(professorRepository, alunoRepository);

        (alunoRepository.findByEmail as jest.Mock).mockResolvedValue({
            id: 2,
            nome: 'Ana',
            email: 'ana@escola.edu.br',
            turma: '7A',
            passwordHash: 'hash'
        });
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const result = await authService.login({ email: 'ana@escola.edu.br', senha: '123456', role: 'aluno' });

        expect(result.token).toBe('token-fake');
        expect(result.user.role).toBe('aluno');
    });
});