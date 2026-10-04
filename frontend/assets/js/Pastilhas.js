document.addEventListener('DOMContentLoaded', () => {
  carregarFornecedores();
  carregarPastilhas();
});

async function carregarFornecedores() {
  try {
    const resposta = await fetch(`${API_URL}/fornecedores`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar fornecedores.');
    }

    const fornecedores = await resposta.json();

    const select = document.getElementById('fornecedorId');

    if (!select) {
      return;
    }

    fornecedores.forEach((fornecedor) => {
      const option = document.createElement('option');

      option.value = fornecedor.id;
      option.textContent = fornecedor.nome;

      select.appendChild(option);
    });

  } catch (erro) {
    console.error('Erro ao carregar fornecedores:', erro);
  }

}

  async function carregarPastilhas() {
  try {
    const resposta = await fetch(`${API_URL}/pastilhas`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar pastilhas.');
    }

    const pastilhas = await resposta.json();

    const tabela = document.getElementById('estqTable');

    if (!tabela) {
      return;
    }

    tabela.innerHTML = '';

    if (pastilhas.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="9" class="p-6 text-center text-sm text-slate-500">
            Nenhuma pastilha cadastrada.
          </td>
        </tr>
      `;

      return;
    }

    pastilhas.forEach((pastilha) => {
      const linha = document.createElement('tr');

      linha.innerHTML = `
        <td class="p-4">
          ${pastilha.id}
        </td>

        <td class="p-4 font-medium">
          ${pastilha.codigo}
        </td>

        <td class="p-4">
          ${pastilha.descricao}
        </td>

        <td class="p-4">
          ${pastilha.fornecedor?.nome || 'Não informado'}
        </td>

        <td class="p-4">
          ${pastilha.estoqueAtual}
        </td>

        <td class="p-4">
          ${pastilha.estoqueMinimo}
        </td>

        <td class="p-4">
          ${
            pastilha.alertaCritico
              ? '<span class="text-red-600 font-semibold">Crítico</span>'
              : '<span class="text-green-600 font-semibold">Normal</span>'
          }
        </td>
      `;

      tabela.appendChild(linha);
    });

  } catch (erro) {
    console.error('Erro ao carregar pastilhas:', erro);
  }
}

document.getElementById('EtqForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const codigo = document.getElementById('codigoPastilha').value.trim();
  const descricao = document.getElementById('descricaoPastilha').value.trim();
  const estoqueAtual = Number(document.getElementById('estoqueAtual').value);
  const estoqueMinimo = Number(document.getElementById('estoqueMinimo').value);
  const fornecedorId = Number(document.getElementById('fornecedorId').value);

  try {
    const resposta = await fetch(`${API_URL}/pastilhas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        codigo,
        descricao,
        estoqueAtual,
        estoqueMinimo,
        fornecedorId
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.error || 'Erro ao cadastrar pastilha.');
    }

    alert('Pastilha cadastrada com sucesso!');

    document.getElementById('EtqForm').reset();

    await carregarPastilhas();

  } catch (erro) {
    console.error('Erro ao cadastrar pastilha:', erro);
    alert(erro.message);
  }
});

