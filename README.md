# 📚 Plataforma de Blogging para Educação Pública

Este projeto propõe o desenvolvimento de uma plataforma de blogging voltada à educação pública, com o objetivo de centralizar a criação e o compartilhamento de conteúdos educacionais por professores da rede pública, facilitando o acesso dos alunos a materiais de estudo.

---

## 📌 Visão Geral

A primeira versão da solução foi desenvolvida utilizando **OutSystems**, com boa aceitação em nível comunitário.  
Nesta nova etapa, o projeto evolui para um cenário de maior escala, exigindo:

- Reescrita do back-end em **Node.js**
- Persistência de dados em banco **SQL ou NoSQL**
- Arquitetura preparada para crescimento e manutenção

---

## 🎯 Objetivo do Projeto

Disponibilizar uma solução **moderna, escalável e de fácil uso**, permitindo:

- Criação e gerenciamento de conteúdos educacionais por professores
- Acesso simplificado dos alunos às postagens
- Centralização do conhecimento educacional

---

## ⚙️ Funcionalidades

### API – Endpoints

- `GET /posts` – Lista de postagens disponíveis para leitura  
- `GET /posts/:id` – Retorna o conteúdo completo de uma postagem  
- `POST /posts` – Criação de uma nova postagem  
- `PUT /posts/:id` – Atualização de uma postagem  
- `DELETE /posts/:id` – Remoção de uma postagem  
- `GET /posts/search` – Busca por palavras-chave  

---

## 🛠️ Requisitos Técnicos

- **Back-end:** Node.js com Express  
- **Banco de Dados:** PostgreSQL ou MongoDB  
- **Containerização:** Docker  
- **CI/CD:** GitHub Actions  
- **Testes:** Cobertura mínima de 20%  
- **Documentação:** Setup, arquitetura e uso da API  

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js (>= 18.x)
- Docker
- Banco de dados configurado

### Execução Local

```bash
git clone https://github.com/FIAPGrupo20/DiarioDeClasse.git
cd seu-repositorio
npm install
npm run dev
```

### Execução com Docker

```bash
docker build -t blog-educacao .
docker run -p 3000:3000 blog-educacao
```

---

## 🧪 Testes

```bash
npm run test
```

---

## 📦 Entregáveis

- Código-fonte versionado no GitHub
- Dockerfile e CI/CD
- Documentação técnica
- Demonstração da aplicação

---

## 📜 Licença

Este projeto está licenciado sob a **Licença MIT**.
A licença permite o uso, modificação e distribuição do software, desde que os créditos e os termos da licença original sejam preservados.
