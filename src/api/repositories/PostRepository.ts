import { Post, PostModel, IPost } from '../models/Post';

export class PostRepository {

    public async findAll(): Promise<Post[]> {
        return await PostModel.find();
    }

    public async findById(id: number): Promise<Post | null> {
        return await PostModel.findOne({ id: id });
    }

    public async findByText(query: string): Promise<Post[]> {
        // Escapa caracteres especiais para evitar erro na RegExp se o usuário digitar "(", "[", etc.
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedQuery, 'i');
        return await PostModel.find({
            $or: [{ titulo: regex }, { conteudo: regex }]
        });
    }

    public async create(data: Omit<IPost, 'id' | 'dataCriacao'>): Promise<Post> {
        // Gera um ID numérico baseado no timestamp para manter compatibilidade simples
        // Em produção, idealmente usaríamos o _id do Mongo ou um contador atômico
        const id = Date.now();
        const newPost = await PostModel.create({ ...data, id });
        return newPost;
    }

    public async update(id: number, data: Partial<Omit<IPost, 'id'>>): Promise<Post | null> {
        return await PostModel.findOneAndUpdate({ id: id }, data, { new: true });
    }

    public async delete(id: number): Promise<boolean> {
        const result = await PostModel.deleteOne({ id: id });
        return result.deletedCount > 0;
    }
}
