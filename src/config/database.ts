import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/diario_de_classe';
        await mongoose.connect(mongoURI);
        console.log('📦 MongoDB conectado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao conectar no MongoDB:', error);
        process.exit(1);
    }
};