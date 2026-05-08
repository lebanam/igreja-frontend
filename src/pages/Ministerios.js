import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UsersRound } from "lucide-react";
import "./Celulas.css";

const API_URL = "https://igreja-backend-eyfg.onrender.com";

function Ministerios() {
    const navigate = useNavigate();

    const [ministerios, setMinisterios] = useState([]);
    const [modoFormulario, setModoFormulario] = useState(false);
    const [ministerioSelecionado, setMinisterioSelecionado] = useState(null);

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");

    useEffect(() => {
        carregarMinisterios();
    }, []);

    const carregarMinisterios = async () => {
        try {
            const response = await fetch(`${API_URL}/ministerios`);

            if (!response.ok) {
                throw new Error("Erro ao carregar ministérios");
            }

            const data = await response.json();
            setMinisterios(Array.isArray(data) ? data : []);
        } catch (error) {
            alert(error.message);
            setMinisterios([]);
        }
    };

    const limparFormulario = () => {
        setNome("");
        setDescricao("");
        setMinisterioSelecionado(null);
        setModoFormulario(false);
    };

    const salvarMinisterio = async () => {
        if (!nome) {
            alert("Preencha o nome do ministério");
            return;
        }

        const dados = {
            nome,
            descricao
        };

        try {
            const url = ministerioSelecionado
                ? `${API_URL}/ministerios/${ministerioSelecionado.id}`
                : `${API_URL}/ministerios`;

            const response = await fetch(url, {
                method: ministerioSelecionado ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "Erro ao salvar ministério");
            }

            alert("Ministério salvo com sucesso!");
            limparFormulario();
            carregarMinisterios();
        } catch (error) {
            alert(error.message);
        }
    };

    const editarMinisterio = (ministerio) => {
        setMinisterioSelecionado(ministerio);
        setNome(ministerio.nome || "");
        setDescricao(ministerio.descricao || "");
        setModoFormulario(true);
    };

    const excluirMinisterio = async (id) => {
        const confirmar = window.confirm("Deseja excluir este ministério?");
        if (!confirmar) return;

        try {
            const response = await fetch(`${API_URL}/ministerios/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Erro ao excluir ministério");
            }

            alert("Ministério excluído com sucesso!");
            setMinisterioSelecionado(null);
            carregarMinisterios();
        } catch (error) {
            alert(error.message);
        }
    };

    const abrirEscalas = (ministerio) => {
        navigate(`/ministerios/${ministerio.id}/escalas`, {
            state: { ministerio }
        });
    };

    return (
        <div className="page">
            <h1 className="page-title">Ministérios</h1>

            <button
                className="primary-button"
                onClick={() => {
                    setMinisterioSelecionado(null);
                    setModoFormulario(true);
                }}
            >
                Novo Ministério
            </button>

            {modoFormulario && (
                <div className="form-card">
                    <h2>
                        {ministerioSelecionado
                            ? "Editar Ministério"
                            : "Cadastrar Ministério"}
                    </h2>

                    <input
                        placeholder="Nome do ministério"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                    <textarea
                        placeholder="Descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />

                    <div className="button-row">
                        <button
                            className="primary-button"
                            onClick={salvarMinisterio}
                        >
                            Salvar
                        </button>

                        <button
                            className="secondary-button"
                            onClick={limparFormulario}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <div className="card-grid celulas-grid">
                {ministerios.map((ministerio) => (
                    <div
                        key={ministerio.id}
                        className="menu-card"
                        onClick={() => {
                            setMinisterioSelecionado(ministerio);
                            setModoFormulario(false);
                        }}
                    >
                        <div className="menu-icon">
                            <UsersRound size={28} />
                        </div>

                        <strong>{ministerio.nome}</strong>

                        <p>{ministerio.descricao || "Sem descrição"}</p>
                    </div>
                ))}
            </div>

            {ministerioSelecionado && !modoFormulario && (
                <div className="form-card">
                    <h2>{ministerioSelecionado.nome}</h2>

                    <p>
                        <strong>Descrição:</strong>{" "}
                        {ministerioSelecionado.descricao || "Não informado"}
                    </p>

                    <div className="button-row">
                        <button
                            className="primary-button"
                            onClick={() => abrirEscalas(ministerioSelecionado)}
                        >
                            Ver Escalas
                        </button>

                        <button
                            className="secondary-button"
                            onClick={() => editarMinisterio(ministerioSelecionado)}
                        >
                            Editar
                        </button>

                        <button
                            className="danger-button"
                            onClick={() =>
                                excluirMinisterio(ministerioSelecionado.id)
                            }
                        >
                            Excluir
                        </button>

                        <button
                            className="secondary-button"
                            onClick={() => setMinisterioSelecionado(null)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Ministerios;