import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();


// ==========================================
// RESUMO DO ESTOQUE
// ==========================================
router.get('/resumo', async (req, res) => {
  try {
    // Buscar todas as pastilhas
    const pastilhas = await prisma.pastilha.findMany({
      include: {
        fornecedor: true,
      },
    });

    // Calcular informações do estoque
    const totalPastilhas = pastilhas.length;

    const estoqueTotal = pastilhas.reduce(
      (total, pastilha) => total + pastilha.estoqueAtual,
      0
    );

    const estoqueCritico = pastilhas.filter(
      (pastilha) => pastilha.estoqueAtual <= pastilha.estoqueMinimo
    ).length;

    // Buscar as 5 movimentações mais recentes
    const movimentacoesRecentes = await prisma.movimentacao.findMany({
      include: {
        pastilha: true,
      },
      orderBy: {
        data: 'desc',
      },
      take: 5,
    });

    res.json({
      totalPastilhas,
      estoqueTotal,
      estoqueCritico,
      movimentacoesRecentes,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Erro ao buscar resumo do estoque.',
    });
  }
});

export default router;