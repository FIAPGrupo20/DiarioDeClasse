// Validações reutilizáveis
const validacoes = {
    validarId(id) {
        if (isNaN(id)) {
            return {
                valido: false,
                erro: 'ID inválido. Deve ser um número'
            };
        }
        return {
            valido: true
        };
    },

    validarTitulo(titulo) {
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
    },

    validarConteudo(conteudo) {
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
    },

    validarAutor(autor) {
        if (!autor || autor.trim() === '') {
            return {
                valido: false,
                erro: 'Autor é obrigatório'
            };
        }
        return {
            valido: true
        };
    },

    validarCamposPostCreate(titulo, conteudo, autor) {
        // Validar título
        const validacaoTitulo = this.validarTitulo(titulo);
        if (!validacaoTitulo.valido) return validacaoTitulo;

        // Validar conteúdo
        const validacaoConteudo = this.validarConteudo(conteudo);
        if (!validacaoConteudo.valido) return validacaoConteudo;

        // Validar autor
        const validacaoAutor = this.validarAutor(autor);
        if (!validacaoAutor.valido) return validacaoAutor;

        return {
            valido: true
        };
    }
};

module.exports = validacoes;