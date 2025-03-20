function consultarCNPJ() {
    const cnpjInput = document.getElementById('cnpj').value.trim();
    const resultadoDiv = document.getElementById('resultado');
    
    // Remover caracteres especiais (ponto, barra e hífen)
    const cnpj = cnpjInput.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14 || !/^[0-9]{14}$/.test(cnpj)) {
        resultadoDiv.innerHTML = "<p style='color: red;'>Insira um CNPJ válido, com 14 dígitos numéricos.</p>";
        return;
    }
    
    // Função para fazer a requisição com lógica de retry
    // URL usando o proxy para contornar CORS e limitar requisições
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const apiUrl = `https://www.receitaws.com.br/v1/cnpj/${cnpj}`;

    // Requisição para a API via proxy
    fetch(proxyUrl + encodeURIComponent(apiUrl))
        .then(response => {
            if (!response.ok) {
                switch (response.status) {
                    case 400:
                        throw new Error('CNPJ inválido. Verifique e tente novamente.');
                    case 404:
                        throw new Error('CNPJ não encontrado.');
                    case 429:
                        throw new Error('Limite de requisições excedido. Tente novamente mais tarde.');
                    case 500:
                    case 504:
                        throw new Error('Erro no servidor da API. Tente novamente mais tarde.');
                    default:
                        throw new Error(`Erro inesperado: ${response.status}`);
                }
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
                logErro('Erro na requisição', error.message);
                resultadoDiv.innerHTML = `<p style="color: red;">Erro ao consultar CNPJ: ${error.message}</p>`;
            });
    }

    // Função de log de erros (exibe no console e pode ser expandida para enviar logs)
    function logErro(tipo, mensagem) {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] [${tipo}] ${mensagem}`);
        
    }

