export class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';

        // Garante que o nome da classe seja 'AppError' no stack trace
        Object.setPrototypeOf(this, AppError.prototype);
    }
}