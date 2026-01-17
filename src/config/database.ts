import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const user = process.env.MONGO_USER;
        const pass = process.env.MONGO_PASSWORD;
        const db = process.env.MONGO_DB || 'diario_de_classe';
        const host = process.env.MONGO_HOST || 'localhost';
        const port = process.env.MONGO_PORT || '27017';

        const defaultURI = user && pass ? `mongodb://${user}:${pass}@${host}:${port}/${db}?authSource=admin` : `mongodb://${host}:${port}/${db}`;
        const mongoURI = process.env.DB_CONNECTION_STRING || defaultURI;

        // Log para ajudar a identificar problemas de conexão (mascarando a senha)
        const maskedURI = mongoURI.replace(/:([^:@]+)@/, ':****@');
        console.log(`🔌 Tentando conectar em: ${maskedURI}`);

        await mongoose.connect(mongoURI);
        console.log('📦 MongoDB conectado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao conectar no MongoDB:', error);
        process.exit(1);
    }
};