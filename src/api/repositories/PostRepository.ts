import { Post } from '../models/Post';
export class PostRepository {
    // Simulação de banco de dados em memória
    // Inicializamos com alguns dados para facilitar os testes
    private posts: Post[] = [
        {
            id: 1,
            titulo: 'Bem-vindo ao Diario',
            conteudo: 'Este é o primeiro post do sistema.',
            autor: 'Professor João',
            dataCriacao: new Date('2026-01-01')
        },
        {
            id: 2,
            titulo: 'Segundo Post',
            conteudo: 'Conteúdo do segundo post sobre Node.js',
            autor: 'Professor Maria',
            dataCriacao: new Date('2026-01-02')
        },
        {
            id: 3,
            titulo: 'Terceiro Post',
            conteudo: 'Express é um framework incrível',
            autor: 'Professor Pedro',
            dataCriacao: new Date('2026-01-03')
        }
    ];

    // Variável para controlar o último ID gerado, simulando uma sequence de banco de dados
    private proximoId: number = 4;

    public findAll(): Post[] {
        return this.posts;
    }

    public findById(id: number): Post | undefined {
        return this.posts.find(post => post.id === id);
    }

    public findByText(query: string): Post[] {
        const palavraChave = query.toLowerCase();
        return this.posts.filter(post => 
            post.titulo.toLowerCase().includes(palavraChave) || 
            post.conteudo.toLowerCase().includes(palavraChave)
        );
    }

    public create(data: Omit<Post, 'id' | 'dataCriacao'>): Post {
        const newPost: Post = { id: this.proximoId, dataCriacao: new Date(), ...data };
        this.posts.push(newPost);
        this.proximoId++;
        return newPost;
    }

    public update(id: number, data: Partial<Omit<Post, 'id'>>): Post | null {
        const index = this.posts.findIndex(post => post.id === id);
        if (index === -1) return null;

        // Atualiza apenas os campos enviados, mantendo o ID original
        this.posts[index] = { ...this.posts[index], ...data };
        return this.posts[index];
    }

    public delete(id: number): boolean {
        const index = this.posts.findIndex(post => post.id === id);
        if (index === -1) return false;

        this.posts.splice(index, 1);
        return true;
    }
}
