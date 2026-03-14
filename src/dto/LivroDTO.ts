export default interface LivroDTO {
    id_livro?: number,
    titulo: string,
    autor: string,
    editora: string,
    ano_publicacao: string,
    isbn: string,
    quant_total: number,
    quant_disponivel: number,
    quant_aquisicao: number,
    valor_aquisicao: number,
    status_livro_emprestado?: string;
    status_livro?: boolean
}