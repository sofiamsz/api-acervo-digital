// Importa a classe Livro do model — é daqui que vêm os métodos de acesso ao banco de dados
import Livro from "../model/Livro.js";
// Importa os tipos Request e Response do Express — representam a requisição e a resposta HTTP
import { type Request, type Response } from "express";
// Importa o tipo LivroDTO para tipar os dados recebidos do front-end
import type LivroDTO from "../dto/LivroDTO.js";

// Define a classe LivroController que HERDA da classe Livro
// A herança permite acessar os métodos estáticos do model diretamente
// O controller é responsável por receber as requisições HTTP e devolver as respostas — nunca acessa o banco diretamente
class LivroController extends Livro {

    static async todos(req: Request, res: Response) {
        try {
            const listaDeLivros = await Livro.listarLivros();

            if (listaDeLivros.length === 0) {
                res.status(204).send();
                return;
            }

            res.status(200).json(listaDeLivros);

        } catch (error) {
            console.error(`[LivroController] Erro ao listar livros:`, error);
            res.status(500).json({ mensagem: "Erro interno ao recuperar a lista de livros." });
        }
    }

    // Método que busca um único livro com base no ID informado na URL (ex: GET /livro/3)
    static async livro(req: Request, res: Response) {
        try {
            const idLivro = parseInt(req.params.id as string);

            if (isNaN(idLivro) || idLivro <= 0) {
                res.status(400).json({ mensagem: "ID inválido. Informe um número inteiro." });
                return;
            }

            const livro = await Livro.listarLivro(idLivro);
            res.status(200).json(livro);

        } catch (error: any) {
            console.error(`[LivroController] Erro ao buscar livro (id: ${req.params.id}):`, error);

            if (error.message?.includes("não encontrado")) {
                res.status(404).json({ mensagem: error.message });
                return;
            }

            res.status(500).json({ mensagem: "Erro interno ao recuperar o livro." });
        }
    }

    // Método que recebe os dados do front-end e cria um novo livro no banco de dados
    static async cadastrar(req: Request, res: Response) {
        try {
            const dadosRecebidos: LivroDTO = req.body;

            if (!dadosRecebidos.titulo || !dadosRecebidos.autor || !dadosRecebidos.editora || !dadosRecebidos.isbn) {
                res.status(400).json({ mensagem: "Campos obrigatórios ausentes: titulo, autor, editora e isbn." });
                return;
            }

            const novoLivro = new Livro(
                dadosRecebidos.titulo,
                dadosRecebidos.autor,
                dadosRecebidos.editora,
                (dadosRecebidos.ano_publicacao ?? 0).toString(),
                dadosRecebidos.isbn,
                dadosRecebidos.quant_total,
                dadosRecebidos.quant_disponivel,
                dadosRecebidos.quant_aquisicao,
                dadosRecebidos.valor_aquisicao ?? 0
            );

            const result = await Livro.cadastrarLivro(novoLivro);

            if (result) {
                res.status(201).json({ mensagem: "Livro cadastrado com sucesso." });
            } else {
                res.status(400).json({ mensagem: "Não foi possível cadastrar o livro." });
            }

        } catch (error) {
            console.error(`[LivroController] Erro ao cadastrar livro:`, error);
            res.status(500).json({ mensagem: "Erro interno ao cadastrar o livro." });
        }
    }

    // Método que recebe um ID pela URL e realiza a remoção lógica do livro no banco
    // "Promise<Response>" indica que este método sempre retorna uma resposta HTTP ao final
    static async remover(req: Request, res: Response) {
        try {
            const idLivro = parseInt(req.params.id as string);

            if (isNaN(idLivro) || idLivro <= 0) {
                res.status(400).json({ mensagem: "ID inválido. Informe um número inteiro." });
                return;
            }

            const result = await Livro.removerLivro(idLivro);

            if (result) {
                res.status(200).json({ mensagem: "Livro removido com sucesso." });
            } else {
                res.status(404).json({ mensagem: "Livro não encontrado ou já está inativo." });
            }

        } catch (error: any) {
            console.error(`[LivroController] Erro ao remover livro (id: ${req.params.id}):`, error);

            if (error.message?.includes("não encontrado")) {
                res.status(404).json({ mensagem: error.message });
                return;
            }

            res.status(500).json({ mensagem: "Erro interno ao remover o livro." });
        }
    }

    // Método que recebe os novos dados do front-end e atualiza o cadastro do livro no banco
    static async atualizar(req: Request, res: Response) {
        try {
            const idLivro = parseInt(req.params.id as string);

            if (isNaN(idLivro) || idLivro <= 0) {
                res.status(400).json({ mensagem: "ID inválido. Informe um número inteiro." });
                return;
            }

            const dadosRecebidos: LivroDTO = req.body;

            if (!dadosRecebidos.titulo || !dadosRecebidos.autor || !dadosRecebidos.editora || !dadosRecebidos.isbn) {
                res.status(400).json({ mensagem: "Campos obrigatórios ausentes: titulo, autor, editora e isbn." });
                return;
            }

            const livro = new Livro(
                dadosRecebidos.titulo,
                dadosRecebidos.autor,
                dadosRecebidos.editora,
                (dadosRecebidos.ano_publicacao ?? 0).toString(),
                dadosRecebidos.isbn,
                dadosRecebidos.quant_total,
                dadosRecebidos.quant_disponivel,
                dadosRecebidos.quant_aquisicao,
                dadosRecebidos.valor_aquisicao ?? 0
            );

            livro.setIdLivro(idLivro);

            const result = await Livro.atualizarLivro(livro);

            if (result) {
                res.status(200).json({ mensagem: "Cadastro atualizado com sucesso." });
            } else {
                res.status(404).json({ mensagem: "Livro não encontrado ou já está inativo." });
            }

        } catch (error: any) {
            console.error(`[LivroController] Erro ao atualizar livro (id: ${req.params.id}):`, error);

            if (error.message?.includes("não encontrado")) {
                res.status(404).json({ mensagem: error.message });
                return;
            }

            res.status(500).json({ mensagem: "Erro interno ao atualizar o livro." });
        }
    }
}

// Exporta a classe LivroController para que possa ser importada e usada nas rotas da aplicação
export default LivroController;