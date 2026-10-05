# 🏭 Sistema de Controle de Estoque de Pastilhas – DDA Metalúrgica

Sistema web desenvolvido para gerenciamento e controle de estoque de pastilhas industriais utilizadas em processos de usinagem.

O projeto foi desenvolvido como parte de um projeto acadêmico do curso de **Análise e Desenvolvimento de Sistemas**, utilizando uma arquitetura baseada em API REST, banco de dados relacional e interface web responsiva.

---

## 📌 Sobre o projeto

O **Sistema de Controle de Estoque de Pastilhas – DDA Metalúrgica** tem como objetivo fornecer uma solução simples e funcional para o controle de materiais utilizados em processos de usinagem.

O sistema permite cadastrar pastilhas e fornecedores, registrar movimentações de entrada e saída, acompanhar os níveis de estoque e gerar relatórios para consulta e análise das movimentações.

O projeto foi desenvolvido como um **MVP (Minimum Viable Product)**, permitindo demonstrar as principais funcionalidades necessárias para o gerenciamento de estoque.

> **Observação:** os dados utilizados na aplicação são dados de demonstração utilizados para fins acadêmicos e de desenvolvimento do MVP.

---

## 🎯 Objetivos

O sistema foi desenvolvido com os seguintes objetivos:

- Controlar o estoque de pastilhas de usinagem;
- Registrar entradas e saídas de materiais;
- Evitar movimentações que resultem em estoque negativo;
- Identificar itens com estoque abaixo do nível mínimo;
- Manter histórico das movimentações;
- Permitir o cadastro e gerenciamento de fornecedores;
- Facilitar a consulta das informações através de um dashboard;
- Disponibilizar relatórios das movimentações;
- Permitir a exportação dos dados para Excel e PDF.

---

## 🚀 Funcionalidades

### 📊 Dashboard

O dashboard apresenta uma visão geral do estoque, incluindo:

- Total de tipos de pastilhas cadastradas;
- Quantidade total em estoque;
- Quantidade de itens em situação crítica;
- Movimentações recentes;
- Informações resumidas sobre o estoque.

---

### 🔧 Cadastro de Pastilhas

Permite cadastrar pastilhas informando:

- Código;
- Descrição;
- Estoque atual;
- Estoque mínimo;
- Fornecedor.

O sistema também apresenta o status do estoque de cada pastilha.

---

### 🏭 Cadastro de Fornecedores

Permite cadastrar e consultar fornecedores.

Informações disponíveis:

- ID;
- Nome;
- CNPJ.

O CNPJ possui controle de unicidade no banco de dados.

---

### 📥 Entrada de Estoque

Permite registrar a entrada de determinada quantidade de pastilhas.

A movimentação atualiza automaticamente o estoque da pastilha.

---

### 📤 Saída de Estoque

Permite registrar a saída de pastilhas do estoque.

O sistema verifica a quantidade disponível antes de realizar a operação, impedindo que o estoque fique negativo.

---

### 🚫 Controle de Estoque Negativo

Antes de registrar uma saída, o sistema verifica o saldo disponível.

Caso a quantidade solicitada seja superior ao estoque atual, a movimentação é recusada.

Exemplo:

```text
Estoque atual: 10

Saída solicitada: 15

Resultado:
❌ Movimentação não permitida
