const express = require('express');
const router = express.Router();
const {
    posts,
    incrementarId
} = require('./data');
const validacoes = require('./validacoes');

// ========== ENDPOINTS PARA ALUNOS (Leitura) ==========

// GET /posts - Lista todos os posts (versão simples para alunos)
router.get('/posts', (req, res) => {
    const postsPublicos = posts.map(post => ({
        id: post.id,
        titulo: post.titulo,
        conteudo: post.conteudo,
        autor: post.autor,
        data: post.data
    }));

    res.status(200).json({
        sucesso: true,
        total: postsPublicos.length,
        dados: postsPublicos
    });
});

// GET /posts/:id - Leitura de post específico
router.get('/posts/:id', (req, res) => {
    const {
        id
    } = req.params;

    // Validação: id deve ser um número
    const validacaoId = validacoes.validarId(id);
    if (!validacaoId.valido) {
        return res.status(400).json({
            sucesso: false,
            erro: validacaoId.erro
        });
    }

    const post = posts.find(p => p.id === parseInt(id));

    if (!post) {
        return res.status(404).json({
            sucesso: false,
            erro: 'Post não encontrado'
        });
    }

    res.status(200).json({
        sucesso: true,
        dados: post
    });
});

// GET /posts/search?q=palavra - Busca por palavra-chave
router.get('/search', (req, res) => {
    const {
        q
    } = req.query;

    // Validação: palavra-chave é obrigatória
    if (!q || q.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            erro: 'Parâmetro "q" é obrigatório para busca'
        });
    }

    const palavraChave = q.toLowerCase();
    const resultados = posts.filter(post =>
        post.titulo.toLowerCase().includes(palavraChave) ||
        post.conteudo.toLowerCase().includes(palavraChave) ||
        post.autor.toLowerCase().includes(palavraChave)
    );

    res.status(200).json({
        sucesso: true,
        termo: q,
        total: resultados.length,
        dados: resultados
    });
});

// ========== ENDPOINTS PARA PROFESSORES (CRUD) ==========

// POST /posts - Criação de nova postagem
router.post('/posts', (req, res) => {
    const {
        titulo,
        conteudo,
        autor
    } = req.body;

    // Validar todos os campos
    const validacao = validacoes.validarCamposPostCreate(titulo, conteudo, autor);
    if (!validacao.valido) {
        return res.status(400).json({
            sucesso: false,
            erro: validacao.erro
        });
    }

    // Criar novo post
    const novoPost = {
        id: incrementarId(),
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        autor: autor.trim(),
        data: new Date().toISOString().split('T')[0]
    };

    posts.push(novoPost);

    res.status(201).json({
        sucesso: true,
        mensagem: 'Post criado com sucesso',
        dados: novoPost
    });
});

// PUT /posts/:id - Edição de post
router.put('/posts/:id', (req, res) => {
    const {
        id
    } = req.params;
    const {
        titulo,
        conteudo,
        autor
    } = req.body;

    // Validação: id deve ser um número
    const validacaoId = validacoes.validarId(id);
    if (!validacaoId.valido) {
        return res.status(400).json({
            sucesso: false,
            erro: validacaoId.erro
        });
    }

    const post = posts.find(p => p.id === parseInt(id));

    if (!post) {
        return res.status(404).json({
            sucesso: false,
            erro: 'Post não encontrado'
        });
    }

    // Validações dos campos a atualizar
    if (titulo !== undefined) {
        const validacaoTitulo = validacoes.validarTitulo(titulo);
        if (!validacaoTitulo.valido) {
            return res.status(400).json({
                sucesso: false,
                erro: validacaoTitulo.erro
            });
        }
        post.titulo = titulo.trim();
    }

    if (conteudo !== undefined) {
        const validacaoConteudo = validacoes.validarConteudo(conteudo);
        if (!validacaoConteudo.valido) {
            return res.status(400).json({
                sucesso: false,
                erro: validacaoConteudo.erro
            });
        }
        post.conteudo = conteudo.trim();
    }

    if (autor !== undefined) {
        const validacaoAutor = validacoes.validarAutor(autor);
        if (!validacaoAutor.valido) {
            return res.status(400).json({
                sucesso: false,
                erro: validacaoAutor.erro
            });
        }
        post.autor = autor.trim();
    }

    res.status(200).json({
        sucesso: true,
        mensagem: 'Post atualizado com sucesso',
        dados: post
    });
});

// DELETE /posts/:id - Exclusão de post
router.delete('/posts/:id', (req, res) => {
    const {
        id
    } = req.params;

    // Validação: id deve ser um número
    const validacaoId = validacoes.validarId(id);
    if (!validacaoId.valido) {
        return res.status(400).json({
            sucesso: false,
            erro: validacaoId.erro
        });
    }

    const indice = posts.findIndex(p => p.id === parseInt(id));

    if (indice === -1) {
        return res.status(404).json({
            sucesso: false,
            erro: 'Post não encontrado'
        });
    }

    const postRemovido = posts.splice(indice, 1)[0];

    res.status(200).json({
        sucesso: true,
        mensagem: 'Post deletado com sucesso',
        dados: postRemovido
    });
});

module.exports = router;