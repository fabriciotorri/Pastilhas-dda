import express from 'express';
import fornecedorRoutes from './routes/fornecedorRoutes.js';
import pastilhasRoutes from './routes/pastilhasRoutes.js';
import movimentacaoRoutes from './routes/movimentacaoRoutes.js';


const app = express();
app.use(express.json());

// Rota de teste
app.get('/ping', (req, res) => {
  res.json({ mensagem: 'API da DDA Metalúrgica está online!' });
});

// Usando as rotas separadas por módulos
app.use('/fornecedores', fornecedorRoutes);
app.use('/pastilhas', pastilhasRoutes);
app.use('/movimentacoes', movimentacaoRoutes);

// ATENÇÃO NA ROTA DE ALERTA: como usamos a base '/pastilhas', o alerta ficou em '/pastilhas/alertas'
const PORT = 3333;
app.listen(PORT, () => {
  console.log(`[DDA API] Servidor organizado rodando na porta ${PORT}`);
});