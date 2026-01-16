import { PostRepository } from '../../../src/api/repositories/PostRepository';
import { Post } from '../../../src/api/models/Post';

describe('PostRepository', () => {
    let postRepository: PostRepository;

    beforeEach(() => {

        postRepository = new PostRepository();
    });

    describe('findAll', () => {
        it('deve retornar todos os posts', () => {

            const posts = postRepository.findAll();

            
            expect(posts).toHaveLength(3);
            expect(posts[0].titulo).toBe('Bem-vindo ao Diario');
            expect(posts[1].titulo).toBe('Segundo Post');
            expect(posts[2].titulo).toBe('Terceiro Post');
        });

        it('deve retornar array com dados esperados', () => {

            const posts = postRepository.findAll();

            
            expect(posts).toEqual([
                {
                    id: 1,
                    titulo: 'Bem-vindo ao Diario',
                    conteudo: 'Este é o primeiro post do sistema.',
                    autor: 'Professor João',
                    dataCriacao: expect.any(Date)
                },
                {
                    id: 2,
                    titulo: 'Segundo Post',
                    conteudo: 'Conteúdo do segundo post sobre Node.js',
                    autor: 'Professor Maria',
                    dataCriacao: expect.any(Date)
                },
                {
                    id: 3,
                    titulo: 'Terceiro Post',
                    conteudo: 'Express é um framework incrível',
                    autor: 'Professor Pedro',
                    dataCriacao: expect.any(Date)
                }
            ]);
        });
    });

    describe('findById', () => {
        it('deve encontrar um post por ID', () => {

            const post = postRepository.findById(1);

            
            expect(post).toBeDefined();
            expect(post?.id).toBe(1);
            expect(post?.titulo).toBe('Bem-vindo ao Diario');
        });

        it('deve retornar undefined quando post não existe', () => {

            const post = postRepository.findById(999);

            
            expect(post).toBeUndefined();
        });

        it('deve encontrar o último post', () => {

            const post = postRepository.findById(3);

            
            expect(post).toBeDefined();
            expect(post?.titulo).toBe('Terceiro Post');
        });

        it('deve retornar undefined para ID negativo', () => {

            const post = postRepository.findById(-1);

            
            expect(post).toBeUndefined();
        });

        it('deve retornar undefined para ID zero', () => {

            const post = postRepository.findById(0);

            
            expect(post).toBeUndefined();
        });
    });

    describe('findByText', () => {
        it('deve buscar posts por título (case-insensitive)', () => {

            const posts = postRepository.findByText('bem');

            
            expect(posts).toHaveLength(1);
            expect(posts[0].titulo).toBe('Bem-vindo ao Diario');
        });

        it('deve buscar posts por conteúdo', () => {

            const posts = postRepository.findByText('Node.js');

            
            expect(posts).toHaveLength(1);
            expect(posts[0].titulo).toBe('Segundo Post');
        });

        it('deve fazer busca case-insensitive no conteúdo', () => {

            const posts = postRepository.findByText('express');

            
            expect(posts).toHaveLength(1);
            expect(posts[0].conteudo).toContain('Express');
        });

        it('deve retornar múltiplos posts quando correspondência está em vários', () => {
            
            postRepository.create({
                titulo: 'Post sobre Node.js',
                conteudo: 'Aprendendo Node.js',
                autor: 'Professor'
            });


            const posts = postRepository.findByText('Node');

            
            expect(posts.length).toBeGreaterThan(1);
        });

        it('deve retornar array vazio quando nenhuma correspondência', () => {

            const posts = postRepository.findByText('Python');

            
            expect(posts).toEqual([]);
        });

        it('deve ser case-insensitive no título', () => {

            const postsLower = postRepository.findByText('diario');
            const postsUpper = postRepository.findByText('DIARIO');
            const postsMixed = postRepository.findByText('DiArio');

            
            expect(postsLower).toHaveLength(1);
            expect(postsUpper).toHaveLength(1);
            expect(postsMixed).toHaveLength(1);
        });
    });

    describe('create', () => {
        it('deve criar um novo post com sucesso', () => {
            
            const newPostData = {
                titulo: 'Novo Post',
                conteudo: 'Conteúdo do novo post com pelo menos 10 caracteres',
                autor: 'Novo Autor'
            };


            const createdPost = postRepository.create(newPostData);

            
            expect(createdPost).toMatchObject(newPostData);
            expect(createdPost.id).toBe(4);
            expect(createdPost.dataCriacao).toBeInstanceOf(Date);
        });

        it('deve incrementar o ID corretamente', () => {

            const post1 = postRepository.create({
                titulo: 'Post 1',
                conteudo: 'Conteúdo 1 com mais de 10 caracteres',
                autor: 'Autor 1'
            });
            const post2 = postRepository.create({
                titulo: 'Post 2',
                conteudo: 'Conteúdo 2 com mais de 10 caracteres',
                autor: 'Autor 2'
            });

            
            expect(post1.id).toBe(4);
            expect(post2.id).toBe(5);
        });

        it('deve adicionar o novo post ao repositório', () => {
            
            const initialCount = postRepository.findAll().length;


            postRepository.create({
                titulo: 'Post Novo',
                conteudo: 'Conteúdo novo com mais de 10 caracteres',
                autor: 'Novo Autor'
            });

            
            const finalCount = postRepository.findAll().length;
            expect(finalCount).toBe(initialCount + 1);
        });

        it('deve retornar o post criado com ID e data', () => {

            const createdPost = postRepository.create({
                titulo: 'Post com Data',
                conteudo: 'Conteúdo com mais de dez caracteres',
                autor: 'Autor'
            });

            
            expect(createdPost).toHaveProperty('id');
            expect(createdPost).toHaveProperty('dataCriacao');
            expect(createdPost.id).toBeGreaterThan(0);
        });
    });

    describe('update', () => {
        it('deve atualizar um post com sucesso', () => {

            const updated = postRepository.update(1, { titulo: 'Título Atualizado' });

            
            expect(updated).not.toBeNull();
            expect(updated?.titulo).toBe('Título Atualizado');
            expect(updated?.id).toBe(1);
            expect(updated?.conteudo).toBe('Este é o primeiro post do sistema.');
        });

        it('deve retornar null quando post não existe', () => {

            const updated = postRepository.update(999, { titulo: 'Novo Título' });

            
            expect(updated).toBeNull();
        });

        it('deve atualizar múltiplos campos', () => {

            const updated = postRepository.update(1, {
                titulo: 'Novo Título',
                autor: 'Novo Autor'
            });

            
            expect(updated?.titulo).toBe('Novo Título');
            expect(updated?.autor).toBe('Novo Autor');
            expect(updated?.conteudo).toBe('Este é o primeiro post do sistema.');
        });

        it('deve manter ID inalterado após atualização', () => {

            const updated = postRepository.update(2, {
                titulo: 'Totalmente Novo',
                conteudo: 'Novo conteúdo com bastante caracteres',
                autor: 'Professor X'
            });

            
            expect(updated?.id).toBe(2);
        });

        it('deve permitir atualização parcial de campos', () => {

            const updated = postRepository.update(1, { titulo: 'Somente Título' });

            
            expect(updated?.titulo).toBe('Somente Título');
            expect(updated?.autor).toBe('Professor João');
            expect(updated?.conteudo).toBe('Este é o primeiro post do sistema.');
        });

        it('deve preservar dataCriacao original após atualização', () => {
            
            const original = postRepository.findById(1);
            const originalDate = original?.dataCriacao;


            postRepository.update(1, { titulo: 'Novo Título' });
            const updated = postRepository.findById(1);

            
            expect(updated?.dataCriacao).toEqual(originalDate);
        });

        it('deve retornar o post atualizado refletido no repositório', () => {

            const updated = postRepository.update(1, { titulo: 'Verificado' });
            const retrieved = postRepository.findById(1);

            
            expect(retrieved?.titulo).toBe('Verificado');
            expect(retrieved?.titulo).toEqual(updated?.titulo);
        });
    });

    describe('delete', () => {
        it('deve deletar um post com sucesso', () => {
            
            const initialCount = postRepository.findAll().length;


            const deleted = postRepository.delete(3);

            
            expect(deleted).toBe(true);
            expect(postRepository.findAll().length).toBe(initialCount - 1);
            expect(postRepository.findById(3)).toBeUndefined();
        });

        it('deve retornar false quando post não existe', () => {

            const deleted = postRepository.delete(999);

            
            expect(deleted).toBe(false);
        });

        it('deve retornar false para ID negativo', () => {

            const deleted = postRepository.delete(-1);

            
            expect(deleted).toBe(false);
        });

        it('deve remover o post corretamente do array', () => {
            
            const preDelete = postRepository.findById(1);


            postRepository.delete(1);
            const postDelete = postRepository.findById(1);

            
            expect(preDelete).toBeDefined();
            expect(postDelete).toBeUndefined();
        });

        it('deve não afetar outros posts após deleção', () => {
            
            const postBefore = postRepository.findById(2);


            postRepository.delete(1);

            
            const postAfter = postRepository.findById(2);
            expect(postBefore).toEqual(postAfter);
        });

        it('deve permitir deleção de todos os posts', () => {

            postRepository.delete(1);
            postRepository.delete(2);
            postRepository.delete(3);

            
            expect(postRepository.findAll().length).toBe(0);
        });
    });

    describe('Integration scenarios', () => {
        it('deve manter consistência após operações múltiplas', () => {

            const post1 = postRepository.create({
                titulo: 'Post 1',
                conteudo: 'Conteúdo 1 com muitos caracteres',
                autor: 'Autor 1'
            });
            const post2 = postRepository.create({
                titulo: 'Post 2',
                conteudo: 'Conteúdo 2 com muitos caracteres',
                autor: 'Autor 2'
            });
            postRepository.update(post1.id, { titulo: 'Post 1 Atualizado' });
            postRepository.delete(post2.id);

            
            const all = postRepository.findAll();
            expect(all.some(p => p.id === post1.id)).toBe(true);
            expect(all.some(p => p.id === post2.id)).toBe(false);
            expect(postRepository.findById(post1.id)?.titulo).toBe('Post 1 Atualizado');
        });
    });
});
