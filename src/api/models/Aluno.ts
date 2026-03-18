import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Aluno:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - turma
 *         - passwordHash
 *       properties:
 *         id:
 *           type: number
 *           description: Identificador único e auto-gerenciado do aluno
 *         nome:
 *           type: string
 *           description: Nome completo do aluno
 *         email:
 *           type: string
 *           description: E-mail do aluno
 *         turma:
 *           type: string
 *           description: Turma do aluno
 *         senha:
 *           type: string
 *           description: Senha de autenticação do aluno
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *       example:
 *         id: 1
 *         nome: Ana Souza
 *         email: ana.souza@escola.edu.br
 *         turma: 7A
 *         dataCriacao: 2024-05-20T10:00:00.000Z
 */
export interface IAluno {
    id: number;
    nome: string;
    email: string;
    turma: string;
    passwordHash: string;
    dataCriacao: Date;
}

export interface Aluno extends IAluno, Document { }

const AlunoSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    turma: { type: String, required: true },
    passwordHash: { type: String, required: true },
    dataCriacao: { type: Date, default: Date.now }
}, {
    toJSON: {
        transform: (_, ret: any) => {
            delete ret._id;
            delete ret.__v;
            delete ret.passwordHash;
        }
    }
});

export const AlunoModel = mongoose.model<Aluno>('Aluno', AlunoSchema);