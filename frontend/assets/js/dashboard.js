document.addEventListener('DOMContentLoaded', () => {
  carregarDashboard();
});

async function carregarDashboard() {
  try {
    const resposta = await fetch(`${API_URL}/estoque/resumo`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar dados do estoque.');
    }

    const dados = await resposta.json();

    console.log('Dados recebidos da API:', dados);

    atualizarIndicadores(dados);
    atualizarMovimentacoes(dados.movimentacoesRecentes);

    await carregarPastilhas();

  } catch (erro) {
    console.error('Erro ao carregar dashboard:', erro);
  }
}


// ==========================================
// INDICADORES DO DASHBOARD
// ==========================================

function atualizarIndicadores(dados) {
  const totalEstoque = document.getElementById('totalEstoque');
  const estoqueCritico = document.getElementById('vermelho');
  const totalPastilhas = document.getElementById('laranja');
  const movimentacoesRecentes = document.getElementById('amarelo');

  if (totalEstoque) {
    totalEstoque.textContent = dados.estoqueTotal;
  }

  if (estoqueCritico) {
    estoqueCritico.textContent = dados.estoqueCritico;
  }

  if (totalPastilhas) {
    totalPastilhas.textContent = dados.totalPastilhas;
  }

  if (movimentacoesRecentes) {
    movimentacoesRecentes.textContent = dados.movimentacoesRecentes.length;
  }
}


// ==========================================
// LISTA DE PASTILHAS
// ==========================================

async function carregarPastilhas() {
  try {
    const resposta = await fetch(`${API_URL}/pastilhas`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar pastilhas.');
    }

    const pastilhas = await resposta.json();

    const lista = document.getElementById('listaEtq');

    if (!lista) {
      return;
    }

    lista.innerHTML = '';

    if (pastilhas.length === 0) {
      lista.innerHTML = `
        <p class="text-gray-500">
          Nenhuma pastilha cadastrada.
        </p>
      `;
      return;
    }

    pastilhas.forEach((pastilha) => {
      const item = document.createElement('div');

      item.className =
        'flex justify-between items-center border-b py-3';

      item.innerHTML = `
        <div>
          <p class="font-semibold">
            ${pastilha.codigo}
          </p>

          <p class="text-sm text-gray-500">
            ${pastilha.descricao}
          </p>

          <p class="text-sm text-gray-500">
            Fornecedor: ${pastilha.fornecedor?.nome || 'Não informado'}
          </p>
        </div>

        <div class="text-right">
          <p class="font-semibold">
            ${pastilha.estoqueAtual} unidades
          </p>

          <p class="text-sm text-gray-500">
            Mínimo: ${pastilha.estoqueMinimo} unidades
          </p>

          <p class="text-sm ${
            pastilha.alertaCritico
              ? 'text-red-600'
              : 'text-green-600'
          }">
            ${
              pastilha.alertaCritico
                ? 'Estoque crítico'
                : 'Estoque normal'
            }
          </p>
        </div>
      `;

      lista.appendChild(item);
    });

  } catch (erro) {
    console.error('Erro ao carregar pastilhas:', erro);
  }
}


// ==========================================
// MOVIMENTAÇÕES RECENTES
// ==========================================

function atualizarMovimentacoes(movimentacoes) {
  const lista = document.getElementById('listaAlertas');

  if (!lista) {
    return;
  }

  lista.innerHTML = '';

  if (!movimentacoes || movimentacoes.length === 0) {
    lista.innerHTML = `
      <p class="text-gray-500">
        Nenhuma movimentação recente.
      </p>
    `;
    return;
  }

  movimentacoes.forEach((movimentacao) => {
    const item = document.createElement('div');

    item.className =
      'border-b py-3';

    const sinal =
      movimentacao.tipo === 'ENTRADA'
        ? '+'
        : '-';

    item.innerHTML = `
      <div class="flex justify-between items-center">

        <div>
          <p class="font-semibold">
            ${movimentacao.pastilha.codigo}
          </p>

          <p class="text-sm text-gray-500">
            ${movimentacao.pastilha.descricao}
          </p>
        </div>

        <div class="text-right">

          <p class="font-semibold">
            ${sinal}${movimentacao.quantidade}
          </p>

          <p class="text-sm text-gray-500">
            ${movimentacao.tipo}
          </p>

        </div>

      </div>
    `;

    lista.appendChild(item);
  });
}