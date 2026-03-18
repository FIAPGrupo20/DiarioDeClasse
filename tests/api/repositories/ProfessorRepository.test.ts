import 'dotenv/config';
import mongoose from 'mongoose';
import { ProfessorRepository } from '../../../src/api/repositories/ProfessorRepository';
import { ProfessorModel } from '../../../src/api/models/Professor';

describe('ProfessorRepository', () => {
    let professorRepository: ProfessorRepository;

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
        await ProfessorModel.deleteMany({});
        professorRepository = new ProfessorRepository();
    });

    it('deve criar um novo professor com sucesso', async () => {
        const newProfessorData = {
            nome: 'João da Silva',
            email: 'joao@escola.edu.br',
            disciplina: 'Matemática',
            passwordHash: 'hashed-password'
        };

        const createdProfessor = await professorRepository.create(newProfessorData);

        expect(createdProfessor).toMatchObject({
            nome: 'João da Silva',
            email: 'joao@escola.edu.br',
            disciplina: 'Matemática'
        });
        expect(createdProfessor.id).toBeDefined();
    });

    it('deve buscar professor por e-mail', async () => {
        await ProfessorModel.create({
            id: 1,
            nome: 'Maria',
            email: 'maria@escola.edu.br',
            disciplina: 'História',
            passwordHash: 'hashed-password',
            dataCriacao: new Date()
        });

        const professor = await professorRepository.findByEmail('maria@escola.edu.br');

        expect(professor).toBeDefined();
        expect(professor?.nome).toBe('Maria');
    });

    it('deve atualizar professor com sucesso', async () => {
        await ProfessorModel.create({
            id: 1,
            nome: 'Carlos',
            email: 'carlos@escola.edu.br',
            disciplina: 'Geografia',
            passwordHash: 'hashed-password',
            dataCriacao: new Date()
        });

        const updatedProfessor = await professorRepository.update(1, { disciplina: 'História' });

        expect(updatedProfessor?.disciplina).toBe('História');
    });

    it('deve deletar professor com sucesso', async () => {
        await ProfessorModel.create({
            id: 1,
            nome: 'Ana',
            email: 'ana@escola.edu.br',
            disciplina: 'Português',
            passwordHash: 'hashed-password',
            dataCriacao: new Date()
        });

        const deleted = await professorRepository.delete(1);

        expect(deleted).toBe(true);
        expect(await ProfessorModel.findOne({ id: 1 })).toBeNull();
    });
});