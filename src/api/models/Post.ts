import mongoose, { Schema, Document } from 'mongoose';

export interface IPost {
    id: number;
    titulo: string;
    conteudo: string;
    autor: string;
    dataCriacao: Date;
}

export interface Post extends IPost, Document { }

const PostSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    titulo: { type: String, required: true },
    conteudo: { type: String, required: true },
    autor: { type: String, required: true },
    dataCriacao: { type: Date, default: Date.now }
});

export const PostModel = mongoose.model<Post>('Post', PostSchema);
