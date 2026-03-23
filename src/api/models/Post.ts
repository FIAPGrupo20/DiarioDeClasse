import mongoose, { Schema, Document } from 'mongoose';
import { DISCIPLINAS_ENSINO_MEDIO } from '../../constants/disciplinas';

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - titulo
 *         - conteudo
 *         - autor
 *         - disciplina
 *       properties:
 *         id:
 *           type: number
 *           description: Identificador único e auto-gerenciado do post
 *         titulo:
 *           type: string
 *           description: Título da postagem
 *         conteudo:
 *           type: string
 *           description: Conteúdo textual da postagem
 *         autor:
 *           type: string
 *           description: Nome do autor da postagem
 *         disciplina:
 *           type: string
 *           description: Disciplina relacionada à postagem
 *           enum:
 *             - Língua Portuguesa
 *             - Matemática
 *             - Biologia
 *             - Física
 *             - Química
 *             - História
 *             - Geografia
 *             - Filosofia
 *             - Sociologia
 *             - Língua Inglesa
 *             - Educação Física
 *             - Artes
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *       example:
 *         id: 1
 *         titulo: Introdução ao Swagger
 *         conteudo: O Swagger ajuda a documentar APIs de forma interativa.
 *         autor: Grupo 20
 *         disciplina: Tecnologia
 *         dataCriacao: 2024-05-20T10:00:00.000Z
 */
export interface IPost {
    id: number;
    titulo: string;
    conteudo: string;
    autor: string;
    disciplina: string;
    dataCriacao: Date;
}

export interface Post extends IPost, Document { }

const PostSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    titulo: { type: String, required: true },
    conteudo: { type: String, required: true },
    autor: { type: String, required: true },
    disciplina: { type: String, required: true, enum: DISCIPLINAS_ENSINO_MEDIO },
    dataCriacao: { type: Date, default: Date.now }
}, {
    toJSON: {
        transform: (_, ret: any) => {
            delete ret._id;
            delete ret.__v;
        }
    }
});

export const PostModel = mongoose.model<Post>('Post', PostSchema);
