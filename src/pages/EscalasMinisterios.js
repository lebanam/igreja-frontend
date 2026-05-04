import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import "./Celulas.css";

const API_URL = "https://igreja-backend-eyfg.onrender.com";

function EscalasMinisterio() {
    const navigate = useNavigate();
    const location = useLocation();
    const { ministerioId } = useParams();

    const ministerio = location.state?.ministerio;

    const [escalas, setEscalas] = useState([]);
    const [membros, setMembros] = useState([]);
    const [modoFormulario, setModoFormulario] = useState(false);
    const [escalaSelecionada, setEscalaSelecionada] = useState(null);
    const [buscaMembro, setBuscaMembro] = useState("");

    const [data, setData] = useState("");
    const [horario, setHorario] = useState("");
    const [titulo, setTitulo] = useState("");
    const [textoEscala, setTextoEscala] = useState("");
    const [observacoes, setObservacoes] = useState("");
    const [participantes, setParticipantes] = useState([
        { funcao: "", membroId: "" }
    ]);

    const formatarData = (data) => {
        if (!data) return "Não informado";

        const d = new Date(`${data}T00:00:00`);

        const diaSemana = d.toLocaleDateString("pt-BR", {
            weekday: "long"
        });

        const dataFormatada = d.toLocaleDateString("pt-BR");

        const diaCapitalizado =
            diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

        return `${diaCapitalizado}, ${dataFormatada}`;
    };

    const carregarEscalas = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/ministerios/${ministerioId}/escalas`);

            if (!response.ok) {
                throw new Error("Erro ao carregar escalas");
            }

            const data = await response.json();
            setEscalas(Array.isArray(data) ? data : []);
        } catch (error) {
            alert(error.message);
            setEscalas([]);
        }
    }, [ministerioId]);

    const carregarMembros = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        carregarEscalas();
        carregarMembros();
    }, [carregarEscalas, carregarMembros]);

    const limparFormulario = () => {
        setData("");
        setHorario("");
        setTitulo("");
        setTextoEscala("");
        setObservacoes("");
        setParticipantes([{ funcao: "", membroId: "" }]);
        setEscalaSelecionada(null);
        setModoFormulario(false);
    };

    const adicionarParticipante = () => {
        setParticipantes([
            ...participantes,
            { funcao: "", membroId: "" }
        ]);
    };

    const removerParticipante = (index) => {
        const novaLista = participantes.filter((_, i) => i !== index);

        setParticipantes(
            novaLista.length > 0 ? novaLista : [{ funcao: "", membroId: "" }]
        );
    };

    const alterarParticipante = (index, campo, valor) => {
        const novaLista = participantes.map((participante, i) => {
            if (i !== index) return participante;

            return {
                ...participante,
                [campo]: valor
            };
        });

        setParticipantes(novaLista);
    };

    const obterParticipantesValidos = () => {
        return participantes
            .filter((participante) => participante.funcao.trim() && participante.membroId)
            .map((participante) => ({
                funcao: participante.funcao.trim(),
                membroId: Number(participante.membroId)
            }));
    };

    const salvarEscala = async () => {
        const participantesValidos = obterParticipantesValidos();

        if (!data || !titulo) {
            alert("Preencha data e título");
            return;
        }

        if (participantesValidos.length === 0 && !textoEscala.trim()) {
            alert("Adicione pelo menos uma função com membro ou preencha a escala em texto");
            return;
        }

        const dados = {
            data,
            horario: horario || null,
            titulo,
            textoEscala,
            observacoes,
            ministerioId: Number(ministerioId),
            participantes: participantesValidos
        };

        try {
            const url = escalaSelecionada
                ? `${API_URL}/escalas/${escalaSelecionada.id}`
                : `${API_URL}/escalas`;

            const response = await fetch(url, {
                method: escalaSelecionada ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "Erro ao salvar escala");
            }

            alert("Escala salva com sucesso!");
            limparFormulario();
            carregarEscalas();
        } catch (error) {
            alert(error.message);
        }
    };

    const editarEscala = (escala) => {
        const participantesEditaveis =
            escala.participantes && escala.participantes.length > 0
                ? escala.participantes.map((participante) => ({
                    funcao: participante.funcao || "",
                    membroId: participante.membroId || ""
                }))
                : [{ funcao: "", membroId: "" }];

        setEscalaSelecionada(escala);
        setData(escala.data || "");
        setHorario(escala.horario || "");
        setTitulo(escala.titulo || "");
        setTextoEscala(escala.textoEscala || "");
        setObservacoes(escala.observacoes || "");
        setParticipantes(participantesEditaveis);
        setModoFormulario(true);
    };

    const excluirEscala = async (id) => {
        const confirmar = window.confirm("Deseja excluir esta escala?");
        if (!confirmar) return;

        try {
            const response = await fetch(`${API_URL}/escalas/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Erro ao excluir escala");
            }

            alert("Escala excluída com sucesso!");
            setEscalaSelecionada(null);
            carregarEscalas();
        } catch (error) {
            alert(error.message);
        }
    };

    const escalaTemMembroBuscado = (escala) => {
        if (!buscaMembro.trim()) return true;

        const termo = buscaMembro.toLowerCase();

        return escala.participantes?.some((participante) =>
            participante.membroNome?.toLowerCase().includes(termo)
        );
    };

    const escalasFiltradas = escalas.filter(escalaTemMembroBuscado);

    return (
        <div className="page">
            <button className="back-button" onClick={() => navigate("/ministerios")}>
                Voltar
            </button>

            <h1 className="page-title">
                Escalas {ministerio?.nome ? `- ${ministerio.nome}` : ""}
            </h1>

            <button className="primary-button" onClick={() => setModoFormulario(true)}>
                Nova Escala
            </button>

            <input
                placeholder="Buscar membro escalado..."
                value={buscaMembro}
                onChange={(e) => setBuscaMembro(e.target.value)}
            />

            {modoFormulario && (
                <div className="form-card">
                    <h2>{escalaSelecionada ? "Editar Escala" : "Cadastrar Escala"}</h2>

                    <input
                        type="date"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                    />

                    <input
                        type="time"
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)}
                    />

                    <input
                        placeholder="Título"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />

                    <h3>Funções da escala</h3>

                    {participantes.map((participante, index) => (
                        <div key={index} className="button-row">
                            <input
                                placeholder="Função. Ex: Vocal, Recepção, Professor"
                                value={participante.funcao}
                                onChange={(e) =>
                                    alterarParticipante(index, "funcao", e.target.value)
                                }
                            />

                            <select
                                value={participante.membroId}
                                onChange={(e) =>
                                    alterarParticipante(index, "membroId", e.target.value)
                                }
                            >
                                <option value="">Selecione um membro</option>
                                {membros.map((membro) => (
                                    <option key={membro.id} value={membro.id}>
                                        {membro.nome}
                                    </option>
                                ))}
                            </select>

                            <button
                                className="danger-button"
                                type="button"
                                onClick={() => removerParticipante(index)}
                            >
                                Remover
                            </button>
                        </div>
                    ))}

                    <button
                        className="secondary-button"
                        type="button"
                        onClick={adicionarParticipante}
                    >
                        + Adicionar função
                    </button>

                    <textarea
                        placeholder="Escala em texto livre (opcional durante a transição)"
                        value={textoEscala}
                        onChange={(e) => setTextoEscala(e.target.value)}
                    />

                    <textarea
                        placeholder="Observações"
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                    />

                    <div className="button-row">
                        <button className="primary-button" onClick={salvarEscala}>
                            Salvar
                        </button>

                        <button className="secondary-button" onClick={limparFormulario}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <div className="card-grid celulas-grid">
                {escalasFiltradas.map((escala) => (
                    <div
                        key={escala.id}
                        className="menu-card"
                        onClick={() => setEscalaSelecionada(escala)}
                    >
                        <div className="menu-icon">
                            <CalendarDays size={28} />
                        </div>

                        <strong>{escala.titulo}</strong>
                        <p>{formatarData(escala.data)}</p>
                        <small>{escala.horario || "Horário não informado"}</small>

                        {escala.participantes?.length > 0 && (
                            <div>
                                {escala.participantes.map((participante, index) => (
                                    <small key={index}>
                                        <strong>{participante.funcao}:</strong>{" "}
                                        {participante.membroNome}
                                        <br />
                                    </small>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {escalaSelecionada && !modoFormulario && (
                <div className="form-card">
                    <h2>{escalaSelecionada.titulo}</h2>

                    <p><strong>Data:</strong> {formatarData(escalaSelecionada.data)}</p>
                    <p><strong>Horário:</strong> {escalaSelecionada.horario || "Não informado"}</p>

                    <h3>Escala</h3>

                    {escalaSelecionada.participantes?.length > 0 ? (
                        <ul className="membros-lista">
                            {escalaSelecionada.participantes.map((participante, index) => (
                                <li key={index}>
                                    <strong>{participante.funcao}</strong> -{" "}
                                    {participante.membroNome}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <pre className="escala-texto">
                            {escalaSelecionada.textoEscala || "Não informado"}
                        </pre>
                    )}

                    <h3>Observações</h3>
                    <p>{escalaSelecionada.observacoes || "Nenhuma observação"}</p>

                    <div className="button-row">
                        <button
                            className="secondary-button"
                            onClick={() => editarEscala(escalaSelecionada)}
                        >
                            Editar
                        </button>

                        <button
                            className="danger-button"
                            onClick={() => excluirEscala(escalaSelecionada.id)}
                        >
                            Excluir
                        </button>

                        <button
                            className="secondary-button"
                            onClick={() => setEscalaSelecionada(null)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EscalasMinisterio;