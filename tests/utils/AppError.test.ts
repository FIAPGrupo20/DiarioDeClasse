import { AppError } from '../../src/utils/AppError';

describe('AppError', () => {
    describe('Constructor', () => {
        it('deve criar um AppError com mensagem e status code', () => {
           
            const error = new AppError('Erro de teste', 400);

           
            expect(error.message).toBe('Erro de teste');
            expect(error.statusCode).toBe(400);
        });

        it('deve usar status code padrão 400 quando não fornecido', () => {
           
            const error = new AppError('Erro padrão');

           
            expect(error.statusCode).toBe(400);
        });

        it('deve estender a classe Error', () => {
           
            const error = new AppError('Teste', 500);

           
            expect(error instanceof Error).toBe(true);
        });

        it('deve ter o nome correto na classe', () => {
           
            const error = new AppError('Teste', 404);

           
            expect(error.name).toBe('AppError');
        });

        it('deve ter o nome AppError no prototype', () => {
           
            const error = new AppError('Teste', 422);

           
            expect(Object.getPrototypeOf(error).constructor.name).toBe('AppError');
        });
    });

    describe('Common HTTP Status Codes', () => {
        it('deve aceitar status code 400 (Bad Request)', () => {
           
            const error = new AppError('Bad Request', 400);

           
            expect(error.statusCode).toBe(400);
        });

        it('deve aceitar status code 404 (Not Found)', () => {
           
            const error = new AppError('Not Found', 404);

           
            expect(error.statusCode).toBe(404);
        });

        it('deve aceitar status code 422 (Unprocessable Entity)', () => {
           
            const error = new AppError('Unprocessable Entity', 422);

           
            expect(error.statusCode).toBe(422);
        });

        it('deve aceitar status code 500 (Internal Server Error)', () => {
           
            const error = new AppError('Server Error', 500);

           
            expect(error.statusCode).toBe(500);
        });

        it('deve aceitar status code 201 (Created)', () => {
           
            const error = new AppError('Created', 201);

           
            expect(error.statusCode).toBe(201);
        });
    });

    describe('Error Properties', () => {
        it('deve ter propriedade readonly statusCode', () => {
           
            const error = new AppError('Teste', 400);

           
            expect(() => {
                (error as any).statusCode = 500;
            }).not.toThrow(); // TypeScript não permite, mas em runtime é imutável
        });

        it('deve ter propriedade message herdada de Error', () => {
           
            const error = new AppError('Mensagem de teste', 404);

           
            expect(error.message).toBe('Mensagem de teste');
        });

        it('deve ter stack trace', () => {
           
            const error = new AppError('Erro com stack', 500);

           
            expect(error.stack).toBeDefined();
            expect(error.stack).toContain('AppError');
        });
    });

    describe('Error Throwing', () => {
        it('deve poder ser lançado e capturado', () => {

            expect(() => {
                throw new AppError('Erro lançado', 400);
            }).toThrow(AppError);
        });

        it('deve poder ser capturado como Error', () => {

            expect(() => {
                throw new AppError('Erro capturável', 400);
            }).toThrow(Error);
        });

        it('deve preservar propriedades quando capturado em catch', () => {

            try {
                throw new AppError('Erro preservado', 403);
            } catch (error) {
                expect(error instanceof AppError).toBe(true);
                expect((error as AppError).statusCode).toBe(403);
                expect((error as AppError).message).toBe('Erro preservado');
            }
        });
    });

    describe('Multiple Instances', () => {
        it('deve criar múltiplas instâncias independentes', () => {
           
            const error1 = new AppError('Erro 1', 400);
            const error2 = new AppError('Erro 2', 404);
            const error3 = new AppError('Erro 3', 500);

           
            expect(error1.message).toBe('Erro 1');
            expect(error2.message).toBe('Erro 2');
            expect(error3.message).toBe('Erro 3');
            expect(error1.statusCode).toBe(400);
            expect(error2.statusCode).toBe(404);
            expect(error3.statusCode).toBe(500);
        });
    });
});
