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
            $or: [{ titulo: regex }, { conteudo: regex }, { disciplina: regex }]
        });
    }

    public async search(filters: {
        texto?: string;
        professor?: string;
        disciplina?: string;
        orderBy?: 'titulo' | 'dataCriacao';
        order?: 'asc' | 'desc';
    } = {}): Promise<Post[]> {
        const query: any = {};

        // Filtro por texto (busca em título e conteúdo)
        if (filters.texto && filters.texto.trim()) {
            const escapedQuery = filters.texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedQuery, 'i');
            query.$or = [
                { titulo: regex },
                { conteudo: regex }
            ];
        }

        // Filtro por professor (autor)
        if (filters.professor && filters.professor.trim()) {
            const escapedProfessor = filters.professor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedProfessor, 'i');
            query.autor = regex;
        }

        // Filtro por disciplina
        if (filters.disciplina && filters.disciplina.trim()) {
            query.disciplina = filters.disciplina.trim();
        }

        // Ordenação
        const sortOrder = filters.order === 'asc' ? 1 : -1;
        const sortField = filters.orderBy === 'titulo' ? 'titulo' : 'dataCriacao';

        return await PostModel.find(query).sort({ [sortField]: sortOrder });
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
