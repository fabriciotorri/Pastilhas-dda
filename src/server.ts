import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import fornecedorRoutes from './routes/fornecedorRoutes';
import pastilhasRoutes from './routes/pastilhasRoutes';
import movimentacaoRoutes from './routes/movimentacaoRoutes';
import estoqueRoutes from './routes/estoqueRoutes';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/fornecedores', fornecedorRoutes);
app.use('/pastilhas', pastilhasRoutes);
app.use('/movimentacoes', movimentacaoRoutes);
app.use('/movimentacao', movimentacaoRoutes);
app.use('/estoque', estoqueRoutes);



// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(
    `[DDA Metalúrgica API] Servidor rodando na porta ${PORT}`,
  );
});