document.addEventListener('DOMContentLoaded', () => {
  carregarPastilhas();
  carregarMovimentacoes();
});

async function carregarPastilhas() {
  try {
    const resposta = await fetch(`${API_URL}/pastilhas`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar pastilhas.');
    }

    const pastilhas = await resposta.json();

    const select = document.getElementById('pastilhaId');

    if (!select) {
      return;
    }

    pastilhas.forEach((pastilha) => {
      const option = document.createElement('option');

      option.value = pastilha.id;
      option.textContent = `${pastilha.codigo} - ${pastilha.descricao}`;

      select.appendChild(option);
    });

  } catch (erro) {
    console.error('Erro ao carregar pastilhas:', erro);
  }
}

document
  .getElementById('movimentacaoForm')
  .addEventListener('submit', async (event) => {

    event.preventDefault();

    const pastilhaId = Number(
      document.getElementById('pastilhaId').value
    );

    const tipo = document.getElementById('tipoMovimentacao').value;

    const quantidade = Number(
      document.getElementById('quantidadeMovimentacao').value
    );

    try {

      const resposta = await fetch(`${API_URL}/movimentacoes`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          tipo,
          quantidade,
          pastilhaId
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error || 'Erro ao registrar movimentação.'
        );
      }

      alert('Movimentação registrada com sucesso!');

      document.getElementById('movimentacaoForm').reset();

      await carregarMovimentacoes();

    } catch (erro) {

      console.error(
        'Erro ao registrar movimentação:',
        erro
      );

      alert(erro.message);
    }
  });

  async function carregarMovimentacoes() {
  try {
    const resposta = await fetch(`${API_URL}/movimentacoes`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar movimentações.');
    }

    const movimentacoes = await resposta.json();

    const tabela = document.getElementById('movimentacoesTable');

    if (!tabela) {
      return;
    }

    tabela.innerHTML = '';

    if (movimentacoes.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td
            colspan="5"
            class="p-6 text-center text-sm text-slate-500"
          >
            Nenhuma movimentação registrada.
          </td>
        </tr>
      `;

      return;
    }

    movimentacoes.forEach((movimentacao) => {
      const linha = document.createElement('tr');

      const data = new Date(movimentacao.data);

      linha.innerHTML = `
        <td class="p-3">
          ${movimentacao.id}
        </td>

        <td class="p-3">
          ${data.toLocaleString('pt-BR')}
        </td>

        <td class="p-3">
          ${movimentacao.pastilha.codigo}
          - ${movimentacao.pastilha.descricao}
        </td>

        <td class="p-3">
          ${movimentacao.tipo}
        </td>

        <td class="p-3">
          ${movimentacao.quantidade}
        </td>
      `;

      tabela.appendChild(linha);
    });

  } catch (erro) {
    console.error(
      'Erro ao carregar movimentações:',
      erro
    );
  }
}