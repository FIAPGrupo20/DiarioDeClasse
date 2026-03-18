import bcrypt from 'bcryptjs';
import { Professor, IProfessor } from '../models/Professor';
import { ProfessorRepository } from '../repositories/ProfessorRepository';
import { AppError } from '../../utils/AppError';

export interface CreateProfessorInput {
    nome: string;
    email: string;
    disciplina: string;
    senha: string;
}

export class ProfessorService {
    private professorRepository: ProfessorRepository;

    constructor(professorRepository: ProfessorRepository = new ProfessorRepository()) {
        this.professorRepository = professorRepository;
    }

    public async getAll(): Promise<{ total: number; professores: Professor[] }> {
        const professores = await this.professorRepository.findAll();
        return {
            total: professores.length,
            professores
        };
    }

    public async getById(id: number): Promise<Professor> {
        this.validarId(id);
        const professor = await this.professorRepository.findById(id);
        if (!professor) {
            throw new AppError('Professor não encontrado.', 404);
        }

        return professor;
    }

    public async create(professor: CreateProfessorInput): Promise<Professor> {
        this.validarNome(professor.nome);
        this.validarEmail(professor.email);
        this.validarDisciplina(professor.disciplina);
        this.validarSenha(professor.senha);

        const existingProfessor = await this.professorRepository.findByEmail(professor.email);
        if (existingProfessor) {
            throw new AppError('Já existe professor cadastrado com este e-mail.', 409);
        }

        const passwordHash = await bcrypt.hash(professor.senha, 10);

        return await this.professorRepository.create({
            nome: professor.nome,
            email: professor.email,
            disciplina: professor.disciplina,
            passwordHash
        });
    }

    public async update(id: number, data: Partial<Omit<IProfessor, 'id' | 'dataCriacao'>>): Promise<Professor> {
        this.validarId(id);

        if (Object.keys(data).length === 0) {
            throw new AppError('Nenhum dado fornecido para atualização.', 400);
        }

        if (data.nome !== undefined) {
            this.validarNome(data.nome);
        }

        if (data.email !== undefined) {
            this.validarEmail(data.email);
            const existingProfessor = await this.professorRepository.findByEmail(data.email);
            if (existingProfessor && existingProfessor.id !== id) {
                throw new AppError('Já existe professor cadastrado com este e-mail.', 409);
            }
        }

        if (data.disciplina !== undefined) {
            this.validarDisciplina(data.disciplina);
        }

        const updateData: Partial<Omit<IProfessor, 'id' | 'dataCriacao'>> = {};
        if (data.nome) updateData.nome = data.nome;
        if (data.email) updateData.email = data.email;
        if (data.disciplina) updateData.disciplina = data.disciplina;

        const updatedProfessor = await this.professorRepository.update(id, updateData);
        if (!updatedProfessor) {
            throw new AppError('Professor não encontrado.', 404);
        }

        return updatedProfessor;
    }

    public async delete(id: number): Promise<void> {
        this.validarId(id);
        const deleted = await this.professorRepository.delete(id);
        if (!deleted) {
            throw new AppError('Professor não encontrado.', 404);
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

    private validarDisciplina(disciplina: string | undefined) {
        if (!disciplina || disciplina.trim().length < 3) {
            throw new AppError('A disciplina é obrigatória e deve ter pelo menos 3 caracteres.', 422);
        }
    }

    private validarSenha(senha: string | undefined) {
        if (!senha || senha.trim().length < 6) {
            throw new AppError('A senha é obrigatória e deve ter pelo menos 6 caracteres.', 422);
        }
    }
}