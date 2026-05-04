import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import "./Celulas.css";

const API_URL = "https://igreja-backend-eyfg.onrender.com";

function Celulas() {
    const navigate = useNavigate();

    const [celulas, setCelulas] = useState([]);
    const [membros, setMembros] = useState([]);
    const [modoFormulario, setModoFormulario] = useState(false);
    const [celulaSelecionada, setCelulaSelecionada] = useState(null);

    const [nome, setNome] = useState("");
    const [tema, setTema] = useState("");
    const [quando, setQuando] = useState("");
    const [onde, setOnde] = useState("");
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

    const recarregarDados = () => {
        carregarMembros();
        carregarCelulas();
    };

    const limparFormulario = () => {
        setNome("");
        setTema("");
        setQuando("");
        setOnde("");
        setLider("");
        setCoLider("");
        setMembrosSelecionados([]);
        setCelulaSelecionada(null);
        setModoFormulario(false);
    };

    const atualizarCelulaDoMembro = async (membroId, celulaId) => {
        const response = await fetch(`${API_URL}/membros/${membroId}/celula`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ celulaId })
        });

        const text = await response.text();

        if (!response.ok) {
            throw new Error(text || "Erro ao atualizar célula do membro");
        }
    };

    const salvarCelula = async () => {
        if (!nome || !tema || !quando || !onde || !lider) {
            alert("Preencha nome, tema, quando, onde e líder");
            return;
        }

        const dados = {
            nome,
            tema,
            quando,
            onde,
            lider,
            coLider
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

            const celulaSalva = JSON.parse(text);
            const celulaId = celulaSalva.id;

            const membrosMovidos = membros.filter(
                (m) =>
                    membrosSelecionados.includes(String(m.id)) &&
                    m.celula &&
                    m.celula.id !== celulaId
            );

            if (membrosMovidos.length > 0) {
                const nomes = membrosMovidos
                    .map((m) => `${m.nome} (${m.celula.nome})`)
                    .join(", ");

                const confirmar = window.confirm(
                    `Os seguintes membros já estão em outra célula e serão movidos para esta célula: ${nomes}. Deseja continuar?`
                );

                if (!confirmar) return;
            }

            const membrosAtuaisDaCelula = membros.filter(
                (m) => m.celula?.id === celulaId
            );

            const membrosParaAdicionar = membros.filter((m) =>
                membrosSelecionados.includes(String(m.id))
            );

            const membrosParaRemover = membrosAtuaisDaCelula.filter(
                (m) => !membrosSelecionados.includes(String(m.id))
            );

            await Promise.all([
                ...membrosParaAdicionar.map((m) =>
                    atualizarCelulaDoMembro(m.id, celulaId)
                ),
                ...membrosParaRemover.map((m) =>
                    atualizarCelulaDoMembro(m.id, null)
                )
            ]);

            alert("Célula salva com sucesso!");
            limparFormulario();
            recarregarDados();
        } catch (error) {
            alert(error.message);
        }
    };

    const editarCelula = (celula) => {
        setCelulaSelecionada(celula);
        setNome(celula.nome || "");
        setTema(celula.tema || "");
        setQuando(celula.quando || "");
        setOnde(celula.onde || "");
        setLider(celula.lider || "");
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
                const text = await response.text();
                throw new Error(text || "Erro ao excluir célula");
            }

            alert("Célula excluída com sucesso!");
            setCelulaSelecionada(null);
            recarregarDados();
        } catch (error) {
            alert(error.message);
        }
    };

    const selecionarMembro = (id) => {
        setMembrosSelecionados((selecionados) =>
            selecionados.includes(id)
                ? selecionados.filter((m) => m !== id)
                : [...selecionados, id]
        );
    };

    return (
        <div className="page">
            <button className="back-button" onClick={() => navigate("/home")}>
                Início
            </button>

            <h1 className="page-title">Células</h1>

            <button className="primary-button" onClick={() => setModoFormulario(true)}>
                Nova Célula
            </button>

            {modoFormulario && (
                <div className="form-card">
                    <h2>{celulaSelecionada ? "Editar Célula" : "Cadastrar Célula"}</h2>

                    <input placeholder="Nome da célula" value={nome} onChange={(e) => setNome(e.target.value)} />
                    <input placeholder="Tema" value={tema} onChange={(e) => setTema(e.target.value)} />
                    <input placeholder="Quando" value={quando} onChange={(e) => setQuando(e.target.value)} />
                    <input placeholder="Onde" value={onde} onChange={(e) => setOnde(e.target.value)} />
                    <input placeholder="Líder" value={lider} onChange={(e) => setLider(e.target.value)} />
                    <input placeholder="Co-líder" value={coLider} onChange={(e) => setCoLider(e.target.value)} />

                    <h3>Membros</h3>

                    {membros.length === 0 ? (
                        <p>Nenhum membro cadastrado ainda.</p>
                    ) : (
                        <div className="membros-checkbox-list">
                            {membros.map((m) => {
                                const estaEmOutraCelula =
                                    m.celula &&
                                    celulaSelecionada &&
                                    m.celula.id !== celulaSelecionada.id;

                                return (
                                    <label key={m.id} className="membro-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={membrosSelecionados.includes(String(m.id))}
                                            onChange={() => selecionarMembro(String(m.id))}
                                        />
                                        <span>
                                            {m.nome}
                                            {estaEmOutraCelula && (
                                                <small className="membro-aviso">
                                                    {" "}— será movido de {m.celula.nome}
                                                </small>
                                            )}
                                        </span>
                                    </label>
                                );
                            })}
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
                        <div className="menu-icon">
                            <Home size={28} />
                        </div>
                        <strong>{celula.nome}</strong>
                        <p>{celula.tema}</p>
                        <small>{celula.membros?.length || 0} membro(s)</small>
                    </div>
                ))}
            </div>

            {celulaSelecionada && !modoFormulario && (
                <div className="form-card">
                    <h2>{celulaSelecionada.nome}</h2>

                    <p><strong>Tema:</strong> {celulaSelecionada.tema || "Não informado"}</p>
                    <p><strong>Quando:</strong> {celulaSelecionada.quando || "Não informado"}</p>
                    <p><strong>Onde:</strong> {celulaSelecionada.onde || "Não informado"}</p>
                    <p><strong>Líder:</strong> {celulaSelecionada.lider || "Não informado"}</p>
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