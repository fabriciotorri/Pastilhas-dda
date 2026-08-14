import { Router } from 'express';
import { prisma } from '../lib/prisma.js'; 

const router = Router();

router.post('/', async (req, res) => {
  const { pastilhaId, tipo, quantidade, motivo } = req.body;

  try {
    const pastilha = await prisma.pastilha.findUnique({
      where: { id: pastilhaId }
    });

    if (!pastilha) {
      return res.status(404).json({ erro: 'Pastilha não encontrada.' });
    }

    let novoEstoque = pastilha.estoqueAtual;
    
    if (tipo === 'ENTRADA') {
      novoEstoque = novoEstoque + quantidade;
    } else if (tipo === 'SAIDA') {
      if (novoEstoque < quantidade) {
        return res.status(400).json({ erro: 'Estoque insuficiente para esta saída.' });
      }
      novoEstoque = novoEstoque - quantidade;
    }

    const movimentacao = await prisma.movimentacao.create({
      data: { tipo, quantidade, motivo, pastilhaId }
    });

    const pastilhaAtualizada = await prisma.pastilha.update({
      where: { id: pastilhaId },
      data: { estoqueAtual: novoEstoque }
    });

    res.status(201).json({
      mensagem: "Movimentação registrada com sucesso!",
      historico: movimentacao,
      estoqueFinal: pastilhaAtualizada.estoqueAtual
    });

  } catch (error: any) {
    res.status(400).json({ erro: 'Erro ao registrar.', motivo: error.message });
  }
});

export default router;