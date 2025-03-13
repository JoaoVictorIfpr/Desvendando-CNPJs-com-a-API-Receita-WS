function consultarCNPJ() {
    const cnpjInput = document.getElementById('cnpj').value.trim();
    const resultadoDiv = document.getElementById('resultado');
    
    // Remover caracteres especiais (ponto, barra e hífen)
    const cnpj = cnpjInput.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14 || !/^[0-9]{14}$/.test(cnpj)) {
        resultadoDiv.innerHTML = "<p style='color: red;'>Insira um CNPJ válido, com 14 dígitos numéricos.</p>";
        return;
    }

    // Construir a URL da API ReceitaWS

    const url = `https://cors-anywhere.herokuapp.com/https://receitaws.com.br/v1/cnpj/${cnpj}`;


    // Fazer a requisição usando fetch
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.erro) {
                resultadoDiv.innerHTML = '<p style="color: red;">CNPJ não encontrado.</p>';
            } else {
                resultadoDiv.innerHTML = `
                <p><strong>Status:</strong> ${data.status || 'Não informado'}</p>
                <p><strong>Última atualização:</strong> ${data.ultima_atualizacao || 'Não informado'}</p>
                <p><strong>CNPJ:</strong> ${data.cnpj || 'Não informado'}</p>
                <p><strong>Porte:</strong> ${data.porte || 'Não informado'}</p>
                <p><strong>Nome:</strong> ${data.nome || 'Não informado'}</p>
                <p><strong>Estado:</strong> ${data.uf || 'Não informado'}</p>
                <p><strong>Cidade:</strong> ${data.municipio || 'Não informado'}</p>
                <p><strong>CEP:</strong> ${data.cep || 'Não informado'}</p>
                <p><strong>Logradouro:</strong> ${data.logradouro || 'Não informado'}</p>
                <p><strong>Bairro:</strong> ${data.bairro || 'Não informado'}</p>
                <p><strong>Atividade principal:</strong> ${data.atividade_principal?.[0]?.text || 'Não informado'}</p>
            `;
        }
    })
        .catch(error => {
            resultadoDiv.innerHTML = `<p style="color: red;">Erro ao consultar cnpj: ${error.message}</p>`;
        });
}