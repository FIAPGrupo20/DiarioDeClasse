import { PostService } from '../../../src/api/services/PostService';
import { PostRepository } from '../../../src/api/repositories/PostRepository';
import { AppError } from '../../../src/utils/AppError';


const makePostRepositoryMock = () => {
    return {
        findAll: jest.fn(),
        findById: jest.fn(),
        findByText: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),

    } as unknown as PostRepository;
};

describe('PostService', () => {
    let postService: PostService;
    let postRepositoryMock: ReturnType<typeof makePostRepositoryMock>;

    beforeEach(() => {
        postRepositoryMock = makePostRepositoryMock();
        postService = new PostService(postRepositoryMock);
    });

    describe('create', () => {
        it('deve criar um post com sucesso quando os dados são válidos', () => {
            const postData = { 
                titulo: 'Título Válido de Teste', 
                conteudo: 'Conteúdo com mais de 10 caracteres para teste', 
                autor: 'Professor Teste' 
            };
            const createdPost = { id: 1, dataCriacao: new Date(), ...postData };
            (postRepositoryMock.create as jest.Mock).mockReturnValue(createdPost);

            const result = postService.create(postData);

            expect(result).toEqual(createdPost);
            expect(postRepositoryMock.create).toHaveBeenCalledWith(postData);
        });

        it('deve lançar AppError se o título for muito curto', () => {
            const postData = { titulo: 'Oi', conteudo: 'Conteúdo Válido', autor: 'Autor' };
            expect(() => postService.create(postData)).toThrow(AppError);
        });

        it('deve lançar AppError se o autor for muito curto', () => {
            const postData = { titulo: 'Título Válido de Teste', conteudo: 'Conteúdo Válido', autor: 'Oi' };
            expect(() => postService.create(postData)).toThrow(AppError);
        });

        it('deve lançar AppError se o conteúdo for muito curto', () => {
            const postData = { titulo: 'Título Válido de Teste', conteudo: 'Oi', autor: 'Autor' };
            expect(() => postService.create(postData)).toThrow(AppError);
        });

        it('deve lançar AppError se o título for vazio', () => {
            const postData = { titulo: '', conteudo: 'Conteúdo Válido', autor: 'Autor Teste' };
            expect(() => postService.create(postData)).toThrow(AppError);
        });

        it('deve lançar AppError se o conteúdo for vazio', () => {
            const postData = { titulo: 'Título Válido', conteudo: '', autor: 'Autor Teste' };
            expect(() => postService.create(postData)).toThrow(AppError);
        });

        it('deve lançar AppError se o autor for vazio', () => {
            const postData = { titulo: 'Título Válido', conteudo: 'Conteúdo Válido', autor: '' };
            expect(() => postService.create(postData)).toThrow(AppError);
        });

        it('deve lançar AppError com status 422 para validação de título', () => {
            const postData = { titulo: 'Oi', conteudo: 'Conteúdo Válido', autor: 'Autor' };
            try {
                postService.create(postData);
                fail('Expected AppError to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                expect((error as AppError).statusCode).toBe(422);
            }
        });
    });

    describe('getAll', () => {
        it('deve retornar todos os posts com sucesso', () => {
            const posts = [
                { id: 1, titulo: 'Post 1', conteudo: 'Conteúdo 1', autor: 'Autor 1', dataCriacao: new Date() },
                { id: 2, titulo: 'Post 2', conteudo: 'Conteúdo 2', autor: 'Autor 2', dataCriacao: new Date() }
            ];
            (postRepositoryMock.findAll as jest.Mock).mockReturnValue(posts);

            const result = postService.getAll();

            expect(result.total).toBe(2);
            expect(result.posts).toEqual(posts);
            expect(postRepositoryMock.findAll).toHaveBeenCalled();
        });

        it('deve retornar lista vazia quando não há posts', () => {
            (postRepositoryMock.findAll as jest.Mock).mockReturnValue([]);

            const result = postService.getAll();

            expect(result.total).toBe(0);
            expect(result.posts).toEqual([]);
        });
    });

    describe('getById', () => {
        it('deve retornar um post por ID com sucesso', () => {
            const post = { id: 1, titulo: 'Post 1', conteudo: 'Conteúdo 1', autor: 'Autor 1', dataCriacao: new Date() };
            (postRepositoryMock.findById as jest.Mock).mockReturnValue(post);

            const result = postService.getById(1);

            expect(result).toEqual(post);
            expect(postRepositoryMock.findById).toHaveBeenCalledWith(1);
        });

        it('deve lançar AppError quando post não existe', () => {
            (postRepositoryMock.findById as jest.Mock).mockReturnValue(undefined);
 
            expect(() => postService.getById(999)).toThrow(AppError);
        });

        it('deve lançar AppError com status 404 quando post não existe', () => {
            (postRepositoryMock.findById as jest.Mock).mockReturnValue(undefined);
 
            try {
                postService.getById(999);
                fail('Expected AppError to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                expect((error as AppError).statusCode).toBe(404);
            }
        });

        it('deve lançar AppError para ID inválido (zero)', () => { 
            expect(() => postService.getById(0)).toThrow(AppError);
        });

        it('deve lançar AppError para ID negativo', () => { 
            expect(() => postService.getById(-1)).toThrow(AppError);
        });

        it('deve lançar AppError para ID NaN', () => { 
            expect(() => postService.getById(NaN)).toThrow(AppError);
        });
    });

    describe('update', () => {
        it('deve atualizar um post com sucesso', () => {
            const updateData = { titulo: 'Novo Título' };
            const updatedPost = { id: 1, titulo: 'Novo Título', conteudo: 'Conteúdo 1', autor: 'Autor 1', dataCriacao: new Date() };
            (postRepositoryMock.update as jest.Mock).mockReturnValue(updatedPost);

            const result = postService.update(1, updateData);

            expect(result).toEqual(updatedPost);
            expect(postRepositoryMock.update).toHaveBeenCalledWith(1, updateData);
        });

        it('deve atualizar múltiplos campos', () => {
            const updateData = { titulo: 'Novo Título', autor: 'Novo Autor' };
            const updatedPost = { id: 1, titulo: 'Novo Título', conteudo: 'Conteúdo 1', autor: 'Novo Autor', dataCriacao: new Date() };
            (postRepositoryMock.update as jest.Mock).mockReturnValue(updatedPost);

            const result = postService.update(1, updateData);

            expect(postRepositoryMock.update).toHaveBeenCalledWith(1, updateData);
        });

        it('deve lançar AppError quando post não existe', () => {
            (postRepositoryMock.update as jest.Mock).mockReturnValue(null);
 
            expect(() => postService.update(999, { titulo: 'Novo Título' })).toThrow(AppError);
        });

        it('deve lançar AppError com status 404 quando post não existe', () => {
            (postRepositoryMock.update as jest.Mock).mockReturnValue(null);
 
            try {
                postService.update(999, { titulo: 'Novo' });
                fail('Expected AppError to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                expect((error as AppError).statusCode).toBe(404);
            }
        });

        it('deve validar título se fornecido', () => {
            const updateData = { titulo: 'AB' };
 
            expect(() => postService.update(1, updateData)).toThrow(AppError);
        });

        it('deve validar conteúdo se fornecido', () => {
            const updateData = { conteudo: 'Curto' };
 
            expect(() => postService.update(1, updateData)).toThrow(AppError);
        });

        it('deve validar autor se fornecido', () => {
            const updateData = { autor: 'AB' };
 
            expect(() => postService.update(1, updateData)).toThrow(AppError);
        });

        it('deve permitir atualização parcial sem validar campos não informados', () => {
            const updateData = { titulo: 'Novo Título' };
            const updatedPost = { id: 1, titulo: 'Novo Título', conteudo: 'Conteúdo', autor: 'Autor', dataCriacao: new Date() };
            (postRepositoryMock.update as jest.Mock).mockReturnValue(updatedPost);

            const result = postService.update(1, updateData);

            expect(result).toBeDefined();
            expect(postRepositoryMock.update).toHaveBeenCalledWith(1, updateData);
        });

        it('deve lançar AppError para ID inválido', () => { 
            expect(() => postService.update(0, { titulo: 'Novo' })).toThrow(AppError);
        });
    });

    describe('delete', () => {
        it('deve deletar um post com sucesso', () => {
            (postRepositoryMock.delete as jest.Mock).mockReturnValue(true);

            const result = postService.delete(1);

            expect(result).toBeUndefined();
            expect(postRepositoryMock.delete).toHaveBeenCalledWith(1);
        });

        it('deve lançar AppError quando post não existe', () => {
            (postRepositoryMock.delete as jest.Mock).mockReturnValue(false);
 
            expect(() => postService.delete(999)).toThrow(AppError);
        });

        it('deve lançar AppError com status 404 quando post não existe', () => {
            (postRepositoryMock.delete as jest.Mock).mockReturnValue(false);
 
            try {
                postService.delete(999);
                fail('Expected AppError to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                expect((error as AppError).statusCode).toBe(404);
            }
        });

        it('deve lançar AppError para ID inválido', () => { 
            expect(() => postService.delete(0)).toThrow(AppError);
        });
    });

    describe('search', () => {
        it('deve buscar posts com sucesso', () => {
            const query = 'express';
            const posts = [{ id: 1, titulo: 'Express', conteudo: 'Framework', autor: 'Autor', dataCriacao: new Date() }];
            (postRepositoryMock.findByText as jest.Mock).mockReturnValue(posts);

            const result = postService.search(query);

            expect(result.total).toBe(1);
            expect(result.query).toBe(query);
            expect(result.posts).toEqual(posts);
            expect(postRepositoryMock.findByText).toHaveBeenCalledWith(query);
        });

        it('deve retornar lista vazia quando nenhuma correspondência', () => {
            const query = 'python';
            (postRepositoryMock.findByText as jest.Mock).mockReturnValue([]);

            const result = postService.search(query);

            expect(result.total).toBe(0);
            expect(result.posts).toEqual([]);
        });

        it('deve lançar AppError para query muito curta', () => { 
            expect(() => postService.search('a')).toThrow(AppError);
        });

        it('deve lançar AppError para query vazia', () => { 
            expect(() => postService.search('')).toThrow(AppError);
        });

        it('deve lançar AppError com status 400 para query inválida', () => { 
            try {
                postService.search('a');
                fail('Expected AppError to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                expect((error as AppError).statusCode).toBe(400);
            }
        });
    });
});
