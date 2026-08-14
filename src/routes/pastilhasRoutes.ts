import { Router } from 'express';
import { prisma } from '../lib/prisma.js'; 

const router = Router();

router.get('/', async (req, res) => {
  const pastilhas = await prisma.pastilha.findMany({
    include: { fornecedor: true }
  });
  res.json(pastilhas);
});

router.get('/alertas', async (req, res) => {
  const todasAsPastilhas = await prisma.pastilha.findMany({
    include: { fornecedor: true }
  });

  const pastilhasEmAlerta = todasAsPastilhas.filter(
    (pastilha) => pastilha.estoqueAtual <= pastilha.estoqueMinimo
  );

  res.json({
    quantidadeDeAlertas: pastilhasEmAlerta.length,
    itensParaComprar: pastilhasEmAlerta
  });
});

router.post('/', async (req, res) => {
  const { codigo, descricao, estoqueAtual, estoqueMinimo, fornecedorId } = req.body;

  try {
    const novaPastilha = await prisma.pastilha.create({
      data: {
        codigo,
        descricao,
        estoqueAtual: estoqueAtual || 0,
        estoqueMinimo,
        fornecedorId
      }
    });
    res.status(201).json(novaPastilha);
  } catch (error: any) {
    res.status(400).json({ erro: 'Não foi possível cadastrar a pastilha.', motivo: error.message });
  }
});

export default router;