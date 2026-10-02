import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// REGISTRAR ENTRADA OU SAÍDA
// ==========================================
router.post('/', async (req, res) => {
  try {
    const { tipo, quantidade, pastilhaId } = req.body;

    // Validar tipo
    if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') {
      return res.status(400).json({
        error: 'Tipo de movimentação inválido. Use ENTRADA ou SAIDA.',
      });
    }

    // Validar quantidade
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      return res.status(400).json({
        error: 'A quantidade deve ser um número inteiro maior que zero.',
      });
    }

    // Buscar pastilha
    const pastilha = await prisma.pastilha.findUnique({
      where: { id: pastilhaId },
    });

    if (!pastilha) {
      return res.status(404).json({
        error: 'Pastilha não encontrada.',
      });
    }

    // Calcular novo estoque
    const novoEstoque =
      tipo === 'ENTRADA'
        ? pastilha.estoqueAtual + quantidade
        : pastilha.estoqueAtual - quantidade;

    // Impedir estoque negativo
    if (novoEstoque < 0) {
      return res.status(400).json({
        error: `Estoque insuficiente. Estoque atual: ${pastilha.estoqueAtual}.`,
      });
    }

    // Atualizar estoque e registrar movimentação
    const resultado = await prisma.$transaction(async (tx) => {
      const pastilhaAtualizada = await tx.pastilha.update({
        where: { id: pastilhaId },
        data: {
          estoqueAtual: novoEstoque,
        },
      });

      const movimentacao = await tx.movimentacao.create({
        data: {
          tipo,
          quantidade,
          pastilhaId,
        },
      });

      return {
        pastilha: pastilhaAtualizada,
        movimentacao,
      };
    });

    res.status(201).json(resultado);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      error: 'Erro ao registrar movimentação.',
    });
  }
});

// ==========================================
// HISTÓRICO DE MOVIMENTAÇÕES
// ==========================================
router.get('/', async (req, res) => {
  try {
    const { tipo, pastilhaId, dataInicio, dataFim } = req.query;

    // Validar tipo
    if (tipo && tipo !== 'ENTRADA' && tipo !== 'SAIDA') {
      return res.status(400).json({
        error: 'Tipo de movimentação inválido. Use ENTRADA ou SAIDA.',
      });
    }

    let pastilhaIdNumber: number | undefined;

    if (pastilhaId) {
      pastilhaIdNumber = Number(pastilhaId);

      if (!Number.isInteger(pastilhaIdNumber) || pastilhaIdNumber <= 0) {
        return res.status(400).json({
          error: 'pastilhaId deve ser um número inteiro maior que zero.',
        });
      }
    }

    let dataInicioDate: Date | undefined;
    let dataFimDate: Date | undefined;

    if (dataInicio) {
      dataInicioDate = new Date(`${dataInicio}T00:00:00`);

      if (isNaN(dataInicioDate.getTime())) {
        return res.status(400).json({
          error: 'dataInicio inválida. Use o formato AAAA-MM-DD.',
        });
      }
    }

    if (dataFim) {
      dataFimDate = new Date(`${dataFim}T23:59:59`);

      if (isNaN(dataFimDate.getTime())) {
        return res.status(400).json({
          error: 'dataFim inválida. Use o formato AAAA-MM-DD.',
        });
      }
    }

    if (dataInicioDate && dataFimDate && dataInicioDate > dataFimDate) {
      return res.status(400).json({
        error: 'dataInicio não pode ser maior que dataFim.',
      });
    }

    const movimentacoes = await prisma.movimentacao.findMany({
      where: {
        ...(tipo ? { tipo: tipo as string } : {}),
        ...(pastilhaIdNumber ? { pastilhaId: pastilhaIdNumber } : {}),
        ...(dataInicioDate || dataFimDate
          ? {
              data: {
                ...(dataInicioDate ? { gte: dataInicioDate } : {}),
                ...(dataFimDate ? { lte: dataFimDate } : {}),
              },
            }
          : {}),
      },
      include: {
        pastilha: true,
      },
      orderBy: {
        data: 'desc',
      },
    });

    res.json(movimentacoes);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Erro ao buscar movimentações.',
    });
  }
});

export default router;