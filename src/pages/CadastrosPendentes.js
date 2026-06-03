import { Fragment, useEffect, useRef, useState } from "react";
import { API_URL } from "../config/api";
import "./Membros.css";

function CadastrosPendentes() {
    const [pendentes, setPendentes] = useState([]);
    const [celulas, setCelulas] = useState([]);
    const [ministerios, setMinisterios] = useState([]);
    const [membros, setMembros] = useState([]);

    const [membroSelecionadoId, setMembroSelecionadoId] = useState(null);
    const [etapaAtiva, setEtapaAtiva] = useState("cadastro");

    const detalhesRef = useRef(null);

    const [batizado, setBatizado] = useState(false);
    const [dataBatismo, setDataBatismo] = useState("");
    const [voluntario, setVoluntario] = useState(false);
    const [ministeriosSelecionados, setMinisteriosSelecionados] = useState([]);
    const [membroDesde, setMembroDesde] = useState("");
    const [celulaId, setCelulaId] = useState("");
    const [liderCelula, setLiderCelula] = useState(false);
    const [liderMinisterio, setLiderMinisterio] = useState(false);

    const [paiId, setPaiId] = useState("");
    const [maeId, setMaeId] = useState("");
    const [conjugeId, setConjugeId] = useState("");
    const [filhosIds, setFilhosIds] = useState([]);

    useEffect(() => {
        carregarPendentes();
        carregarCelulas();
        carregarMinisterios();
        carregarMembros();
    }, []);

    const carregarPendentes = async () => {
        try {
            const response = await fetch(`${API_URL}/membros/pendentes`);
            if (!response.ok) throw new Error("Erro ao carregar cadastros pendentes");

            const data = await response.json();
            setPendentes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao carregar pendentes:", error);
            alert("Erro ao carregar cadastros pendentes");
            setPendentes([]);
        }
    };

    const carregarCelulas = async () => {
        try {
            const response = await fetch(`${API_URL}/celulas/resumo`);
            if (!response.ok) throw new Error("Erro ao carregar células");

            const data = await response.json();
            setCelulas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao carregar células:", error);
            setCelulas([]);
        }
    };

    const carregarMinisterios = async () => {
        try {
            const response = await fetch(`${API_URL}/ministerios`);
            if (!response.ok) throw new Error("Erro ao carregar ministérios");

            const data = await response.json();
            setMinisterios(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao carregar ministérios:", error);
            setMinisterios([]);
        }
    };

    const carregarMembros = async () => {
        try {
            const response = await fetch(`${API_URL}/membros`);
            if (!response.ok) throw new Error("Erro ao carregar membros");

            const data = await response.json();
            setMembros(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao carregar membros:", error);
            setMembros([]);
        }
    };

    const formatarData = (data) => {
        if (!data) return "-";
        return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
    };

    const formatarOpcao = (valor) => {
        if (!valor) return "-";
        const texto = valor.toLowerCase().replace("_", " ");
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    };

    const abrirAnalise = (membro) => {
        const deveFechar = membroSelecionadoId === membro.id;

        if (deveFechar) {
            setMembroSelecionadoId(null);
            return;
        }

        setMembroSelecionadoId(membro.id);
        setEtapaAtiva("cadastro");

        setBatizado(Boolean(membro.batizado));
        setDataBatismo(membro.dataBatismo || "");
        setVoluntario(Boolean(membro.voluntario));
        setMembroDesde(membro.membroDesde || "");
        setCelulaId(membro.celula?.id || "");
        setLiderCelula(Boolean(membro.liderCelula));
        setLiderMinisterio(Boolean(membro.liderMinisterio));

        setMinisteriosSelecionados(
            membro.ministeriosVoluntario
                ? membro.ministeriosVoluntario.split(";").filter(Boolean)
                : []
        );

        setPaiId(membro.pai?.id || "");
        setMaeId(membro.mae?.id || "");
        setConjugeId(membro.conjuge?.id || "");
        setFilhosIds(membro.filhos?.map((filho) => String(filho.id)) || []);

        setTimeout(() => {
            detalhesRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 100);
    };

    const alternarMinisterio = (nomeMinisterio) => {
        setMinisteriosSelecionados((atual) => {
            if (atual.includes(nomeMinisterio)) {
                return atual.filter((item) => item !== nomeMinisterio);
            }

            return [...atual, nomeMinisterio];
        });
    };

    const alternarFilho = (id) => {
        setFilhosIds((atual) => {
            if (atual.includes(id)) {
                return atual.filter((item) => item !== id);
            }

            return [...atual, id];
        });
    };

    const aprovarCadastro = async (membroId) => {
        const confirmar = window.confirm("Deseja aprovar este cadastro?");
        if (!confirmar) return;

        const dados = {
            batizado,
            dataBatismo: batizado && dataBatismo ? dataBatismo : null,
            voluntario,
            ministeriosVoluntario: voluntario ? ministeriosSelecionados.join(";") : null,
            membroDesde: membroDesde || null,
            celulaId: celulaId ? Number(celulaId) : null,
            liderCelula,
            liderMinisterio,
            paiId: paiId ? Number(paiId) : null,
            maeId: maeId ? Number(maeId) : null,
            conjugeId: conjugeId ? Number(conjugeId) : null,
            filhosIds: filhosIds.map((id) => Number(id)),
        };

        try {
            const response = await fetch(`${API_URL}/membros/${membroId}/aprovar`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dados),
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "Erro ao aprovar cadastro");
            }

            alert("Cadastro aprovado com sucesso!");

            setMembroSelecionadoId(null);
            await carregarPendentes();
            await carregarMembros();
        } catch (error) {
            console.error("Erro ao aprovar cadastro:", error);
            alert(error.message);
        }
    };

    const reprovarCadastro = async (membroId) => {
        const confirmar = window.confirm("Deseja reprovar este cadastro?");
        if (!confirmar) return;

        try {
            const response = await fetch(`${API_URL}/membros/${membroId}/reprovar`, {
                method: "PATCH",
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "Erro ao reprovar cadastro");
            }

            alert("Cadastro reprovado.");

            setMembroSelecionadoId(null);
            await carregarPendentes();
        } catch (error) {
            console.error("Erro ao reprovar cadastro:", error);
            alert(error.message);
        }
    };

    const membrosRelacionaveis = (membroAtualId) =>
        membros.filter((membro) => membro.id !== membroAtualId);

    const renderizarTimeline = () => (
        <div className="membro-timeline">
            <button
                type="button"
                className={`timeline-step ${etapaAtiva === "cadastro" ? "active" : ""}`}
                onClick={() => setEtapaAtiva("cadastro")}
            >
                <div className="timeline-dot">1</div>
                <span>Cadastro</span>
            </button>

            <div className="timeline-line" />

            <button
                type="button"
                className={`timeline-step ${etapaAtiva === "vida" ? "active" : ""}`}
                onClick={() => setEtapaAtiva("vida")}
            >
                <div className="timeline-dot">2</div>
                <span>Vida na igreja</span>
            </button>

            <div className="timeline-line" />

            <button
                type="button"
                className={`timeline-step ${etapaAtiva === "ministerios" ? "active" : ""}`}
                onClick={() => setEtapaAtiva("ministerios")}
            >
                <div className="timeline-dot">3</div>
                <span>Ministérios</span>
            </button>

            <div className="timeline-line" />

            <button
                type="button"
                className={`timeline-step ${etapaAtiva === "familia" ? "active" : ""}`}
                onClick={() => setEtapaAtiva("familia")}
            >
                <div className="timeline-dot">4</div>
                <span>Família</span>
            </button>
        </div>
    );

    const renderizarConteudoEtapa = (membro) => {
        if (etapaAtiva === "cadastro") {
            return (
                <div className="timeline-section timeline-section-full">
                    <h4>Dados informados pelo usuário</h4>

                    <p><strong>Nome:</strong> {membro.nome}</p>
                    <p><strong>Email:</strong> {membro.email}</p>
                    <p><strong>Celular:</strong> {membro.telefone || "-"}</p>
                    <p><strong>Data de nascimento:</strong> {formatarData(membro.dataNascimento)}</p>
                    <p><strong>Idade:</strong> {membro.idade ?? "-"}</p>
                    <p><strong>Sexo:</strong> {formatarOpcao(membro.sexo)}</p>
                    <p><strong>Estado civil:</strong> {formatarOpcao(membro.estadoCivil)}</p>
                    <p><strong>Endereço:</strong> {membro.endereco || "-"}</p>
                    <p><strong>Instagram:</strong> {membro.instagram || "-"}</p>
                    <p><strong>Tipo:</strong> {formatarOpcao(membro.tipoCadastro)}</p>
                </div>
            );
        }

        if (etapaAtiva === "vida") {
            return (
                <div className="timeline-section timeline-section-full">
                    <h4>Vida na igreja</h4>

                    <label className="field-label">Célula:</label>
                    <select value={celulaId} onChange={(e) => setCelulaId(e.target.value)}>
                        <option value="">Sem célula</option>

                        {celulas.map((celula) => (
                            <option key={celula.id} value={celula.id}>
                                {celula.nome}
                            </option>
                        ))}
                    </select>

                    <label className="field-label">Membro desde:</label>
                    <input
                        type="date"
                        value={membroDesde}
                        onChange={(e) => setMembroDesde(e.target.value)}
                    />

                    <label className="checkbox-field">
                        <input
                            type="checkbox"
                            checked={batizado}
                            onChange={(e) => {
                                setBatizado(e.target.checked);

                                if (!e.target.checked) {
                                    setDataBatismo("");
                                }
                            }}
                        />
                        <span>Batizado</span>
                    </label>

                    {batizado && (
                        <>
                            <label className="field-label">Data de batismo:</label>
                            <input
                                type="date"
                                value={dataBatismo}
                                onChange={(e) => setDataBatismo(e.target.value)}
                            />
                        </>
                    )}

                    <label className="checkbox-field">
                        <input
                            type="checkbox"
                            checked={liderCelula}
                            onChange={(e) => setLiderCelula(e.target.checked)}
                        />
                        <span>Líder de célula</span>
                    </label>
                </div>
            );
        }

        if (etapaAtiva === "ministerios") {
            return (
                <div className="timeline-section timeline-section-full">
                    <h4>Ministérios</h4>

                    <label className="checkbox-field">
                        <input
                            type="checkbox"
                            checked={voluntario}
                            onChange={(e) => {
                                setVoluntario(e.target.checked);

                                if (!e.target.checked) {
                                    setMinisteriosSelecionados([]);
                                    setLiderMinisterio(false);
                                }
                            }}
                        />
                        <span>Voluntário</span>
                    </label>

                    {voluntario && (
                        <>
                            <label className="field-label">Ministérios em que atua:</label>

                            <div className="multi-select-list">
                                {ministerios.length === 0 ? (
                                    <p className="empty-text">Nenhum ministério cadastrado.</p>
                                ) : (
                                    ministerios.map((ministerio) => (
                                        <label
                                            key={ministerio.id}
                                            className="checkbox-field checkbox-card"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={ministeriosSelecionados.includes(ministerio.nome)}
                                                onChange={() => alternarMinisterio(ministerio.nome)}
                                            />
                                            <span>{ministerio.nome}</span>
                                        </label>
                                    ))
                                )}
                            </div>

                            <label className="checkbox-field">
                                <input
                                    type="checkbox"
                                    checked={liderMinisterio}
                                    onChange={(e) => setLiderMinisterio(e.target.checked)}
                                />
                                <span>Líder de ministério</span>
                            </label>
                        </>
                    )}
                </div>
            );
        }

        return (
            <div className="timeline-section timeline-section-full">
                <h4>Dados de família</h4>

                <label className="field-label">Pai:</label>
                <select value={paiId} onChange={(e) => setPaiId(e.target.value)}>
                    <option value="">Não informado</option>

                    {membrosRelacionaveis(membro.id).map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.nome}
                        </option>
                    ))}
                </select>

                <label className="field-label">Mãe:</label>
                <select value={maeId} onChange={(e) => setMaeId(e.target.value)}>
                    <option value="">Não informado</option>

                    {membrosRelacionaveis(membro.id).map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.nome}
                        </option>
                    ))}
                </select>

                <label className="field-label">Cônjuge:</label>
                <select value={conjugeId} onChange={(e) => setConjugeId(e.target.value)}>
                    <option value="">Não informado</option>

                    {membrosRelacionaveis(membro.id).map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.nome}
                        </option>
                    ))}
                </select>

                <label className="field-label">Filhos:</label>

                <div className="multi-select-list">
                    {membrosRelacionaveis(membro.id).map((item) => (
                        <label key={item.id} className="checkbox-field checkbox-card">
                            <input
                                type="checkbox"
                                checked={filhosIds.includes(String(item.id))}
                                onChange={() => alternarFilho(String(item.id))}
                            />
                            <span>{item.nome}</span>
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    const renderizarAnalise = (membro) => (
        <div className="detalhe-card membro-timeline-card" ref={detalhesRef}>
            <h3>Análise do cadastro</h3>

            {renderizarTimeline()}

            <div className="timeline-content-grid">
                {renderizarConteudoEtapa(membro)}
            </div>

            <div className="button-row">
                <button
                    className="primary-button"
                    onClick={() => aprovarCadastro(membro.id)}
                >
                    Aprovar cadastro
                </button>

                <button
                    className="danger-button"
                    onClick={() => reprovarCadastro(membro.id)}
                >
                    Reprovar
                </button>
            </div>
        </div>
    );

    return (
        <div className="page-container">
            <h2>Cadastros Pendentes</h2>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Celular</th>
                        <th>Tipo</th>
                        <th>Idade</th>
                        <th>Análise</th>
                    </tr>
                    </thead>

                    <tbody>
                    {pendentes.length === 0 ? (
                        <tr>
                            <td colSpan="6">
                                Nenhum cadastro pendente.
                            </td>
                        </tr>
                    ) : (
                        pendentes.map((membro) => (
                            <Fragment key={membro.id}>
                                <tr>
                                    <td>{membro.nome}</td>
                                    <td>{membro.email}</td>
                                    <td>{membro.telefone || "-"}</td>
                                    <td>{formatarOpcao(membro.tipoCadastro)}</td>
                                    <td>{membro.idade ?? "-"}</td>
                                    <td>
                                        <button
                                            className="secondary-button"
                                            onClick={() => abrirAnalise(membro)}
                                        >
                                            {membroSelecionadoId === membro.id
                                                ? "Fechar"
                                                : "Analisar"}
                                        </button>
                                    </td>
                                </tr>

                                {membroSelecionadoId === membro.id && (
                                    <tr className="detalhe-row">
                                        <td colSpan="6">
                                            {renderizarAnalise(membro)}
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CadastrosPendentes;