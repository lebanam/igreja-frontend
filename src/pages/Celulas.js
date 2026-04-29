import { useEffect, useState } from "react";
import "./Celulas.css";

const API_URL = "https://igreja-backend-eyfg.onrender.com";

function Celulas() {
    const [celulas, setCelulas] = useState([]);
    const [membros, setMembros] = useState([]);
    const [modoFormulario, setModoFormulario] = useState(false);
    const [celulaSelecionada, setCelulaSelecionada] = useState(null);

    const [nome, setNome] = useState("");
    const [faixaEtaria, setFaixaEtaria] = useState("");
    const [lider, setLider] = useState("");
    const [coLider, setCoLider] = useState("");
    const [membrosSelecionados, setMembrosSelecionados] = useState([]);

    useEffect(() => {
        carregarMembros();
        carregarCelulas();
    }, []);

    const carregarMembros = async () => {
        try {
            const response = await fetch(`${API_URL}/membros`);

            if (!response.ok) {
                throw new Error("Erro ao carregar membros");
            }

            const data = await response.json();
            setMembros(Array.isArray(data) ? data : []);
        } catch (error) {
            alert(error.message);
            setMembros([]);
        }
    };

    const carregarCelulas = async () => {
        try {
            const response = await fetch(`${API_URL}/celulas`);

            if (!response.ok) {
                throw new Error("Erro ao carregar células");
            }

            const data = await response.json();
            setCelulas(Array.isArray(data) ? data : []);
        } catch (error) {
            alert(error.message);
            setCelulas([]);
        }
    };

    const limparFormulario = () => {
        setNome("");
        setFaixaEtaria("");
        setLider("");
        setCoLider("");
        setMembrosSelecionados([]);
        setCelulaSelecionada(null);
        setModoFormulario(false);
    };

    const salvarCelula = async () => {
        if (!nome || !faixaEtaria || !lider) {
            alert("Preencha nome, faixa etária e líder");
            return;
        }

        const dados = {
            nome,
            faixaEtaria,
            lider,
            coLider,
            membrosIds: membrosSelecionados.map((id) => Number(id))
        };

        try {
            const url = celulaSelecionada
                ? `${API_URL}/celulas/${celulaSelecionada.id}`
                : `${API_URL}/celulas`;

            const response = await fetch(url, {
                method: celulaSelecionada ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "Erro ao salvar célula");
            }

            alert("Célula salva com sucesso!");
            limparFormulario();
            carregarCelulas();

        } catch (error) {
            alert(error.message);
        }
    };

    const editarCelula = (celula) => {
        setCelulaSelecionada(celula);
        setNome(celula.nome);
        setFaixaEtaria(celula.faixaEtaria);
        setLider(celula.lider);
        setCoLider(celula.coLider || "");
        setMembrosSelecionados(
            Array.isArray(celula.membros)
                ? celula.membros.map((m) => String(m.id))
                : []
        );
        setModoFormulario(true);
    };

    const excluirCelula = async (id) => {
        const confirmar = window.confirm("Deseja excluir esta célula?");
        if (!confirmar) return;

        try {
            const response = await fetch(`${API_URL}/celulas/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir célula");
            }

            alert("Célula excluída com sucesso!");
            setCelulaSelecionada(null);
            carregarCelulas();

        } catch (error) {
            alert(error.message);
        }
    };

    const selecionarMembro = (id) => {
        if (membrosSelecionados.includes(id)) {
            setMembrosSelecionados(membrosSelecionados.filter((m) => m !== id));
        } else {
            setMembrosSelecionados([...membrosSelecionados, id]);
        }
    };

    return (
        <div className="page">
            <h1 className="page-title">Células</h1>

            <button className="primary-button" onClick={() => setModoFormulario(true)}>
                Nova Célula
            </button>

            {modoFormulario && (
                <div className="form-card">
                    <h2>{celulaSelecionada ? "Editar Célula" : "Cadastrar Célula"}</h2>

                    <input
                        placeholder="Nome da célula"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                    <input
                        placeholder="Faixa etária"
                        value={faixaEtaria}
                        onChange={(e) => setFaixaEtaria(e.target.value)}
                    />

                    <input
                        placeholder="Líder"
                        value={lider}
                        onChange={(e) => setLider(e.target.value)}
                    />

                    <input
                        placeholder="Co-líder"
                        value={coLider}
                        onChange={(e) => setCoLider(e.target.value)}
                    />

                    <h3>Membros</h3>

                    {membros.length === 0 ? (
                        <p>Nenhum membro cadastrado ainda.</p>
                    ) : (
                        <div className="membros-checkbox-list">
                            {membros.map((m) => (
                                <label key={m.id} className="membro-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={membrosSelecionados.includes(String(m.id))}
                                        onChange={() => selecionarMembro(String(m.id))}
                                    />
                                    {m.nome}
                                </label>
                            ))}
                        </div>
                    )}

                    <div className="button-row">
                        <button className="primary-button" onClick={salvarCelula}>
                            Salvar
                        </button>

                        <button className="secondary-button" onClick={limparFormulario}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <div className="card-grid celulas-grid">
                {celulas.map((celula) => (
                    <div
                        key={celula.id}
                        className="menu-card"
                        onClick={() => setCelulaSelecionada(celula)}
                    >
                        <div className="menu-icon">🏠</div>
                        <strong>{celula.nome}</strong>
                        <p>{celula.faixaEtaria}</p>
                        <small>{celula.membros?.length || 0} membro(s)</small>
                    </div>
                ))}
            </div>

            {celulaSelecionada && !modoFormulario && (
                <div className="form-card">
                    <h2>{celulaSelecionada.nome}</h2>
                    <p><strong>Faixa etária:</strong> {celulaSelecionada.faixaEtaria}</p>
                    <p><strong>Líder:</strong> {celulaSelecionada.lider}</p>
                    <p><strong>Co-líder:</strong> {celulaSelecionada.coLider || "Não informado"}</p>

                    <h3>Membros</h3>

                    {!celulaSelecionada.membros || celulaSelecionada.membros.length === 0 ? (
                        <p>Nenhum membro vinculado.</p>
                    ) : (
                        <ul className="membros-lista">
                            {celulaSelecionada.membros.map((m) => (
                                <li key={m.id}>{m.nome}</li>
                            ))}
                        </ul>
                    )}

                    <div className="button-row">
                        <button className="secondary-button" onClick={() => editarCelula(celulaSelecionada)}>
                            Editar
                        </button>

                        <button className="danger-button" onClick={() => excluirCelula(celulaSelecionada.id)}>
                            Excluir
                        </button>

                        <button className="secondary-button" onClick={() => setCelulaSelecionada(null)}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Celulas;