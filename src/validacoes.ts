// Validações reutilizáveis

interface ValidationResult {
    valido: boolean;
    erro?: string;
}

export const validarId = (id: string): ValidationResult => {
    if (isNaN(Number(id))) {
        return {
            valido: false,
            erro: 'ID inválido. Deve ser um número'
        };
    }
    return {
        valido: true
    };
};

export const validarTitulo = (titulo: string): ValidationResult => {
    if (!titulo || titulo.trim() === '') {
        return {
            valido: false,
            erro: 'Título é obrigatório'
        };
    }
    if (titulo.length < 3) {
        return {
            valido: false,
            erro: 'Título deve ter pelo menos 3 caracteres'
        };
    }
    return {
        valido: true
    };
};

export const validarConteudo = (conteudo: string): ValidationResult => {
    if (!conteudo || conteudo.trim() === '') {
        return {
            valido: false,
            erro: 'Conteúdo é obrigatório'
        };
    }
    if (conteudo.length < 10) {
        return {
            valido: false,
            erro: 'Conteúdo deve ter pelo menos 10 caracteres'
        };
    }
    return {
        valido: true
    };
};

export const validarAutor = (autor: string): ValidationResult => {
    if (!autor || autor.trim() === '') {
        return {
            valido: false,
            erro: 'Autor é obrigatório'
        };
    }
    return {
        valido: true
    };
};

export const validarCamposPostCreate = (titulo: string, conteudo: string, autor: string): ValidationResult => {
    // Validar título
    const validacaoTitulo = validarTitulo(titulo);
    if (!validacaoTitulo.valido) return validacaoTitulo;

    // Validar conteúdo
    const validacaoConteudo = validarConteudo(conteudo);
    if (!validacaoConteudo.valido) return validacaoConteudo;

    // Validar autor
    const validacaoAutor = validarAutor(autor);
    if (!validacaoAutor.valido) return validacaoAutor;

    return {
        valido: true
    };
};