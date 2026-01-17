import { PostController } from '../../../src/api/controllers/PostController';
import { PostService } from '../../../src/api/services/PostService';
import { AppError } from '../../../src/utils/AppError';
import { Request, Response } from 'express';
import { Post } from '../../../src/api/models/Post';

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
        } as unknown as Response;

        mockRequest = {};
    });

    describe('getAll', () => {
        it('deve retornar todos os posts com sucesso', async () => {
            const postsData = [
                { id: 1, titulo: 'Post 1', conteudo: 'Conteúdo 1', autor: 'Autor 1', dataCriacao: new Date() },
                { id: 2, titulo: 'Post 2', conteudo: 'Conteúdo 2', autor: 'Autor 2', dataCriacao: new Date() },
            ];
            const posts = postsData.map(p => ({ ...p, toJSON: jest.fn().mockReturnValue(p) })) as unknown as Post[];
            mockPostService.getAll.mockResolvedValue({ total: 2, posts });

            await postController.getAll(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                total: 2,
                posts
            });
        });

        it('deve retornar lista vazia quando não há posts', async () => {

            mockPostService.getAll.mockResolvedValue({ total: 0, posts: [] });

            await postController.getAll(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                total: 0,
                posts: []
            });
        });
    });

    describe('getById', () => {
        it('deve retornar um post por ID com sucesso', async () => {

            const postData = { id: 1, titulo: 'Post 1', conteudo: 'Conteúdo 1', autor: 'Autor 1', dataCriacao: new Date() };
            const post = { ...postData, toJSON: jest.fn().mockReturnValue(postData) } as unknown as Post;
            mockRequest.params = { id: '1' };
            mockPostService.getById.mockResolvedValue(post);


            await postController.getById(mockRequest as Request, mockResponse as Response);


            expect(mockPostService.getById).toHaveBeenCalledWith(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                ...postData
            });
        });

        it('deve retornar 404 quando post não existe', async () => {

            mockRequest.params = { id: '999' };
            const error = new AppError('Post não encontrado.', 404);
            mockPostService.getById.mockRejectedValue(error);


            await expect(postController.getById(mockRequest as Request, mockResponse as Response))
                .rejects.toThrow(AppError);
        });

        it('deve converter string ID para número', async () => {

            const postData = { id: 42, titulo: 'Post', conteudo: 'Conteúdo', autor: 'Autor', dataCriacao: new Date() };
            const post = { ...postData, toJSON: jest.fn().mockReturnValue(postData) } as unknown as Post;
            mockRequest.params = { id: '42' };
            mockPostService.getById.mockResolvedValue(post);


            await postController.getById(mockRequest as Request, mockResponse as Response);


            expect(mockPostService.getById).toHaveBeenCalledWith(42);
        });
    });

    describe('create', () => {
        it('deve criar um novo post com sucesso', async () => {

            const newPostData = {
                titulo: 'Novo Post',
                conteudo: 'Conteúdo do novo post',
                autor: 'Novo Autor'
            };
            const createdPostData = {
                id: 1,
                ...newPostData,
                dataCriacao: new Date()
            };
            const createdPost = { ...createdPostData, toJSON: jest.fn().mockReturnValue(createdPostData) } as unknown as Post;
            mockRequest.body = newPostData;
            mockPostService.create.mockResolvedValue(createdPost);


            await postController.create(mockRequest as Request, mockResponse as Response);


            expect(mockPostService.create).toHaveBeenCalledWith(newPostData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                ...createdPostData
            });
        });

        it('deve retornar erro quando dados são inválidos', async () => {

            mockRequest.body = { titulo: 'A', conteudo: 'B', autor: 'C' };
            const error = new AppError('Validação falhou', 422);
            mockPostService.create.mockRejectedValue(error);


            await expect(postController.create(mockRequest as Request, mockResponse as Response))
                .rejects.toThrow(AppError);
        });
    });

    describe('update', () => {
        it('deve atualizar um post com sucesso', async () => {

            const updateData = { titulo: 'Título Atualizado' };
            const updatedPostData = {
                id: 1,
                titulo: 'Título Atualizado',
                conteudo: 'Conteúdo original',
                autor: 'Autor original',
                dataCriacao: new Date()
            };
            const updatedPost = { ...updatedPostData, toJSON: jest.fn().mockReturnValue(updatedPostData) } as unknown as Post;
            mockRequest.params = { id: '1' };
            mockRequest.body = updateData;
            mockPostService.update.mockResolvedValue(updatedPost);


            await postController.update(mockRequest as Request, mockResponse as Response);

            expect(mockPostService.update).toHaveBeenCalledWith(1, updateData);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                ...updatedPostData
            });
        });

        it('deve retornar 404 quando post não existe para atualizar', async () => {

            mockRequest.params = { id: '999' };
            mockRequest.body = { titulo: 'Novo Título' };
            const error = new AppError('Post não encontrado.', 404);
            mockPostService.update.mockRejectedValue(error);

            await expect(postController.update(mockRequest as Request, mockResponse as Response))
                .rejects.toThrow(AppError);
        });

        it('deve converter string ID para número na atualização', async () => {

            const updateData = { autor: 'Novo Autor' };
            const updatedPostData = {
                id: 42,
                titulo: 'Título',
                conteudo: 'Conteúdo',
                autor: 'Novo Autor',
                dataCriacao: new Date()
            };
            const updatedPost = { ...updatedPostData, toJSON: jest.fn().mockReturnValue(updatedPostData) } as unknown as Post;
            mockRequest.params = { id: '42' };
            mockRequest.body = updateData;
            mockPostService.update.mockResolvedValue(updatedPost);


            await postController.update(mockRequest as Request, mockResponse as Response);


            expect(mockPostService.update).toHaveBeenCalledWith(42, updateData);
        });
    });

    describe('delete', () => {
        it('deve deletar um post com sucesso', async () => {

            mockRequest.params = { id: '1' };
            mockPostService.delete.mockResolvedValue(undefined);


            await postController.delete(mockRequest as Request, mockResponse as Response);


            expect(mockPostService.delete).toHaveBeenCalledWith(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ status: 'success' });
        });

        it('deve retornar 404 quando post não existe para deletar', async () => {

            mockRequest.params = { id: '999' };
            const error = new AppError('Post não encontrado.', 404);
            mockPostService.delete.mockRejectedValue(error);


            await expect(postController.delete(mockRequest as Request, mockResponse as Response))
                .rejects.toThrow(AppError);
        });

        it('deve converter string ID para número na deleção', async () => {

            mockRequest.params = { id: '42' };
            mockPostService.delete.mockResolvedValue(undefined);

            await postController.delete(mockRequest as Request, mockResponse as Response);


            expect(mockPostService.delete).toHaveBeenCalledWith(42);
        });
    });

    describe('search', () => {
        it('deve buscar posts com sucesso', async () => {

            const query = 'express';
            const postsData = [
                { id: 1, titulo: 'Express é incrível', conteudo: 'Conteúdo', autor: 'Autor', dataCriacao: new Date() }
            ];
            const posts = postsData.map(p => ({ ...p, toJSON: jest.fn().mockReturnValue(p) })) as unknown as Post[];
            mockRequest.query = { q: query };
            mockPostService.search.mockResolvedValue({ total: 1, query, posts });


            await postController.search(mockRequest as Request, mockResponse as Response);


            expect(mockPostService.search).toHaveBeenCalledWith(query);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                total: 1,
                query,
                posts
            });
        });

        it('deve retornar lista vazia quando nenhum post é encontrado', async () => {
 
            const query = 'python';
            mockRequest.query = { q: query };
            mockPostService.search.mockResolvedValue({ total: 0, query, posts: [] });


            await postController.search(mockRequest as Request, mockResponse as Response);


            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                total: 0,
                query,
                posts: []
            });
        });

        it('deve usar string vazia como query padrão quando q não é fornecido', async () => {

            mockRequest.query = {};
            mockPostService.search.mockResolvedValue({ total: 0, query: '', posts: [] });

            await postController.search(mockRequest as Request, mockResponse as Response);

            expect(mockPostService.search).toHaveBeenCalledWith('');
        });

        it('deve retornar erro quando query é inválida', async () => {

            mockRequest.query = { q: 'a' };
            const error = new AppError('Termo de busca inválido', 400);
            mockPostService.search.mockRejectedValue(error);

            await expect(postController.search(mockRequest as Request, mockResponse as Response))
                .rejects.toThrow(AppError);
        });
    });
});
