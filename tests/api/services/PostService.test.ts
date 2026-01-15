import { PostService } from '../../../src/api/services/PostService';
import { PostRepository } from '../../../src/api/repositories/PostRepository';
import { AppError } from '../../../src/utils/AppError';

// Helper para o Mock do Repository
const makePostRepositoryMock = () => {
    return {
        findAll: jest.fn(),
        findById: jest.fn(),
        findByText: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    //"Descaracteriza" o tipo e depois reclassifica como PostRepository
    //na prática faz o TS aceitar que seja desse tipo apesar de não ter
    //todos os métodos e propriedades
    } as unknown as PostRepository;
};

describe('PostService', () => {
    let postService: PostService;
    let postRepositoryMock: ReturnType<typeof makePostRepositoryMock>;

    beforeEach(() => {
        postRepositoryMock = makePostRepositoryMock();
        // Injetamos o mock no serviço via construtor
        postService = new PostService(postRepositoryMock);
    });

    describe('create', () => {
        it('deve criar um post com sucesso quando os dados são válidos', () => {
            // Arrange
            const postData = { 
                titulo: 'Título Válido de Teste', 
                conteudo: 'Conteúdo com mais de 10 caracteres para teste', 
                autor: 'Professor Teste' 
            };
            const createdPost = { id: 1, dataCriacao: new Date(), ...postData };
            
            // Configura o mock para retornar o post criado
            // Aqui ele precisa sinalizaro ao TS que na verdade isso tem o jest dentro
            // desse Mock e o alimenta com qual é o retorno esperado
            (postRepositoryMock.create as jest.Mock).mockReturnValue(createdPost);

            // Act
            const result = postService.create(postData);

            // Assert
            expect(result).toEqual(createdPost);
            expect(postRepositoryMock.create).toHaveBeenCalledWith(postData);
        });

        it('deve lançar AppError se o título for muito curto', () => {
            //Arrange
            const postData = { titulo: 'Oi', conteudo: 'Conteúdo Válido', autor: 'Autor' };
            //Act and Assert
            expect(() => postService.create(postData)).toThrow(AppError);
        });

        it('deve lançar AppError se o autor for muito curto', () => {
            //Arrange
            const postData = { titulo: 'Título Válido de Teste', conteudo: 'Conteúdo Válido', autor: 'Oi' };
            //Act and Assert
            expect(() => postService.create(postData)).toThrow(AppError);
        });

        it('deve lançar AppError se o conteúdo for muito curto', () => {
            //Arrange
            const postData = { titulo: 'Título Válido de Teste', conteudo: 'Oi', autor: 'Autor' };
            //Act and Assert
            expect(() => postService.create(postData)).toThrow(AppError);
        });
    });
});
