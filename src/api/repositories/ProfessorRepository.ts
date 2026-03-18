import { Professor, ProfessorModel, IProfessor } from '../models/Professor';

export class ProfessorRepository {
    public async findAll(): Promise<Professor[]> {
        return await ProfessorModel.find();
    }

    public async findById(id: number): Promise<Professor | null> {
        return await ProfessorModel.findOne({ id });
    }

    public async findByEmail(email: string): Promise<Professor | null> {
        return await ProfessorModel.findOne({ email: email.toLowerCase() });
    }

    public async create(data: Omit<IProfessor, 'id' | 'dataCriacao'>): Promise<Professor> {
        const id = Date.now();
        return await ProfessorModel.create({
            ...data,
            id,
            email: data.email.toLowerCase()
        });
    }

    public async update(id: number, data: Partial<Omit<IProfessor, 'id' | 'dataCriacao'>>): Promise<Professor | null> {
        const updateData = {
            ...data,
            email: data.email?.toLowerCase()
        };

        return await ProfessorModel.findOneAndUpdate({ id }, updateData, { new: true });
    }

    public async delete(id: number): Promise<boolean> {
        const result = await ProfessorModel.deleteOne({ id });
        return result.deletedCount > 0;
    }
}