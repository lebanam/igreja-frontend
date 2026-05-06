import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import "./Celulas.css";

const API_URL = "https://igreja-backend-eyfg.onrender.com";

function Celulas() {
    const navigate = useNavigate();

    const [celulas, setCelulas] = useState([]);
    const [membros, setMembros] = useState([]);
    const [relatorios, setRelatorios] = useState([]);

    const [modoFormulario, setModoFormulario] = useState(false);
    const [modoRelatorio, setModoRelatorio] = useState(false);
    const [celulaSelecionada, setCelulaSelecionada] = useState(null);
    const [relatorioSelecionado, setRelatorioSelecionado] = useState(null);

    const [buscaMembro, setBuscaMembro] = useState("");

    const [nome, setNome] = useState("");
    const [tema, setTema] = useState("");
    const [quando, setQuando] = useState("");
    const [onde, setOnde] = useState("");
    const [lider, setLider] = useState("");
    const [coLider, setCoLider] = useState("");
    const [membrosSelecionados, setMembrosSelecionados] = useState([]);

    const [dataEncontro, setDataEncontro] = useState("");
    const [temaRelatorio, setTemaRelatorio] = useState("");
    const [visitantes, setVisitantes] = useState(0);
    const [observacoes, setObservacoes] = useState("");
    const [presencas, setPresencas] = useState([]);

    useEffect(() => {
        carregarMembros();
        carregarCelulas();
    }, []);

    useEffect(() => {
        if (celulaSelecionada?.id && !modoFormulario) {
            carregarRelatorios(celulaSelecionada.id);
        }
    }, [celulaSelecionada, modoFormulario]);

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

    const carregarRelatorios = async (celulaId) => {
        try {
            const response = await fetch(`${API_URL}/celulas/${celulaId}/relatorios`);

            if (!response.ok) {
                throw new Error("Erro ao carregar relatórios da célula");
            }

            const data = await response.json();
            setRelatorios(Array.isArray(data) ? data : []);
        } catch (error) {
            alert(error.message);
            setRelatorios([]);
        }
    };

    const membrosOrdenados = [...membros].sort((a, b) =>
        (a.nome || "").localeCompare(b.nome || "", "pt-BR", {
            sensitivity: "base"
        })
    );

    const membrosFiltrados = membrosOrdenados.filter((membro) =>
        (membro.nome || "")
            .toLowerCase()
            .includes(buscaMembro.toLowerCase().trim())
    );

    const membrosDaCelula = Array.isArray(celulaSelecionada?.membros)
        ? [...celulaSelecionada.membros].sort((a, b) =>
            (a.nome || "").localeCompare(b.nome || "", "pt-BR", {
                sensitivity: "base"
            })
        )
        : [];

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
        setBuscaMembro("");
        setCelulaSelecionada(null);
        setModoFormulario(false);
    };

    const limparFormularioRelatorio = () => {
        setDataEncontro("");
        setTemaRelatorio("");
        setVisitantes(0);
        setObservacoes("");
        setPresencas([]);
        setModoRelatorio(false);
        setRelatorioSelecionado(null);
    };

    const abrirFormularioRelatorio = () => {
        if (!celulaSelecionada) return;

        setRelatorioSelecionado(null);
        setDataEncontro(new Date().toISOString().split("T")[0]);
        setTemaRelatorio("");
        setVisitantes(0);
        setObservacoes("");

        setPresencas(
            membrosDaCelula.map((membro) => ({
                membroId: membro.id,
                nomeMembro: membro.nome,
                presente: true
            }))
        );

        setModoRelatorio(true);
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

    const salvarRelatorio = async () => {
        if (!celulaSelecionada) return;

        if (!dataEncontro) {
            alert("Informe a data do encontro");
            return;
        }

        if (presencas.length === 0) {
            alert("A célula não possui membros para registrar presença");
            return;
        }

        const dados = {
            dataEncontro,
            tema: temaRelatorio,
            visitantes: Number(visitantes) || 0,
            observacoes,
            presencas: presencas.map((presenca) => ({
                membroId: presenca.membroId,
                presente: presenca.presente
            }))
        };

        try {
            const response = await fetch(`${API_URL}/celulas/${celulaSelecionada.id}/relatorios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "Erro ao salvar relatório");
            }

            alert("Relatório salvo com sucesso!");
            limparFormularioRelatorio();
            carregarRelatorios(celulaSelecionada.id);
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
        setBuscaMembro("");

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

    const excluirRelatorio = async (id) => {
        const confirmar = window.confirm("Deseja excluir este relatório?");
        if (!confirmar) return;

        try {
            const response = await fetch(`${API_URL}/celulas/relatorios/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Erro ao excluir relatório");
            }

            alert("Relatório excluído com sucesso!");
            setRelatorioSelecionado(null);
            carregarRelatorios(celulaSelecionada.id);
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

    const alterarPresenca = (membroId) => {
        setPresencas((lista) =>
            lista.map((presenca) =>
                presenca.membroId === membroId
                    ? { ...presenca, presente: !presenca.presente }
                    : presenca
            )
        );
    };

    const formatarData = (data) => {
        if (!data) return "Data não informada";

        return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
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
                        <>
                            <input
                                className="search-input"
                                placeholder="Buscar membro pelo nome..."
                                value={buscaMembro}
                                onChange={(e) => setBuscaMembro(e.target.value)}
                            />

                            {membrosFiltrados.length === 0 ? (
                                <p>Nenhum membro encontrado.</p>
                            ) : (
                                <div className="membros-checkbox-list">
                                    {membrosFiltrados.map((m) => {
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

                                                <span className="membro-label">
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
                        </>
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
                        onClick={() => {
                            setCelulaSelecionada(celula);
                            setModoRelatorio(false);
                            setRelatorioSelecionado(null);
                        }}
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

                    {membrosDaCelula.length === 0 ? (
                        <p>Nenhum membro vinculado.</p>
                    ) : (
                        <ul className="membros-lista">
                            {membrosDaCelula.map((m) => (
                                <li key={m.id}>{m.nome}</li>
                            ))}
                        </ul>
                    )}

                    <div className="button-row">
                        <button className="primary-button" onClick={abrirFormularioRelatorio}>
                            Novo Relatório Semanal
                        </button>

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

                    {modoRelatorio && (
                        <div className="relatorio-card">
                            <h3>Novo Relatório Semanal</h3>

                            <input
                                type="date"
                                value={dataEncontro}
                                onChange={(e) => setDataEncontro(e.target.value)}
                            />

                            <input
                                placeholder="Tema do encontro"
                                value={temaRelatorio}
                                onChange={(e) => setTemaRelatorio(e.target.value)}
                            />

                            <input
                                type="number"
                                min="0"
                                placeholder="Quantidade de visitantes"
                                value={visitantes}
                                onChange={(e) => setVisitantes(e.target.value)}
                            />

                            <textarea
                                placeholder="Observações"
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                            />

                            <h4>Presença dos membros</h4>

                            {presencas.length === 0 ? (
                                <p>Nenhum membro vinculado à célula.</p>
                            ) : (
                                <div className="membros-checkbox-list">
                                    {presencas.map((presenca) => (
                                        <label key={presenca.membroId} className="membro-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={presenca.presente}
                                                onChange={() => alterarPresenca(presenca.membroId)}
                                            />
                                            <span>{presenca.nomeMembro}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            <div className="button-row">
                                <button className="primary-button" onClick={salvarRelatorio}>
                                    Salvar Relatório
                                </button>

                                <button className="secondary-button" onClick={limparFormularioRelatorio}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    <h3>Relatórios Semanais</h3>

                    {relatorios.length === 0 ? (
                        <p>Nenhum relatório cadastrado para esta célula.</p>
                    ) : (
                        <div className="relatorios-lista">
                            {relatorios.map((relatorio) => (
                                <div key={relatorio.id} className="relatorio-item">
                                    <div>
                                        <strong>{formatarData(relatorio.dataEncontro)}</strong>
                                        <p>{relatorio.tema || "Sem tema informado"}</p>
                                        <small>
                                            {relatorio.totalPresentes} presente(s), {relatorio.totalAusentes} ausente(s), {relatorio.visitantes || 0} visitante(s)
                                        </small>
                                    </div>

                                    <div className="button-row">
                                        <button
                                            className="secondary-button"
                                            onClick={() => setRelatorioSelecionado(relatorio)}
                                        >
                                            Detalhes
                                        </button>

                                        <button
                                            className="danger-button"
                                            onClick={() => excluirRelatorio(relatorio.id)}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {relatorioSelecionado && (
                        <div className="relatorio-card">
                            <h3>Detalhes do Relatório</h3>

                            <p><strong>Data:</strong> {formatarData(relatorioSelecionado.dataEncontro)}</p>
                            <p><strong>Tema:</strong> {relatorioSelecionado.tema || "Não informado"}</p>
                            <p><strong>Visitantes:</strong> {relatorioSelecionado.visitantes || 0}</p>
                            <p><strong>Observações:</strong> {relatorioSelecionado.observacoes || "Nenhuma observação"}</p>

                            <h4>Presenças</h4>

                            <ul className="membros-lista">
                                {relatorioSelecionado.presencas?.map((presenca) => (
                                    <li key={presenca.id}>
                                        {presenca.nomeMembro} — {presenca.presente ? "Presente" : "Ausente"}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className="secondary-button"
                                onClick={() => setRelatorioSelecionado(null)}
                            >
                                Fechar detalhes
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Celulas;