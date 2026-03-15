// Importa a classe DatabaseModel — usada para testar a conexão com o banco antes de subir o servidor
import { DatabaseModel } from "./model/DatabaseModel.js";
// Importa o servidor Express configurado no server.ts — é ele quem será iniciado após a conexão com o banco
import { server } from "./server.js";
// Importa a biblioteca dotenv — responsável por carregar as variáveis de ambiente do arquivo .env
// Variáveis de ambiente guardam informações sensíveis (senhas, portas, hosts) fora do código-fonte
import dotenv from "dotenv";

// Carrega as variáveis definidas no arquivo .env para dentro do process.env
// Deve ser chamado o mais cedo possível, antes de qualquer leitura de process.env
// Sem esta linha, process.env.PORT e process.env.HOST retornariam undefined
dotenv.config();

/**
 * Configura a porta do servidor web
 */
// Lê a variável PORT do arquivo .env e converte de string para número inteiro
// Ex: se .env tiver PORT=3333, a variável port receberá o número 3333
const port: number = parseInt(process.env.PORT ?? "");
if (isNaN(port)) {
    console.error("Variável de ambiente PORT não definida ou inválida.");
    process.exit(1);
}

// Lê a variável HOST do arquivo .env
// O operador "??" garante que, se HOST não estiver definido no .env, usa string vazia como padrão
const host: string = process.env.HOST ?? "";

const ok = await new DatabaseModel().testeConexao();

if (ok) {
    server.listen(port, () => {
        console.info(`Servidor executando no endereço ${host}:${port}`);
    });
} else {
    console.error("Não foi possível conectar com o banco de dados.");
    process.exit(1);
}