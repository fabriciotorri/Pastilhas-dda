import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Cadastrar nova pastilha
router.post('/', async (req, res) => {
  try {
    const {
      codigo,
      descricao,
      estoqueAtual,
      estoqueMinimo,
      fornecedorId,
    } = req.body;

    const pastilha = await prisma.pastilha.create({
      data: {
        codigo,
        descricao,
        estoqueAtual: estoqueAtual || 0,
        estoqueMinimo,
        fornecedorId,
      },
    });

    res.status(201).json(pastilha);
  } catch (error) {
    res.status(400).json({
      error:
        'Erro ao cadastrar pastilha. Verifique os dados e se o código já existe.',
    });
  }
});

// Listar pastilhas com verificação automática de alerta
router.get('/', async (req, res) => {
  const pastilhas = await prisma.pastilha.findMany({
    include: {
      fornecedor: true,
    },
  });

  const pastilhasComStatus = pastilhas.map((p) => ({
    ...p,
    alertaCritico: p.estoqueAtual <= p.estoqueMinimo,
  }));

  res.json(pastilhasComStatus);
});

export default router;