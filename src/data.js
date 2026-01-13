// Dados em memória (simula banco de dados)
let posts = [{
        id: 1,
        titulo: 'Primeiro Post',
        conteudo: 'Conteúdo do primeiro post',
        autor: 'Professor João',
        data: '2026-01-01'
    },
    {
        id: 2,
        titulo: 'Segundo Post',
        conteudo: 'Conteúdo do segundo post sobre Node.js',
        autor: 'Professor Maria',
        data: '2026-01-02'
    },
    {
        id: 3,
        titulo: 'Terceiro Post',
        conteudo: 'Express é um framework incrível',
        autor: 'Professor Pedro',
        data: '2026-01-03'
    }
];

let proximoId = 4;

module.exports = {
    posts,
    getProximoId: () => proximoId,
    incrementarId: () => proximoId++
};