import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ProfessorRepository } from '../repositories/ProfessorRepository';
import { AlunoRepository } from '../repositories/AlunoRepository';
import { AppError } from '../../utils/AppError';

export type UserRole = 'professor' | 'aluno';

export interface LoginInput {
    email: string;
    senha: string;
    role: UserRole;
}

export interface AuthUser {
    id: number;
    nome: string;
    email: string;
    role: UserRole;
    disciplina?: string;
    turma?: string;
}

export class AuthService {
    private professorRepository: ProfessorRepository;
    private alunoRepository: AlunoRepository;

    constructor(
        professorRepository: ProfessorRepository = new ProfessorRepository(),
        alunoRepository: AlunoRepository = new AlunoRepository()
    ) {
        this.professorRepository = professorRepository;
        this.alunoRepository = alunoRepository;
    }

    public async login(input: LoginInput): Promise<{ token: string; user: AuthUser }> {
        if (!input.email || !input.senha || !input.role) {
            throw new AppError('E-mail, senha e perfil são obrigatórios.', 400);
        }

        const user = input.role === 'professor'
            ? await this.professorRepository.findByEmail(input.email)
            : await this.alunoRepository.findByEmail(input.email);

        if (!user) {
            throw new AppError('Credenciais inválidas.', 401);
        }

        const isPasswordValid = await bcrypt.compare(input.senha, user.passwordHash);
        if (!isPasswordValid) {
            throw new AppError('Credenciais inválidas.', 401);
        }

        const authUser: AuthUser = input.role === 'professor'
            ? {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: 'professor',
                disciplina: (user as any).disciplina
            }
            : {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: 'aluno',
                turma: (user as any).turma
            };

        const token = jwt.sign(authUser, process.env.JWT_SECRET || 'diario-secret-dev', { expiresIn: '8h' });

        return { token, user: authUser };
    }
}