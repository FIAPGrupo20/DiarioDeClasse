import bcrypt from 'bcryptjs';
import { Aluno, IAluno } from '../models/Aluno';
import { AlunoRepository } from '../repositories/AlunoRepository';
import { AppError } from '../../utils/AppError';

export interface CreateAlunoInput {
    nome: string;
    email: string;
    turma: string;
    senha: string;
}

export class AlunoService {
    private alunoRepository: AlunoRepository;

    constructor(alunoRepository: AlunoRepository = new AlunoRepository()) {
        this.alunoRepository = alunoRepository;
    }

    public async getAll(): Promise<{ total: number; alunos: Aluno[] }> {
        const alunos = await this.alunoRepository.findAll();
        return {
            total: alunos.length,
            alunos
        };
    }

    public async getById(id: number): Promise<Aluno> {
        this.validarId(id);
        const aluno = await this.alunoRepository.findById(id);
        if (!aluno) {
            throw new AppError('Aluno não encontrado.', 404);
        }

        return aluno;
    }

    public async create(aluno: CreateAlunoInput): Promise<Aluno> {
        this.validarNome(aluno.nome);
        this.validarEmail(aluno.email);
        this.validarTurma(aluno.turma);
        this.validarSenha(aluno.senha);

        const existingAluno = await this.alunoRepository.findByEmail(aluno.email);
        if (existingAluno) {
            throw new AppError('Já existe aluno cadastrado com este e-mail.', 409);
        }

        const passwordHash = await bcrypt.hash(aluno.senha, 10);

        return await this.alunoRepository.create({
            nome: aluno.nome,
            email: aluno.email,
            turma: aluno.turma,
            passwordHash
        });
    }

    public async update(id: number, data: Partial<Omit<IAluno, 'id' | 'dataCriacao'>>): Promise<Aluno> {
        this.validarId(id);

        if (Object.keys(data).length === 0) {
            throw new AppError('Nenhum dado fornecido para atualização.', 400);
        }

        if (data.nome !== undefined) {
            this.validarNome(data.nome);
        }

        if (data.email !== undefined) {
            this.validarEmail(data.email);
            const existingAluno = await this.alunoRepository.findByEmail(data.email);
            if (existingAluno && existingAluno.id !== id) {
                throw new AppError('Já existe aluno cadastrado com este e-mail.', 409);
            }
        }

        if (data.turma !== undefined) {
            this.validarTurma(data.turma);
        }

        const updateData: Partial<Omit<IAluno, 'id' | 'dataCriacao'>> = {};
        if (data.nome) updateData.nome = data.nome;
        if (data.email) updateData.email = data.email;
        if (data.turma) updateData.turma = data.turma;

        const updatedAluno = await this.alunoRepository.update(id, updateData);
        if (!updatedAluno) {
            throw new AppError('Aluno não encontrado.', 404);
        }

        return updatedAluno;
    }

    public async delete(id: number): Promise<void> {
        this.validarId(id);
        const deleted = await this.alunoRepository.delete(id);
        if (!deleted) {
            throw new AppError('Aluno não encontrado.', 404);
        }
    }

    private validarId(id: number) {
        if (isNaN(id) || id <= 0) {
            throw new AppError('ID inválido. Deve ser um número e maior que zero.', 400);
        }
    }

    private validarNome(nome: string | undefined) {
        if (!nome || nome.trim().length < 3) {
            throw new AppError('O nome é obrigatório e deve ter pelo menos 3 caracteres.', 422);
        }
    }

    private validarEmail(email: string | undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email.trim())) {
            throw new AppError('O e-mail é obrigatório e deve ser válido.', 422);
        }
    }

    private validarTurma(turma: string | undefined) {
        if (!turma || turma.trim().length < 2) {
            throw new AppError('A turma é obrigatória e deve ter pelo menos 2 caracteres.', 422);
        }
    }

    private validarSenha(senha: string | undefined) {
        if (!senha || senha.trim().length < 6) {
            throw new AppError('A senha é obrigatória e deve ter pelo menos 6 caracteres.', 422);
        }
    }
}