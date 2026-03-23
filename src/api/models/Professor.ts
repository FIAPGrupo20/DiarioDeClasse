import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Professor:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - disciplina
 *         - passwordHash
 *       properties:
 *         id:
 *           type: number
 *           description: Identificador único e auto-gerenciado do professor
 *         nome:
 *           type: string
 *           description: Nome completo do professor
 *         email:
 *           type: string
 *           description: E-mail do professor
 *         disciplina:
 *           type: string
 *           description: Disciplina principal do professor
 *         senha:
 *           type: string
 *           description: Senha de autenticação do professor
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *       example:
 *         id: 1
 *         nome: João da Silva
 *         email: joao.silva@escola.edu.br
 *         disciplina: Matemática
 *         dataCriacao: 2024-05-20T10:00:00.000Z
 */
export interface IProfessor {
    id: number;
    nome: string;
    email: string;
    disciplina: string;
    passwordHash: string;
    dataCriacao: Date;
}

export interface Professor extends IProfessor, Document { }

const ProfessorSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    disciplina: { type: String, required: true },
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

export const ProfessorModel = mongoose.model<Professor>('Professor', ProfessorSchema);