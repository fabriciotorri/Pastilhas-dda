document.addEventListener('DOMContentLoaded', () => {
  carregarFornecedores();
});

async function carregarFornecedores() {
  try {
    const resposta = await fetch(`${API_URL}/fornecedores`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar fornecedores.');
    }

    const fornecedores = await resposta.json();

    const tabela = document.getElementById('fornecedoresTable');

    if (!tabela) {
      return;
    }

    tabela.innerHTML = '';

    if (fornecedores.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td
            colspan="3"
            class="p-6 text-center text-sm text-slate-500"
          >
            Nenhum fornecedor cadastrado.
          </td>
        </tr>
      `;

      return;
    }

    fornecedores.forEach((fornecedor) => {
      const linha = document.createElement('tr');

      linha.innerHTML = `
        <td class="p-3">
          ${fornecedor.id}
        </td>

        <td class="p-3 font-medium">
          ${fornecedor.nome}
        </td>

        <td class="p-3">
          ${fornecedor.cnpj || 'Não informado'}
        </td>
      `;

      tabela.appendChild(linha);
    });

  } catch (erro) {
    console.error(
      'Erro ao carregar fornecedores:',
      erro
    );
  }
}

document
  .getElementById('fornecedorForm')
  .addEventListener('submit', async (event) => {

    event.preventDefault();

    const nome = document
      .getElementById('nomeFornecedor')
      .value
      .trim();

    const cnpj = document
      .getElementById('cnpjFornecedor')
      .value
      .trim();

    try {

      const resposta = await fetch(`${API_URL}/fornecedores`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          nome,
          cnpj
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error || 'Erro ao cadastrar fornecedor.'
        );
      }

      alert('Fornecedor cadastrado com sucesso!');

      document.getElementById('fornecedorForm').reset();

      await carregarFornecedores();

    } catch (erro) {

      console.error(
        'Erro ao cadastrar fornecedor:',
        erro
      );

      alert(erro.message);
    }
  });