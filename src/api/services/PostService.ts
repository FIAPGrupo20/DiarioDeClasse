import { Post, IPost } from '../models/Post';
import { PostRepository } from '../repositories/PostRepository';
import { AppError } from '../../utils/AppError';

export class PostService {
    private postRepository: PostRepository;

    //Injeção de dependência para viabilizar os testes
    constructor(postRepository: PostRepository = new PostRepository()) {
        this.postRepository = postRepository;
    }

    public async getAll(): Promise<{ total: number; posts: Post[] }> {
        const posts = await this.postRepository.findAll();
        return {
            total: posts.length,
            posts
        };
    }

    public async getById(id: number): Promise<Post> {
        this.validarId(id);
        const post = await this.postRepository.findById(id);
        if (!post) {
            throw new AppError('Post não encontrado.', 404);
        }
        return post;
    }

    public async create(post: Omit<IPost, 'id' | 'dataCriacao'>): Promise<Post> {
        this.validarTitulo(post.titulo);
        this.validarConteudo(post.conteudo);
        this.validarAutor(post.autor);

        // Aqui usamos a variável 'post' que veio do parâmetro, e não 'postData'
        return await this.postRepository.create(post);
    }

    public async update(id: number, data: Partial<Omit<IPost, 'id' | 'dataCriacao'>>): Promise<Post> {
        this.validarId(id);

        // Valida se algum dado foi enviado para atualização
        if (Object.keys(data).length === 0) {
            throw new AppError('Nenhum dado fornecido para atualização.', 400);
        }

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

        // Sanitização: Garante que apenas campos permitidos sejam enviados ao banco
        const updateData: any = {};
        if (data.titulo) updateData.titulo = data.titulo;
        if (data.conteudo) updateData.conteudo = data.conteudo;
        if (data.autor) updateData.autor = data.autor;

        const updatedPost = await this.postRepository.update(id, updateData);
        if (!updatedPost) {
            throw new AppError('Post não encontrado.', 404);
        }
        return updatedPost;
    }

    public async delete(id: number): Promise<void> {
        this.validarId(id);
        const deleted = await this.postRepository.delete(id);
        if (!deleted) {
            throw new AppError('Post não encontrado.', 404);
        }
    }

    public async search(query: string): Promise<{ total: number; query: string; posts: Post[] }> {
        this.validarQuery(query);
        const posts = await this.postRepository.findByText(query);
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
