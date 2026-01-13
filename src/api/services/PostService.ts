import { Post } from '../models/Post';
import { PostRepository } from '../repositories/PostRepository';
import { AppError } from '../../utils/AppError';

export class PostService {
    private postRepository: PostRepository;

    constructor() {
        this.postRepository = new PostRepository();
    }

    public getAll(): { total: number; posts: Post[] } {
        const posts = this.postRepository.findAll();
        return {
            total: posts.length,
            posts
        };
    }

    public getById(id: number): Post {
        this.validarId(id);
        const post = this.postRepository.findById(id);
        if (!post) {
            throw new AppError('Post não encontrado.', 404);
        }
        return post;
    }

    public create(post: Omit<Post, 'id' | 'dataCriacao'>): Post {
        this.validarTitulo(post.titulo);
        this.validarConteudo(post.conteudo);
        this.validarAutor(post.autor);

        return this.postRepository.create(post);
    }

    public update(id: number, data: Partial<Omit<Post, 'id' | 'dataCriacao'>>): Post {
        this.validarId(id);

        // Validações apenas se os campos forem informados
        if (data.titulo !== undefined) {
            this.validarTitulo(data.titulo);
        }
        if (data.conteudo !== undefined) {
            this.validarConteudo(data.conteudo);
        }
        if (data.autor !== undefined) {
            this.validarAutor(data.autor);
        }

        const updatedPost = this.postRepository.update(id, data);
        if (!updatedPost) {
            throw new AppError('Post não encontrado.', 404);
        }
        return updatedPost;
    }

    public delete(id: number): void {
        this.validarId(id);
        const deleted = this.postRepository.delete(id);
        if (!deleted) {
            throw new AppError('Post não encontrado.', 404);
        }
    }

    public search(query: string): { total: number; query: string; posts: Post[] } {
        this.validarQuery(query);
        const posts = this.postRepository.findByText(query);
        return {
            total: posts.length,
            query,
            posts
        };
    }

    private validarId(id: number) {
        if (isNaN(id) || id <= 0) {
            throw new AppError('ID inválido. Deve ser um número e maior que zero.', 400);
        }
    }

    private validarTitulo(titulo: string | undefined) {
        if (!titulo || titulo.trim().length < 3) {
            throw new AppError('O título é obrigatório e deve ter pelo menos 3 caracteres.', 422);
        }
    }

    private validarConteudo(conteudo: string | undefined) {
        if (!conteudo || conteudo.trim().length < 10) {
            throw new AppError('O conteúdo é obrigatório e deve ter pelo menos 10 caracteres.', 422);
        }
    }

    private validarAutor(autor: string | undefined) {
        if (!autor || autor.trim().length < 3) {
            throw new AppError('O autor é obrigatório e deve ter pelo menos 3 caracteres.', 422);
        }
    }

    private validarQuery(query: string | undefined) {
        if (!query || query.trim().length < 2) {
            throw new AppError('O termo de busca é obrigatório e deve ter pelo menos 2 caracteres.', 400);
        }
    }
}
