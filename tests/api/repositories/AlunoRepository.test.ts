import 'dotenv/config';
import mongoose from 'mongoose';
import { AlunoRepository } from '../../../src/api/repositories/AlunoRepository';
import { AlunoModel } from '../../../src/api/models/Aluno';

describe('AlunoRepository', () => {
    let alunoRepository: AlunoRepository;

    beforeAll(async () => {
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_HOST = 'localhost',
            MONGO_PORT = '27017',
            DB_CONNECTION_STRING
        } = process.env;

        const auth = MONGO_USER && MONGO_PASSWORD ? `${MONGO_USER}:${MONGO_PASSWORD}@` : '';
        const options = MONGO_USER && MONGO_PASSWORD ? '?authSource=admin' : '';

        const dbString = DB_CONNECTION_STRING ||
            `mongodb://${auth}${MONGO_HOST}:${MONGO_PORT}/diario_de_classe_test${options}`;

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(dbString);
        }
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await AlunoModel.deleteMany({});
        alunoRepository = new AlunoRepository();
    });

    it('deve criar um novo aluno com sucesso', async () => {
        const newAlunoData = {
            nome: 'Ana Souza',
            email: 'ana@escola.edu.br',
            turma: '7A',
            passwordHash: 'hashed-password'
        };

        const createdAluno = await alunoRepository.create(newAlunoData);

        expect(createdAluno).toMatchObject(newAlunoData);
        expect(createdAluno.id).toBeDefined();
    });

    it('deve buscar aluno por e-mail', async () => {
        await AlunoModel.create({
            id: 1,
            nome: 'Bruno',
            email: 'bruno@escola.edu.br',
            turma: '8B',
            passwordHash: 'hashed-password',
            dataCriacao: new Date()
        });

        const aluno = await alunoRepository.findByEmail('bruno@escola.edu.br');

        expect(aluno).toBeDefined();
        expect(aluno?.nome).toBe('Bruno');
    });

    it('deve atualizar aluno com sucesso', async () => {
        await AlunoModel.create({
            id: 1,
            nome: 'Carlos',
            email: 'carlos@escola.edu.br',
            turma: '9A',
            passwordHash: 'hashed-password',
            dataCriacao: new Date()
        });

        const updatedAluno = await alunoRepository.update(1, { turma: '9B' });

        expect(updatedAluno?.turma).toBe('9B');
    });

    it('deve deletar aluno com sucesso', async () => {
        await AlunoModel.create({
            id: 1,
            nome: 'Dora',
            email: 'dora@escola.edu.br',
            turma: '6A',
            passwordHash: 'hashed-password',
            dataCriacao: new Date()
        });

        const deleted = await alunoRepository.delete(1);

        expect(deleted).toBe(true);
        expect(await AlunoModel.findOne({ id: 1 })).toBeNull();
    });
});