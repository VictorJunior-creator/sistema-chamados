import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function ChamadoForm({ aoCriar }) {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    async function criarChamado(event) {
        event.preventDefault();

        setErro("");
        setSucesso("");

        if (!titulo.trim()) {
            setErro("Digite um título para o chamado.");
            return;
        }

        if (!descricao.trim()) {
            setErro("Digite uma descrição para o chamado.");
            return;
        }

        try {
            const resposta = await fetch(
                `${API_URL}/chamados`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        titulo: titulo.trim(),
                        descricao: descricao.trim(),
                        status: "aberto"
                    })
                }
            );

            if (!resposta.ok) {
                throw new Error("Erro ao criar chamado");
            }

            const novoChamado =
                await resposta.json();

            aoCriar(novoChamado);

            setTitulo("");
            setDescricao("");
            setSucesso(
                "Chamado criado com sucesso!"
            );
        } catch {
            setErro(
                "Não foi possível criar o chamado."
            );
        }
    }

    return (
        <form onSubmit={criarChamado}>
            <h2>Novo chamado</h2>

            {erro && (
                <p className="mensagem erro">
                    {erro}
                </p>
            )}

            {sucesso && (
                <p className="mensagem sucesso">
                    {sucesso}
                </p>
            )}

            <input
                type="text"
                placeholder="Título do problema"
                value={titulo}
                onChange={(event) =>
                    setTitulo(event.target.value)
                }
            />

            <textarea
                placeholder="Descreva o problema..."
                value={descricao}
                onChange={(event) =>
                    setDescricao(event.target.value)
                }
            />

            <button type="submit">
                Criar chamado
            </button>
        </form>
    );
}

export default ChamadoForm;