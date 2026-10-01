import { useEffect, useState } from "react";
import ChamadoForm from "./components/ChamadoForm";
import ChamadoCard from "./components/ChamadoCard";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
    const [chamados, setChamados] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("todos");

    useEffect(() => {
        async function buscarChamados() {
            try {
                setCarregando(true);
                setErro("");

                const resposta = await fetch(
                    `${API_URL}/chamados`
                );

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar chamados");
                }

                const dados = await resposta.json();

                setChamados(dados);
            } catch {
                setErro(
                    "Não foi possível carregar os chamados."
                );
            } finally {
                setCarregando(false);
            }
        }

        buscarChamados();
    }, []);

    function adicionarChamado(novoChamado) {
        setChamados((chamadosAtuais) => [
            ...chamadosAtuais,
            novoChamado
        ]);
    }

    async function alterarStatus(id, novoStatus) {
        try {
            const chamado = chamados.find(
                (chamado) => chamado.id === id
            );

            const resposta = await fetch(
                `${API_URL}/chamados/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        titulo: chamado.titulo,
                        descricao: chamado.descricao,
                        status: novoStatus
                    })
                }
            );

            if (!resposta.ok) {
                throw new Error("Erro ao atualizar status");
            }

            const chamadoAtualizado =
                await resposta.json();

            setChamados((chamadosAtuais) =>
                chamadosAtuais.map((chamado) =>
                    chamado.id === id
                        ? chamadoAtualizado
                        : chamado
                )
            );
        } catch {
            setErro(
                "Não foi possível atualizar o status."
            );
        }
    }

    async function editarChamado(id, dados) {
        try {
            const resposta = await fetch(
                `${API_URL}/chamados/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dados)
                }
            );

            if (!resposta.ok) {
                throw new Error("Erro ao editar chamado");
            }

            const chamadoAtualizado =
                await resposta.json();

            setChamados((chamadosAtuais) =>
                chamadosAtuais.map((chamado) =>
                    chamado.id === id
                        ? chamadoAtualizado
                        : chamado
                )
            );
        } catch {
            setErro(
                "Não foi possível editar o chamado."
            );
        }
    }

    async function excluirChamado(id) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este chamado?"
        );

        if (!confirmar) {
            return;
        }

        try {
            const resposta = await fetch(
                `${API_URL}/chamados/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!resposta.ok) {
                throw new Error("Erro ao excluir chamado");
            }

            setChamados((chamadosAtuais) =>
                chamadosAtuais.filter(
                    (chamado) => chamado.id !== id
                )
            );
        } catch {
            setErro(
                "Não foi possível excluir o chamado."
            );
        }
    }

    const chamadosFiltrados = chamados.filter((chamado) => {
        const textoBusca = busca.toLowerCase();

        const correspondeBusca =
            chamado.titulo
                .toLowerCase()
                .includes(textoBusca) ||
            chamado.descricao
                .toLowerCase()
                .includes(textoBusca);

        const correspondeStatus =
            filtroStatus === "todos" ||
            chamado.status === filtroStatus;

        return correspondeBusca && correspondeStatus;
    });

    return (
        <div className="app">
            <header className="header">
                <div>
                    <h1>Sistema de Chamados</h1>
                    <p>
                        Gerencie os chamados da sua equipe
                    </p>
                </div>
            </header>

            <main className="container">

                {carregando && (
                    <p className="mensagem">
                        Carregando chamados...
                    </p>
                )}

                {erro && (
                    <p className="mensagem erro">
                        {erro}
                    </p>
                )}

                <section className="dashboard">

                    <div className="stat-card">
                        <span>Total</span>
                        <strong>
                            {chamados.length}
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>Abertos</span>
                        <strong>
                            {
                                chamados.filter(
                                    (chamado) =>
                                        chamado.status ===
                                        "aberto"
                                ).length
                            }
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>Em andamento</span>
                        <strong>
                            {
                                chamados.filter(
                                    (chamado) =>
                                        chamado.status ===
                                        "em andamento"
                                ).length
                            }
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>Resolvidos</span>
                        <strong>
                            {
                                chamados.filter(
                                    (chamado) =>
                                        chamado.status ===
                                        "resolvido"
                                ).length
                            }
                        </strong>
                    </div>

                </section>

                <section className="form-section">
                    <ChamadoForm
                        aoCriar={adicionarChamado}
                    />
                </section>

                <section className="chamados-section">

                    <div className="chamados-header">
                        <h2>Chamados</h2>

                        <div className="filtros">

                            <input
                                type="text"
                                placeholder="Buscar chamado..."
                                value={busca}
                                onChange={(event) =>
                                    setBusca(event.target.value)
                                }
                            />

                            <select
                                value={filtroStatus}
                                onChange={(event) =>
                                    setFiltroStatus(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="todos">
                                    Todos
                                </option>

                                <option value="aberto">
                                    Abertos
                                </option>

                                <option value="em andamento">
                                    Em andamento
                                </option>

                                <option value="resolvido">
                                    Resolvidos
                                </option>
                            </select>

                        </div>
                    </div>

                    {chamadosFiltrados.length === 0 ? (
                        <p className="mensagem">
                            Nenhum chamado encontrado.
                        </p>
                    ) : (
                        <div className="chamados-grid">
                            {chamadosFiltrados.map(
                                (chamado) => (
                                    <ChamadoCard
                                        key={chamado.id}
                                        chamado={chamado}
                                        aoAlterarStatus={
                                            alterarStatus
                                        }
                                        aoExcluir={
                                            excluirChamado
                                        }
                                        aoEditar={
                                            editarChamado
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}

                </section>

            </main>
        </div>
    );
}

export default App;