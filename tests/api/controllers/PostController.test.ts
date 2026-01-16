import { PostController } from '../../../src/api/controllers/PostController';
import { PostService } from '../../../src/api/services/PostService';
import { AppError } from '../../../src/utils/AppError';
import { Request, Response } from 'express';

jest.mock('../../../src/api/services/PostService');

describe('PostController', () => {
    let postController: PostController;
    let mockPostService: jest.Mocked<PostService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        
        jest.clearAllMocks();

        
        mockPostService = new PostService() as jest.Mocked<PostService>;
        
        postController = new PostController();
        (postController as any).postService = mockPostService;

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        mockRequest = {};
    });

    describe('getAll', () => {
        it('deve retornar todos os posts com sucesso', () => {
            const posts = [
                { id: 1, titulo: 'Post 1', conteudo: 'Conteúdo 1', autor: 'Autor 1', dataCriacao: new Date() },
                { id: 2, titulo: 'Post 2', conteudo: 'Conteúdo 2', autor: 'Autor 2', dataCriacao: new Date() },
            ];
            mockPostService.getAll.mockReturnValue({ total: 2, posts });

            postController.getAll(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                total: 2,
                posts
            });
        });

        it('deve retornar lista vazia quando não há posts', () => {

            mockPostService.getAll.mockReturnValue({ total: 0, posts: [] });

            postController.getAll(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                total: 0,
                posts: []
            });
        });
    });

    describe('getById', () => {
        it('deve retornar um post por ID com sucesso', () => {

            const post = { id: 1, titulo: 'Post 1', conteudo: 'Conteúdo 1', autor: 'Autor 1', dataCriacao: new Date() };
            mockRequest.params = { id: '1' };
            mockPostService.getById.mockReturnValue(post);


            postController.getById(mockRequest as Request, mockResponse as Response);


            expect(mockPostService.getById).toHaveBeenCalledWith(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                ...post
            });
        });

        it('deve retornar 404 quando post não existe', () => {

            mockRequest.params = { id: '999' };
            const error = new AppError('Post não encontrado.', 404);
            mockPostService.getById.mockImplementation(() => {
                throw error;
            });


            expect(() => postController.getById(mockRequest as Request, mockResponse as Response))
                .toThrow(AppError);
        });

        it('deve converter string ID para número', () => {

            const post = { id: 42, titulo: 'Post', conteudo: 'Conteúdo', autor: 'Autor', dataCriacao: new Date() };
            mockRequest.params = { id: '42' };
            mockPostService.getById.mockReturnValue(post);


            postController.getById(mockRequest as Request, mockResponse as Response);


            expect(mockPostService.getById).toHaveBeenCalledWith(42);
        });
    });

    describe('create', () => {
        it('deve criar um novo post com sucesso', () => {

            const newPostData = {
                titulo: 'Novo Post',
                conteudo: 'Conteúdo do novo post',
                autor: 'Novo Autor'
            };
            const createdPost = {
                id: 1,
                ...newPostData,
                dataCriacao: new Date()
            };
            mockRequest.body = newPostData;
            mockPostService.create.mockReturnValue(createdPost);


            postController.create(mockRequest as Request, mockResponse as Response);


            expect(mockPostService.create).toHaveBeenCalledWith(newPostData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                ...createdPost
            });
        });

        it('deve retornar erro quando dados são inválidos', () => {

            mockRequest.body = { titulo: 'A', conteudo: 'B', autor: 'C' };
            const error = new AppError('Validação falhou', 422);
            mockPostService.create.mockImplementation(() => {
                throw error;
            });


            expect(() => postController.create(mockRequest as Request, mockResponse as Response))
                .toThrow(AppError);
        });
    });

    describe('update', () => {
        it('deve atualizar um post com sucesso', () => {

            const updateData = { titulo: 'Título Atualizado' };
            const updatedPost = {
                id: 1,
                titulo: 'Título Atualizado',
                conteudo: 'Conteúdo original',
                autor: 'Autor original',
                dataCriacao: new Date()
            };
            mockRequest.params = { id: '1' };
            mockRequest.body = updateData;
            mockPostService.update.mockReturnValue(updatedPost);


            postController.update(mockRequest as Request, mockResponse as Response);

            expect(mockPostService.update).toHaveBeenCalledWith(1, updateData);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                ...updatedPost
            });
        });

        it('deve retornar 404 quando post não existe para atualizar', () => {

            mockRequest.params = { id: '999' };
            mockRequest.body = { titulo: 'Novo Título' };
            const error = new AppError('Post não encontrado.', 404);
            mockPostService.update.mockImplementation(() => {
                throw error;
            });

            expect(() => postController.update(mockRequest as Request, mockResponse as Response))
                .toThrow(AppError);
        });

        it('deve converter string ID para número na atualização', () => {

            const updateData = { autor: 'Novo Autor' };
            const updatedPost = {
                id: 42,
                titulo: 'Título',
                conteudo: 'Conteúdo',
                autor: 'Novo Autor',
                dataCriacao: new Date()
            };
            mockRequest.params = { id: '42' };
            mockRequest.body = updateData;
            mockPostService.update.mockReturnValue(updatedPost);


            postController.update(mockRequest as Request, mockResponse as Response);


            expect(mockPostService.update).toHaveBeenCalledWith(42, updateData);
        });
    });

    describe('delete', () => {
        it('deve deletar um post com sucesso', () => {

            mockRequest.params = { id: '1' };
            mockPostService.delete.mockReturnValue(undefined);


            postController.delete(mockRequest as Request, mockResponse as Response);


            expect(mockPostService.delete).toHaveBeenCalledWith(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ status: 'success' });
        });

        it('deve retornar 404 quando post não existe para deletar', () => {

            mockRequest.params = { id: '999' };
            const error = new AppError('Post não encontrado.', 404);
            mockPostService.delete.mockImplementation(() => {
                throw error;
            });


            expect(() => postController.delete(mockRequest as Request, mockResponse as Response))
                .toThrow(AppError);
        });

        it('deve converter string ID para número na deleção', () => {

            mockRequest.params = { id: '42' };
            mockPostService.delete.mockReturnValue(undefined);

            postController.delete(mockRequest as Request, mockResponse as Response);


            expect(mockPostService.delete).toHaveBeenCalledWith(42);
        });
    });

    describe('search', () => {
        it('deve buscar posts com sucesso', () => {

            const query = 'express';
            const posts = [
                { id: 1, titulo: 'Express é incrível', conteudo: 'Conteúdo', autor: 'Autor', dataCriacao: new Date() }
            ];
            mockRequest.query = { q: query };
            mockPostService.search.mockReturnValue({ total: 1, query, posts });


            postController.search(mockRequest as Request, mockResponse as Response);


            expect(mockPostService.search).toHaveBeenCalledWith(query);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                total: 1,
                query,
                posts
            });
        });

        it('deve retornar lista vazia quando nenhum post é encontrado', () => {
 
            const query = 'python';
            mockRequest.query = { q: query };
            mockPostService.search.mockReturnValue({ total: 0, query, posts: [] });


            postController.search(mockRequest as Request, mockResponse as Response);


            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                total: 0,
                query,
                posts: []
            });
        });

        it('deve usar string vazia como query padrão quando q não é fornecido', () => {

            mockRequest.query = {};
            mockPostService.search.mockReturnValue({ total: 0, query: '', posts: [] });

            postController.search(mockRequest as Request, mockResponse as Response);

            expect(mockPostService.search).toHaveBeenCalledWith('');
        });

        it('deve retornar erro quando query é inválida', () => {

            mockRequest.query = { q: 'a' };
            const error = new AppError('Termo de busca inválido', 400);
            mockPostService.search.mockImplementation(() => {
                throw error;
            });

            expect(() => postController.search(mockRequest as Request, mockResponse as Response))
                .toThrow(AppError);
        });
    });
});
