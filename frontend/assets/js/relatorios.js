let dadosRelatorio = [];

document.addEventListener('DOMContentLoaded', () => {
  carregarPastilhasFiltro();
    carregarFornecedoresFiltro();
});

async function carregarPastilhasFiltro() {
  try {
    const resposta = await fetch(`${API_URL}/pastilhas`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar pastilhas.');
    }

    const pastilhas = await resposta.json();

    const select = document.getElementById('filtroPastilha');

    if (!select) {
      return;
    }

    pastilhas.forEach((pastilha) => {
      const option = document.createElement('option');

      option.value = pastilha.id;
      option.textContent =
        `${pastilha.codigo} - ${pastilha.descricao}`;

      select.appendChild(option);
    });

  } catch (erro) {
    console.error(
      'Erro ao carregar pastilhas para o relatório:',
      erro
    );
  }
}

async function carregarFornecedoresFiltro() {
  try {
    const resposta = await fetch(`${API_URL}/fornecedores`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar fornecedores.');
    }

    const fornecedores = await resposta.json();

    const select = document.getElementById('filtroFornecedor');

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
    console.error(
      'Erro ao carregar fornecedores para o relatório:',
      erro
    );
  }
}

document.getElementById('gerarRelatorio').addEventListener('click', async () => {
  const fornecedorId = document.getElementById('filtroFornecedor').value;
  const pastilhaId = document.getElementById('filtroPastilha').value;
  const tipo = document.getElementById('filtroTipo').value;
  const dataInicio = document.getElementById('dataInicio').value;
  const dataFim = document.getElementById('dataFim').value;

  const params = new URLSearchParams();

  if (fornecedorId) {
    params.set('fornecedorId', fornecedorId);
  }

  if (pastilhaId) {
    params.set('pastilhaId', pastilhaId);
  }

  if (tipo) {
    params.set('tipo', tipo);
  }

  if (dataInicio) {
    params.set('dataInicio', dataInicio);
  }

  if (dataFim) {
    params.set('dataFim', dataFim);
  }

  try {
    const query = params.toString();

    const resposta = await fetch(
      `${API_URL}/movimentacoes${query ? `?${query}` : ''}`
    );

    const dados = await resposta.json();

    dadosRelatorioAtual = dados;

    if (!resposta.ok) {
      throw new Error(dados.error || 'Erro ao gerar relatório.');
    }

    const tabela = document.getElementById('relatorioTable');
    const resumo = document.getElementById('resumoRelatorio');

    tabela.innerHTML = '';

    if (dados.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="6" class="p-6 text-center text-sm text-slate-500">
            Nenhuma movimentação encontrada para os filtros informados.
          </td>
        </tr>
      `;

      resumo.textContent = 'Nenhuma movimentação encontrada.';
      return;
    }

    let totalEntradas = 0;
    let totalSaidas = 0;

    dados.forEach((movimentacao) => {
      const linha = document.createElement('tr');
      const data = new Date(movimentacao.data);

      if (movimentacao.tipo === 'ENTRADA') {
        totalEntradas += movimentacao.quantidade;
      } else {
        totalSaidas += movimentacao.quantidade;
      }

      
      linha.innerHTML = `
          <td class="p-3">${movimentacao.id}</td>

          <td class="p-3">
              ${data.toLocaleString('pt-BR')}
            </td>

            <td class="p-3">
                ${movimentacao.pastilha.codigo} -
                ${movimentacao.pastilha.descricao}
            </td>

            <td class="p-3">
                ${movimentacao.pastilha.fornecedor?.nome || 'Não informado'}
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

    resumo.textContent =
      `${dados.length} movimentação(ões) encontrada(s) | ` +
      `Entradas: ${totalEntradas} | ` +
      `Saídas: ${totalSaidas}`;

  } catch (erro) {
    console.error('Erro ao gerar relatório:', erro);
    alert(erro.message);
  }
});

document.getElementById('exportarExcel').addEventListener('click', () => {
  if (dadosRelatorioAtual.length === 0) {
    alert('Gere um relatório antes de exportar para Excel.');
    return;
  }

  const dadosExcel = dadosRelatorioAtual.map((movimentacao) => {
    const data = new Date(movimentacao.data);

    return {
      ID: movimentacao.id,
      Data: data.toLocaleString('pt-BR'),
      Código: movimentacao.pastilha.codigo,
      Pastilha: movimentacao.pastilha.descricao,
      Fornecedor:
        movimentacao.pastilha.fornecedor?.nome || 'Não informado',
      Tipo: movimentacao.tipo,
      Quantidade: movimentacao.quantidade,
    };
  });

  const planilha = XLSX.utils.json_to_sheet(dadosExcel);

  const livro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    livro,
    planilha,
    'Movimentações'
  );

  XLSX.writeFile(
    livro,
    'relatorio-movimentacoes-dda.xlsx'
  );
});

document.getElementById('exportarPdf').addEventListener('click', () => {
  if (dadosRelatorioAtual.length === 0) {
    alert('Gere um relatório antes de exportar para PDF.');
    return;
  }

  const { jsPDF } = window.jspdf;

  const documento = new jsPDF('landscape');

  const dataGeracao = new Date().toLocaleString('pt-BR');

  let totalEntradas = 0;
  let totalSaidas = 0;

  dadosRelatorioAtual.forEach((movimentacao) => {
    if (movimentacao.tipo === 'ENTRADA') {
      totalEntradas += movimentacao.quantidade;
    } else {
      totalSaidas += movimentacao.quantidade;
    }
  });

  documento.setFontSize(18);
  documento.text(
    'DDA Metalúrgica',
    14,
    15
  );

  documento.setFontSize(13);
  documento.text(
    'Relatório de Movimentações',
    14,
    23
  );

  documento.setFontSize(9);
  documento.text(
    `Gerado em: ${dataGeracao}`,
    14,
    30
  );

  documento.text(
    `Total de movimentações: ${dadosRelatorioAtual.length}`,
    14,
    37
  );

  documento.text(
    `Entradas: ${totalEntradas}`,
    100,
    37
  );

  documento.text(
    `Saídas: ${totalSaidas}`,
    160,
    37
  );

  const dadosTabela = dadosRelatorioAtual.map((movimentacao) => {
    const data = new Date(movimentacao.data);

    return [
      movimentacao.id,
      data.toLocaleString('pt-BR'),
      movimentacao.pastilha.codigo,
      movimentacao.pastilha.descricao,
      movimentacao.pastilha.fornecedor?.nome || 'Não informado',
      movimentacao.tipo,
      movimentacao.quantidade,
    ];
  });

  documento.autoTable({
    startY: 45,
    head: [[
      'ID',
      'Data',
      'Código',
      'Pastilha',
      'Fornecedor',
      'Tipo',
      'Quantidade',
    ]],
    body: dadosTabela,
    styles: {
      fontSize: 8,
    },
    headStyles: {
      fontSize: 8,
    },
  });

  documento.save(
    'relatorio-movimentacoes-dda.pdf'
  );
});