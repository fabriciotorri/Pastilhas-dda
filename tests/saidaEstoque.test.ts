// 1) Mock do Prisma ANTES de importar o app
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    pastilha: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    movimentacao: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    fornecedor: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

import request from 'supertest';
import app from '../src/server';
import { PrismaClient } from '@prisma/client';

// Recupera a instância mockada
const prisma = new PrismaClient() as any;

describe('Saída de Estoque - Regras de Negócio', () => {
  beforeEach(() => jest.clearAllMocks());

  // CT01 - Saída válida
  test('CT01 - deve registrar saída quando quantidade for menor que o estoque', async () => {
    prisma.pastilha.findUnique.mockResolvedValue({ id: 1, estoqueAtual: 10 });
    prisma.$transaction.mockResolvedValue([
      { id: 1, estoqueAtual: 5 },
      { id: 1, tipo: 'SAIDA', quantidade: 5, pastilhaId: 1 },
    ]);

    const res = await request(app)
      .post('/movimentacoes')
      .send({ tipo: 'SAIDA', quantidade: 5, pastilhaId: 1 });

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);
  });

  // CT02 - Valor limite
  test('CT02 - deve permitir saída igual ao estoque disponível', async () => {
    prisma.pastilha.findUnique.mockResolvedValue({ id: 1, estoqueAtual: 10 });
    prisma.$transaction.mockResolvedValue([
      { id: 1, estoqueAtual: 0 },
      { id: 1, tipo: 'SAIDA', quantidade: 10, pastilhaId: 1 },
    ]);

    const res = await request(app)
      .post('/movimentacoes')
      .send({ tipo: 'SAIDA', quantidade: 10, pastilhaId: 1 });

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);
  });

  // CT03 - Bloqueio de estoque negativo
  test('CT03 - deve recusar saída maior que o estoque', async () => {
    prisma.pastilha.findUnique.mockResolvedValue({ id: 1, estoqueAtual: 10 });

    const res = await request(app)
      .post('/movimentacoes')
      .send({ tipo: 'SAIDA', quantidade: 15, pastilhaId: 1 });

    expect(res.status).toBe(400);
  });

  // CT04 - Quantidade zero
  test('CT04 - deve recusar quantidade zero', async () => {
    const res = await request(app)
      .post('/movimentacoes')
      .send({ tipo: 'SAIDA', quantidade: 0, pastilhaId: 1 });

    expect(res.status).toBe(400);
  });

  // CT05 - Quantidade negativa
  test('CT05 - deve recusar quantidade negativa', async () => {
    const res = await request(app)
      .post('/movimentacoes')
      .send({ tipo: 'SAIDA', quantidade: -3, pastilhaId: 1 });

    expect(res.status).toBe(400);
  });

  // CT06 - Pastilha inexistente
  test('CT06 - deve retornar erro quando pastilha não existir', async () => {
    prisma.pastilha.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/movimentacoes')
      .send({ tipo: 'SAIDA', quantidade: 1, pastilhaId: 9999 });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  // CT07 - Estoque zerado
  test('CT07 - deve bloquear saída quando estoque for zero', async () => {
    prisma.pastilha.findUnique.mockResolvedValue({ id: 1, estoqueAtual: 0 });

    const res = await request(app)
      .post('/movimentacoes')
      .send({ tipo: 'SAIDA', quantidade: 1, pastilhaId: 1 });

    expect(res.status).toBe(400);
  });
});