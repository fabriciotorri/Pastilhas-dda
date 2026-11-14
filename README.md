# 🏭 Sistema de Controle de Estoque de Pastilhas – DDA Metalúrgica

Sistema web desenvolvido para gerenciamento e controle de estoque de pastilhas industriais utilizadas em processos de usinagem.

O projeto foi desenvolvido como parte do Projeto Aplicado IV do curso de Análise e Desenvolvimento de Sistemas, utilizando uma arquitetura baseada em API REST, banco de dados relacional e interface web responsiva.

## 📌 Sobre o projeto

O Sistema de Controle de Estoque de Pastilhas – DDA Metalúrgica tem como objetivo fornecer uma solução simples e funcional para o controle de materiais utilizados em processos de usinagem.

O sistema permite cadastrar pastilhas e fornecedores, registrar movimentações de entrada e saída, acompanhar os níveis de estoque e gerar relatórios para consulta e análise das movimentações.

O projeto foi desenvolvido como um MVP (Minimum Viable Product), permitindo demonstrar as principais funcionalidades necessárias para o gerenciamento de estoque.

> **Observação:** os dados utilizados na aplicação são dados de demonstração utilizados para fins acadêmicos e de desenvolvimento do MVP.

## 🎯 Objetivos

- Controlar o estoque de pastilhas de usinagem;
- Registrar entradas e saídas de materiais;
- Evitar movimentações que resultem em estoque negativo;
- Identificar itens com estoque abaixo do nível mínimo;
- Manter histórico das movimentações;
- Permitir o cadastro e gerenciamento de fornecedores;
- Facilitar a consulta das informações através de um dashboard;
- Disponibilizar relatórios das movimentações;
- Permitir a exportação dos dados para Excel e PDF.

## 🛠️ Tecnologias Utilizadas

- **Linguagem:** TypeScript
- **Runtime:** Node.js
- **Framework Backend:** Express
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL
- **Frontend:** HTML, CSS e JavaScript (Vanilla)
- **Testes Unitários:** Jest + Supertest + ts-jest

## 🚀 Funcionalidades

### 📊 Dashboard

O dashboard apresenta uma visão geral do estoque, incluindo:

- Total de tipos de pastilhas cadastradas;
- Quantidade total em estoque;
- Quantidade de itens em situação crítica;
- Movimentações recentes;
- Informações resumidas sobre o estoque.

### 🔧 Cadastro de Pastilhas

Permite cadastrar pastilhas informando: Código, Descrição, Estoque atual, Estoque mínimo e Fornecedor. O sistema também apresenta o status do estoque de cada pastilha.

### 🏭 Cadastro de Fornecedores

Permite cadastrar e consultar fornecedores (ID, Nome, CNPJ). O CNPJ possui controle de unicidade no banco de dados.

### 📥 Entrada de Estoque

Permite registrar a entrada de determinada quantidade de pastilhas. A movimentação atualiza automaticamente o estoque da pastilha.

### 📤 Saída de Estoque e Controle de Estoque Negativo

Permite registrar a saída de pastilhas do estoque.

Antes de registrar uma saída, o sistema verifica o saldo disponível. Caso a quantidade solicitada seja superior ao estoque atual, a movimentação é recusada.

**Exemplo:**
- Estoque atual: 10
- Saída solicitada: 15
- **Resultado:** ❌ Movimentação não permitida (HTTP 400 - Estoque insuficiente).

## 🧪 Testes Unitários

A funcionalidade de **Saída de Estoque** possui cobertura de testes unitários automatizados para garantir a integridade das regras de negócio (como o bloqueio de estoque negativo).

Para executar os testes, utilize o comando:
> **npm test**

Para visualizar o relatório de cobertura (coverage):
> **npm test -- --coverage**

## ⚙️ Como executar o projeto localmente

### Pré-requisitos

- Node.js instalado (versão 20.x ou superior)
- PostgreSQL instalado e rodando
- Git

### Passo a passo

1. **Clone o repositório:**
   > git clone https://github.com/fabriciotorri/Pastilhas-dda.git
   > cd Pastilhas-dda

2. **Instale as dependências:**
   > npm install

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto com a string de conexão do seu banco PostgreSQL:
   > DATABASE_URL="postgresql://usuario:senha@localhost:5432/dda_estoque?schema=public"

4. **Sincronize o banco de dados (Prisma):**
   > npx prisma db push

5. **Inicie o servidor em modo de desenvolvimento:**
   > npm run dev

   O servidor estará rodando em `http://localhost:3333`.

## 👥 Equipe

- Daniel da Cruz Santos Paraná
- Débora Eduarda Schol
- Fabricio Torri
- Marcos Patrick Costa Campos

---
*Projeto desenvolvido para fins acadêmicos - Centro Universitário SENAI Santa Catarina.*
