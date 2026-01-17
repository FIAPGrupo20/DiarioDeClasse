import mongoose from 'mongoose';
import { PostRepository } from '../../../src/api/repositories/PostRepository';
import { PostModel } from '../../../src/api/models/Post';

describe('PostRepository', () => {
    let postRepository: PostRepository;

    beforeAll(async () => {
        // Conecta ao banco de dados de teste.
        // Se estiver rodando localmente sem variável definida, usa o localhost padrão.
        const dbString = process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/diario_de_classe_test';
        await mongoose.connect(dbString);
    });

    afterAll(async () => {
        // Limpa o banco e fecha a conexão ao final de todos os testes
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Limpa a coleção de posts antes de cada teste para garantir isolamento
        await PostModel.deleteMany({});
        postRepository = new PostRepository();
    });

    describe('findAll', () => {
        it('deve retornar todos os posts', async () => {
            // Arrange: Cria dados no banco para o teste ler
            await PostModel.create([
                { id: 1, titulo: 'Bem-vindo ao Diario', conteudo: 'Conteúdo 1', autor: 'A', dataCriacao: new Date() },
                { id: 2, titulo: 'Segundo Post', conteudo: 'Conteúdo 2', autor: 'B', dataCriacao: new Date() },
                { id: 3, titulo: 'Terceiro Post', conteudo: 'Conteúdo 3', autor: 'C', dataCriacao: new Date() }
            ]);

            // Act
            const posts = await postRepository.findAll();

            // Assert
            expect(posts).toHaveLength(3);
            // Verifica se os posts retornados contêm os dados esperados
            // Usamos expect.objectContaining para ignorar campos internos do Mongo (_id, __v)
            expect(posts).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ id: 1, titulo: 'Bem-vindo ao Diario' }),
                    expect.objectContaining({ id: 2, titulo: 'Segundo Post' }),
                    expect.objectContaining({ id: 3, titulo: 'Terceiro Post' })
                ])
            );
        });
    });

    describe('findById', () => {
        it('deve encontrar um post por ID', async () => {
            // Arrange
            await PostModel.create({
                id: 1,
                titulo: 'Bem-vindo ao Diario',
                conteudo: 'Conteúdo',
                autor: 'Autor',
                dataCriacao: new Date()
            });

            // Act
            const post = await postRepository.findById(1);

            // Assert
            expect(post).toBeDefined();
            expect(post?.id).toBe(1);
            expect(post?.titulo).toBe('Bem-vindo ao Diario');
        });

        it('deve retornar null quando post não existe', async () => {
            const post = await postRepository.findById(999);
            // Mongoose retorna null, não undefined
            expect(post).toBeNull();
        });
    });

    describe('findByText', () => {
        // Helper para criar massa de dados
        beforeEach(async () => {
            await PostModel.create([
                { id: 1, titulo: 'Bem-vindo ao Diario', conteudo: 'Intro', autor: 'A', dataCriacao: new Date() },
                { id: 2, titulo: 'Segundo Post', conteudo: 'Conteúdo sobre Node.js', autor: 'B', dataCriacao: new Date() },
                { id: 3, titulo: 'Terceiro Post', conteudo: 'Express é incrível', autor: 'C', dataCriacao: new Date() }
            ]);
        });

        it('deve buscar posts por título (case-insensitive)', async () => {
            const posts = await postRepository.findByText('bem');

            expect(posts).toHaveLength(1);
            expect(posts[0].titulo).toBe('Bem-vindo ao Diario');
        });

        it('deve buscar posts por conteúdo', async () => {
            const posts = await postRepository.findByText('Node.js');

            expect(posts).toHaveLength(1);
            expect(posts[0].titulo).toBe('Segundo Post');
        });

        it('deve fazer busca case-insensitive no conteúdo', async () => {
            const posts = await postRepository.findByText('express');

            expect(posts).toHaveLength(1);
            expect(posts[0].conteudo).toContain('Express');
        });

        it('deve retornar array vazio quando nenhuma correspondência', async () => {
            const posts = await postRepository.findByText('Python');
            expect(posts).toEqual([]);
        });
    });

    describe('create', () => {
        it('deve criar um novo post com sucesso', async () => {
            const newPostData = {
                titulo: 'Novo Post',
                conteudo: 'Conteúdo do novo post com pelo menos 10 caracteres',
                autor: 'Novo Autor'
            };

            const createdPost = await postRepository.create(newPostData);

            // Verifica o retorno da função
            expect(createdPost).toMatchObject(newPostData);
            expect(createdPost.id).toBeDefined();
            expect(typeof createdPost.id).toBe('number');
            expect(createdPost.dataCriacao).toBeInstanceOf(Date);

            // Verifica se realmente salvou no banco
            const savedPost = await PostModel.findOne({ id: createdPost.id });
            expect(savedPost).toBeDefined();
            expect(savedPost?.titulo).toBe(newPostData.titulo);
        });
    });

    describe('update', () => {
        beforeEach(async () => {
            await PostModel.create({
                id: 1,
                titulo: 'Original',
                conteudo: 'Conteúdo Original',
                autor: 'Autor Original',
                dataCriacao: new Date()
            });
        });

        it('deve atualizar um post com sucesso', async () => {
            const updated = await postRepository.update(1, { titulo: 'Título Atualizado' });

            expect(updated).not.toBeNull();
            expect(updated?.titulo).toBe('Título Atualizado');
            expect(updated?.id).toBe(1);
            // Conteúdo não deve ter mudado
            expect(updated?.conteudo).toBe('Conteúdo Original');

            // Verifica no banco
            const inDb = await PostModel.findOne({ id: 1 });
            expect(inDb?.titulo).toBe('Título Atualizado');
        });

        it('deve retornar null quando post não existe', async () => {
            const updated = await postRepository.update(999, { titulo: 'Novo Título' });
            expect(updated).toBeNull();
        });

        it('deve atualizar múltiplos campos', async () => {
            const updated = await postRepository.update(1, {
                titulo: 'Novo Título',
                autor: 'Novo Autor'
            });

            expect(updated?.titulo).toBe('Novo Título');
            expect(updated?.autor).toBe('Novo Autor');
        });

        it('deve preservar dataCriacao original após atualização', async () => {
            const original = await postRepository.findById(1);
            const originalDate = original?.dataCriacao;

            // Pequeno delay para garantir que se a data fosse atualizada, seria diferente
            await new Promise(r => setTimeout(r, 10));

            await postRepository.update(1, { titulo: 'Novo Título' });
            const updated = await postRepository.findById(1);

            expect(updated?.dataCriacao).toEqual(originalDate);
        });
    });

    describe('delete', () => {
        beforeEach(async () => {
            await PostModel.create({
                id: 1,
                titulo: 'Para Deletar',
                conteudo: 'Conteúdo',
                autor: 'Autor',
                dataCriacao: new Date()
            });
        });

        it('deve deletar um post com sucesso', async () => {
            const deleted = await postRepository.delete(1);

            expect(deleted).toBe(true);
            
            // Verifica se sumiu do banco
            const inDb = await PostModel.findOne({ id: 1 });
            expect(inDb).toBeNull();
        });

        it('deve retornar false quando post não existe', async () => {
            const deleted = await postRepository.delete(999);
            expect(deleted).toBe(false);
        });
    });

    describe('Integration scenarios', () => {
        it('deve manter consistência após operações múltiplas', async () => {
            // 1. Cria dois posts
            const post1 = await postRepository.create({
                titulo: 'Post 1',
                conteudo: 'Conteúdo 1 com muitos caracteres',
                autor: 'Autor 1'
            });
            const post2 = await postRepository.create({
                titulo: 'Post 2',
                conteudo: 'Conteúdo 2 com muitos caracteres',
                autor: 'Autor 2'
            });

            // 2. Atualiza um e deleta o outro
            await postRepository.update(post1.id, { titulo: 'Post 1 Atualizado' });
            await postRepository.delete(post2.id);

            // 3. Verifica estado final
            const all = await postRepository.findAll();
            
            // Deve ter sobrado apenas 1
            expect(all).toHaveLength(1);
            
            // O que sobrou deve ser o post 1 atualizado
            expect(all.some(p => p.id === post1.id)).toBe(true);
            expect(all.some(p => p.id === post2.id)).toBe(false);
            
            const retrievedPost1 = await postRepository.findById(post1.id);
            expect(retrievedPost1?.titulo).toBe('Post 1 Atualizado');
        });
    });
});
