import { Fragment, useEffect, useRef, useState } from "react";
import { API_URL } from "../config/api";
import "./Membros.css";

function CadastrosPendentes() {
    const [pendentes, setPendentes] = useState([]);
    const [celulas, setCelulas] = useState([]);
    const [membroSelecionadoId, setMembroSelecionadoId] = useState(null);

    const detalhesRef = useRef(null);

    const [batizado, setBatizado] = useState(false);
    const [voluntario, setVoluntario] = useState(false);
    const [membroDesde, setMembroDesde] = useState("");
    const [celulaId, setCelulaId] = useState("");

    useEffect(() => {
        carregarPendentes();
        carregarCelulas();
    }, []);

    const carregarPendentes = async () => {
        try {
            const response = await fetch(`${API_URL}/membros/pendentes`);

            if (!response.ok) {
                throw new Error("Erro ao carregar cadastros pendentes");
            }

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

            if (!response.ok) {
                throw new Error("Erro ao carregar células");
            }

            const data = await response.json();
            setCelulas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao carregar células:", error);
            setCelulas([]);
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
        setBatizado(Boolean(membro.batizado));
        setVoluntario(Boolean(membro.voluntario));
        setMembroDesde(membro.membroDesde || "");
        setCelulaId(membro.celula?.id || "");

        setTimeout(() => {
            detalhesRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 100);
    };

    const aprovarCadastro = async (membroId) => {
        const confirmar = window.confirm("Deseja aprovar este cadastro?");
        if (!confirmar) return;

        const dados = {
            batizado,
            voluntario,
            membroDesde: membroDesde || null,
            celulaId: celulaId ? Number(celulaId) : null,
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

    const renderizarAnalise = (membro) => (
        <div className="detalhe-card" ref={detalhesRef}>
            <h3>Analisar cadastro</h3>

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

            <hr />

            <h4>Dados administrativos</h4>

            <label className="checkbox-field">
                <input
                    type="checkbox"
                    checked={batizado}
                    onChange={(e) => setBatizado(e.target.checked)}
                />
                <span>Batizado</span>
            </label>

            <label className="checkbox-field">
                <input
                    type="checkbox"
                    checked={voluntario}
                    onChange={(e) => setVoluntario(e.target.checked)}
                />
                <span>Voluntário</span>
            </label>

            <label className="field-label">Membro desde:</label>
            <input
                type="date"
                value={membroDesde}
                onChange={(e) => setMembroDesde(e.target.value)}
            />

            <label className="field-label">Célula:</label>
            <select
                value={celulaId}
                onChange={(e) => setCelulaId(e.target.value)}
            >
                <option value="">Sem célula</option>

                {celulas.map((celula) => (
                    <option key={celula.id} value={celula.id}>
                        {celula.nome}
                    </option>
                ))}
            </select>

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