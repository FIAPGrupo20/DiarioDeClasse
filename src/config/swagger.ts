import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Diario de Classe API',
      version: '1.0.0',
      description: 'API para gerenciamento de postagens educacionais.',
      contact: {
        name: 'Grupo 20 - FIAP',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
  },
  // Caminhos para os arquivos que conterão as anotações (Rotas e Models)
  apis: ['./src/routes/*.ts', './src/api/models/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
