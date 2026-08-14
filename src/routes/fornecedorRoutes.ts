import { Router } from 'express';
import { prisma } from '../lib/prisma.js'; 

const router = Router();

router.get('/', async (req, res) => {
  const fornecedores = await prisma.fornecedor.findMany();
  res.json(fornecedores);
});

router.post('/', async (req, res) => {
  const { nome, cnpj } = req.body;
  try {
    const novoFornecedor = await prisma.fornecedor.create({
      data: { nome, cnpj }
    });
    res.status(201).json(novoFornecedor);
  } catch (error) {
    res.status(400).json({ erro: 'Não foi possível cadastrar o fornecedor.' });
  }
});

export default router;