import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ==========================================
// ROTAS DE FORNECEDORES
// ==========================================

// Cadastrar novo fornecedor
app.post('/fornecedores', async (req: Request, res: Response) => {
  try {
    const { nome, cnpj } = req.body;
    const fornecedor = await prisma.fornecedor.create({
      data: { nome, cnpj },
    });
    res.status(201).json(fornecedor);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao cadastrar fornecedor. Verifique se o CNPJ já existe.' });
  }
});

// Listar todos os fornecedores
app.get('/fornecedores', async (req: Request, res: Response) => {
  const fornecedores = await prisma.fornecedor.findMany();
  res.json(fornecedores);
});

// ==========================================
// ROTAS DE PASTILHAS
// ==========================================

// Cadastrar nova pastilha
app.post('/pastilhas', async (req: Request, res: Response) => {
  try {
    const { codigo, descricao, estoqueAtual, estoqueMinimo, fornecedorId } = req.body;
    
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
    res.status(400).json({ error: 'Erro ao cadastrar pastilha. Verifique os dados e se o código já existe.' });
  }
});

// Listar pastilhas com verificação automática de alerta (Estoque Crítico)
app.get('/pastilhas', async (req: Request, res: Response) => {
  const pastilhas = await prisma.pastilha.findMany({
    include: { fornecedor: true }
  });
  
  // Mapeia as pastilhas e adiciona a propriedade dinâmica de alerta
  const pastilhasComStatus = pastilhas.map(p => ({
    ...p,
    alertaCritico: p.estoqueAtual <= p.estoqueMinimo
  }));

  res.json(pastilhasComStatus);
});

// ==========================================
// ROTAS DE MOVIMENTAÇÃO (Extra)
// ==========================================

// Registrar Entrada ou Saída de Estoque
app.post('/movimentacao', async (req: Request, res: Response) => {
  try {
    const { pastilhaId, tipo, quantidade } = req.body;

    // Validação do tipo de movimentação
    if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') {
      return res.status(400).json({
        error: 'Tipo de movimentação inválido. Use ENTRADA ou SAIDA.',
      });
    }

    // Validação da quantidade
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      return res.status(400).json({
        error: 'A quantidade deve ser um número inteiro maior que zero.',
      });
    }

    // Busca a pastilha
    const pastilha = await prisma.pastilha.findUnique({
      where: { id: pastilhaId },
    });

    if (!pastilha) {
      return res.status(404).json({
        error: 'Pastilha não encontrada.',
      });
    }

    // Verifica se há estoque suficiente para uma saída
    if (tipo === 'SAIDA' && quantidade > pastilha.estoqueAtual) {
      return res.status(400).json({
        error: `Estoque insuficiente. Estoque atual: ${pastilha.estoqueAtual}.`,
      });
    }

    // Define o impacto da movimentação no estoque
    const modificador = tipo === 'ENTRADA'
      ? quantidade
      : -quantidade;

    // Atualiza o estoque e registra a movimentação
    const pastilhaAtualizada = await prisma.pastilha.update({
      where: { id: pastilhaId },
      data: {
        estoqueAtual: { increment: modificador },
        movimentacoes: {
          create: {
            tipo,
            quantidade,
          },
        },
      },
    });

    res.json(pastilhaAtualizada);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Erro ao movimentar o estoque.',
    });
  }
});

// Listar histórico de movimentações
app.get('/movimentacoes', async (req: Request, res: Response) => {
  try {
    const movimentacoes = await prisma.movimentacao.findMany({
      include: {
        pastilha: true,
      },
      orderBy: {
        data: 'desc',
      },
    });

    res.json(movimentacoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar movimentações.' });
  }
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`[DDA Metalurgica API] Servidor rodando na porta ${PORT}`);
});
