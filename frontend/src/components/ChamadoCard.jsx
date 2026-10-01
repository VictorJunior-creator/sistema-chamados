import { useState } from "react";

function ChamadoCard({
    chamado,
    aoAlterarStatus,
    aoExcluir,
    aoEditar
}) {
    const [editando, setEditando] = useState(false);
    const [titulo, setTitulo] = useState(chamado.titulo);
    const [descricao, setDescricao] = useState(chamado.descricao);

    function salvarEdicao(event) {
        event.preventDefault();

        if (!titulo.trim() || !descricao.trim()) {
            return;
        }

        aoEditar(chamado.id, {
            titulo: titulo.trim(),
            descricao: descricao.trim(),
            status: chamado.status
        });

        setEditando(false);
    }

    if (editando) {
        return (
            <div className="chamado-card">
                <form onSubmit={salvarEdicao}>
                    <h3>Editar chamado #{chamado.id}</h3>

                    <input
                        type="text"
                        value={titulo}
                        onChange={(event) =>
                            setTitulo(event.target.value)
                        }
                        placeholder="Título"
                    />

                    <textarea
                        value={descricao}
                        onChange={(event) =>
                            setDescricao(event.target.value)
                        }
                        placeholder="Descrição"
                    />

                    <div className="acoes">
                        <button type="submit">
                            Salvar
                        </button>

                        <button
                            type="button"
                            onClick={() => setEditando(false)}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="chamado-card">
            <div className="chamado-topo">
                <span>#{chamado.id}</span>

                <span
                    className={`status ${chamado.status.replace(" ", "-")}`}
                >
                    {chamado.status}
                </span>
            </div>

            <h3>{chamado.titulo}</h3>

            <p>{chamado.descricao}</p>

            <div className="acoes">
                <button onClick={() => setEditando(true)}>
                    Editar
                </button>

                {chamado.status !== "em andamento" && (
                    <button
                        className="btn-andamento"
                        onClick={() =>
                            aoAlterarStatus(
                                chamado.id,
                                "em andamento"
                            )
                        }
                    >
                        Em andamento
                    </button>
                )}

                {chamado.status !== "resolvido" && (
                    <button
                        className="btn-resolver"
                        onClick={() =>
                            aoAlterarStatus(
                                chamado.id,
                                "resolvido"
                            )
                        }
                    >
                        Resolver
                    </button>
                )}

                <button
                    className="btn-excluir"
                    onClick={() => aoExcluir(chamado.id)}
                >
                    Excluir
                </button>
            </div>
        </div>
    );
}

export default ChamadoCard;