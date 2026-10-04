import { Router } from 'express';
import prisma from '../lib/prisma';
import express, { Request, Response } from 'express';


const router = Router();


// Cadastrar novo fornecedor
router.post('/', async (req, res) => {
  try {
    const { nome, cnpj } = req.body;

    const fornecedor = await prisma.fornecedor.create({
      data: {
        nome,
        cnpj,
      },
    });

    res.status(201).json(fornecedor);
  } catch (error) {
    res.status(400).json({
      error: 'Erro ao cadastrar fornecedor. Verifique se o CNPJ já existe.',
    });
  }
});

// Listar todos os fornecedores
router.get('/', async (req, res) => {
  const fornecedores = await prisma.fornecedor.findMany();

  res.json(fornecedores);
});

export default router;