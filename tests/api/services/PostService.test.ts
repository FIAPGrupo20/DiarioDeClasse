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
        it('deve criar um post com sucesso quando os dados são válidos', async () => {
            // Arrange
            const postData = {
                titulo: 'Título Válido de Teste',
                conteudo: 'Conteúdo com mais de 10 caracteres para teste',
                autor: 'Professor Teste'
            };
            const createdPost = { id: 1, dataCriacao: new Date(), ...postData };

            // Configura o mock para retornar o post criado
            // Usamos mockResolvedValue porque o método create agora é async (retorna Promise)
            (postRepositoryMock.create as jest.Mock).mockResolvedValue(createdPost);

            // Act
            const result = await postService.create(postData);

            expect(result).toEqual(createdPost);
            expect(postRepositoryMock.create).toHaveBeenCalledWith(postData);
        });

        it('deve lançar AppError se o título for muito curto', async () => {
            //Arrange
            const postData = { titulo: 'Oi', conteudo: 'Conteúdo Válido', autor: 'Autor' };
            //Act and Assert
            // Como é async, usamos rejects.toThrow
            await expect(postService.create(postData))
                .rejects
                .toThrow('O título é obrigatório e deve ter pelo menos 3 caracteres.');
        });

        it('deve lançar AppError se o autor for muito curto', async () => {
            //Arrange
            const postData = { titulo: 'Título Válido de Teste', conteudo: 'Conteúdo Válido', autor: 'Oi' };
            //Act and Assert
            await expect(postService.create(postData))
                .rejects
                .toThrow('O autor é obrigatório e deve ter pelo menos 3 caracteres.');
        });

        it('deve lançar AppError se o conteúdo for muito curto', async () => {
            //Arrange
            const postData = { titulo: 'Título Válido de Teste', conteudo: 'Oi', autor: 'Autor' };
            //Act and Assert
            await expect(postService.create(postData))
                .rejects
                .toThrow('O conteúdo é obrigatório e deve ter pelo menos 10 caracteres.');
        });

        it('deve lançar AppError se o título for vazio', async () => {
            //Arrange
            const postData = { titulo: '', conteudo: 'Conteúdo Válido', autor: 'Autor Teste' };
            await expect(postService.create(postData))
                .rejects
                .toThrow('O título é obrigatório e deve ter pelo menos 3 caracteres.');
        });

        it('deve lançar AppError se o conteúdo for vazio', async () => {
            const postData = { titulo: 'Título Válido', conteudo: '', autor: 'Autor Teste' };
            await expect(postService.create(postData))
                .rejects
                .toThrow('O conteúdo é obrigatório e deve ter pelo menos 10 caracteres.');
        });

        it('deve lançar AppError se o autor for vazio', async () => {
            const postData = { titulo: 'Título Válido', conteudo: 'Conteúdo Válido', autor: '' };
            await expect(postService.create(postData))
                .rejects
                .toThrow('O autor é obrigatório e deve ter pelo menos 3 caracteres.');
        });

        it('deve lançar AppError com status 422 para validação de título', async () => {
            const postData = { titulo: 'Oi', conteudo: 'Conteúdo Válido', autor: 'Autor' };
            try {
                await postService.create(postData);
                fail('Expected AppError to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                expect((error as AppError).statusCode).toBe(422);
            }
        });
    });

    describe('getAll', () => {
        it('deve retornar todos os posts com sucesso', async () => {
            const posts = [
                { id: 1, titulo: 'Post 1', conteudo: 'Conteúdo 1', autor: 'Autor 1', dataCriacao: new Date() },
                { id: 2, titulo: 'Post 2', conteudo: 'Conteúdo 2', autor: 'Autor 2', dataCriacao: new Date() }
            ];
            (postRepositoryMock.findAll as jest.Mock).mockResolvedValue(posts);

            const result = await postService.getAll();

            expect(result.total).toBe(2);
            expect(result.posts).toEqual(posts);
            expect(postRepositoryMock.findAll).toHaveBeenCalled();
        });

        it('deve retornar lista vazia quando não há posts', async () => {
            (postRepositoryMock.findAll as jest.Mock).mockResolvedValue([]);

            const result = await postService.getAll();

            expect(result.total).toBe(0);
            expect(result.posts).toEqual([]);
        });
    });

    describe('getById', () => {
        it('deve retornar um post por ID com sucesso', async () => {
            const post = { id: 1, titulo: 'Post 1', conteudo: 'Conteúdo 1', autor: 'Autor 1', dataCriacao: new Date() };
            (postRepositoryMock.findById as jest.Mock).mockResolvedValue(post);

            const result = await postService.getById(1);

            expect(result).toEqual(post);
            expect(postRepositoryMock.findById).toHaveBeenCalledWith(1);
        });

        it('deve lançar AppError quando post não existe', async () => {
            (postRepositoryMock.findById as jest.Mock).mockResolvedValue(null);
 
            await expect(postService.getById(999)).rejects.toThrow(AppError);
        });

        it('deve lançar AppError com status 404 quando post não existe', async () => {
            (postRepositoryMock.findById as jest.Mock).mockResolvedValue(null);
 
            try {
                await postService.getById(999);
                fail('Expected AppError to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                expect((error as AppError).statusCode).toBe(404);
            }
        });

        it('deve lançar AppError para ID inválido (zero)', async () => { 
            await expect(postService.getById(0))
                .rejects
                .toThrow('ID inválido. Deve ser um número e maior que zero.');
        });

        it('deve lançar AppError para ID negativo', async () => { 
            await expect(postService.getById(-1))
                .rejects
                .toThrow('ID inválido. Deve ser um número e maior que zero.');
        });

        it('deve lançar AppError para ID NaN', async () => { 
            await expect(postService.getById(NaN))
                .rejects
                .toThrow('ID inválido. Deve ser um número e maior que zero.');
        });
    });

    describe('update', () => {
        it('deve atualizar um post com sucesso', async () => {
            const updateData = { titulo: 'Novo Título' };
            const updatedPost = { id: 1, titulo: 'Novo Título', conteudo: 'Conteúdo 1', autor: 'Autor 1', dataCriacao: new Date() };
            (postRepositoryMock.update as jest.Mock).mockResolvedValue(updatedPost);

            const result = await postService.update(1, updateData);

            expect(result).toEqual(updatedPost);
            expect(postRepositoryMock.update).toHaveBeenCalledWith(1, updateData);
        });

        it('deve atualizar múltiplos campos', async () => {
            const updateData = { titulo: 'Novo Título', autor: 'Novo Autor' };
            const updatedPost = { id: 1, titulo: 'Novo Título', conteudo: 'Conteúdo 1', autor: 'Novo Autor', dataCriacao: new Date() };
            (postRepositoryMock.update as jest.Mock).mockResolvedValue(updatedPost);

            await postService.update(1, updateData);

            expect(postRepositoryMock.update).toHaveBeenCalledWith(1, updateData);
        });

        it('deve lançar AppError quando post não existe', async () => {
            (postRepositoryMock.update as jest.Mock).mockResolvedValue(null);
 
            await expect(postService.update(999, { titulo: 'Novo Título' })).rejects.toThrow(AppError);
        });

        it('deve lançar AppError com status 404 quando post não existe', async () => {
            (postRepositoryMock.update as jest.Mock).mockResolvedValue(null);
 
            try {
                await postService.update(999, { titulo: 'Novo' });
                fail('Expected AppError to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                expect((error as AppError).statusCode).toBe(404);
            }
        });

        it('deve validar título se fornecido', async () => {
            const updateData = { titulo: 'AB' };
 
            await expect(postService.update(1, updateData))
                .rejects
                .toThrow('O título é obrigatório e deve ter pelo menos 3 caracteres.');
        });

        it('deve validar conteúdo se fornecido', async () => {
            const updateData = { conteudo: 'Curto' };
 
            await expect(postService.update(1, updateData))
                .rejects
                .toThrow('O conteúdo é obrigatório e deve ter pelo menos 10 caracteres.');
        });

        it('deve validar autor se fornecido', async () => {
            const updateData = { autor: 'AB' };
 
            await expect(postService.update(1, updateData))
                .rejects
                .toThrow('O autor é obrigatório e deve ter pelo menos 3 caracteres.');
        });

        it('deve permitir atualização parcial sem validar campos não informados', async () => {
            const updateData = { titulo: 'Novo Título' };
            const updatedPost = { id: 1, titulo: 'Novo Título', conteudo: 'Conteúdo', autor: 'Autor', dataCriacao: new Date() };
            (postRepositoryMock.update as jest.Mock).mockResolvedValue(updatedPost);

            const result = await postService.update(1, updateData);

            expect(result).toBeDefined();
            expect(postRepositoryMock.update).toHaveBeenCalledWith(1, updateData);
        });

        it('deve lançar AppError para ID inválido', async () => { 
            await expect(postService.update(0, { titulo: 'Novo' }))
                .rejects
                .toThrow('ID inválido. Deve ser um número e maior que zero.');
        });
    });

    describe('delete', () => {
        it('deve deletar um post com sucesso', async () => {
            (postRepositoryMock.delete as jest.Mock).mockResolvedValue(true);

            await postService.delete(1);

            expect(postRepositoryMock.delete).toHaveBeenCalledWith(1);
        });

        it('deve lançar AppError quando post não existe', async () => {
            (postRepositoryMock.delete as jest.Mock).mockResolvedValue(false);
 
            await expect(postService.delete(999)).rejects.toThrow(AppError);
        });

        it('deve lançar AppError com status 404 quando post não existe', async () => {
            (postRepositoryMock.delete as jest.Mock).mockResolvedValue(false);
 
            try {
                await postService.delete(999);
                fail('Expected AppError to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                expect((error as AppError).statusCode).toBe(404);
            }
        });

        it('deve lançar AppError para ID inválido', async () => { 
            await expect(postService.delete(0))
                .rejects
                .toThrow('ID inválido. Deve ser um número e maior que zero.');
        });
    });

    describe('search', () => {
        it('deve buscar posts com sucesso', async () => {
            const query = 'express';
            const posts = [{ id: 1, titulo: 'Express', conteudo: 'Framework', autor: 'Autor', dataCriacao: new Date() }];
            (postRepositoryMock.findByText as jest.Mock).mockResolvedValue(posts);

            const result = await postService.search(query);

            expect(result.total).toBe(1);
            expect(result.query).toBe(query);
            expect(result.posts).toEqual(posts);
            expect(postRepositoryMock.findByText).toHaveBeenCalledWith(query);
        });

        it('deve retornar lista vazia quando nenhuma correspondência', async () => {
            const query = 'python';
            (postRepositoryMock.findByText as jest.Mock).mockResolvedValue([]);

            const result = await postService.search(query);

            expect(result.total).toBe(0);
            expect(result.posts).toEqual([]);
        });

        it('deve lançar AppError para query muito curta', async () => { 
            await expect(postService.search('a'))
                .rejects
                .toThrow('O termo de busca é obrigatório e deve ter pelo menos 2 caracteres.');
        });

        it('deve lançar AppError para query vazia', async () => { 
            await expect(postService.search(''))
                .rejects
                .toThrow('O termo de busca é obrigatório e deve ter pelo menos 2 caracteres.');
        });

        it('deve lançar AppError com status 400 para query inválida', async () => { 
            try {
                await postService.search('a');
                fail('Expected AppError to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                expect((error as AppError).statusCode).toBe(400);
            }
        });
    });
});
