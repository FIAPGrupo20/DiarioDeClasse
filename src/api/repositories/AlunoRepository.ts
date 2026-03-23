import { Aluno, AlunoModel, IAluno } from '../models/Aluno';

export class AlunoRepository {
    public async findAll(): Promise<Aluno[]> {
        return await AlunoModel.find();
    }

    public async findById(id: number): Promise<Aluno | null> {
        return await AlunoModel.findOne({ id });
    }

    public async findByEmail(email: string): Promise<Aluno | null> {
        return await AlunoModel.findOne({ email: email.toLowerCase() });
    }

    public async create(data: Omit<IAluno, 'id' | 'dataCriacao'>): Promise<Aluno> {
        const id = Date.now();
        return await AlunoModel.create({
            ...data,
            id,
            email: data.email.toLowerCase()
        });
    }

    public async update(id: number, data: Partial<Omit<IAluno, 'id' | 'dataCriacao'>>): Promise<Aluno | null> {
        const updateData = {
            ...data,
            email: data.email?.toLowerCase()
        };

        return await AlunoModel.findOneAndUpdate({ id }, updateData, { new: true });
    }

    public async delete(id: number): Promise<boolean> {
        const result = await AlunoModel.deleteOne({ id });
        return result.deletedCount > 0;
    }
}