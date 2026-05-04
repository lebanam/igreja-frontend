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
    const [modoFormulario, setModoFormulario] = useState(false);
    const [escalaSelecionada, setEscalaSelecionada] = useState(null);

    const [data, setData] = useState("");
    const [horario, setHorario] = useState("");
    const [titulo, setTitulo] = useState("");
    const [textoEscala, setTextoEscala] = useState("");
    const [observacoes, setObservacoes] = useState("");


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

    useEffect(() => {
        carregarEscalas();
    }, [carregarEscalas]);

    const limparFormulario = () => {
        setData("");
        setHorario("");
        setTitulo("");
        setTextoEscala("");
        setObservacoes("");
        setEscalaSelecionada(null);
        setModoFormulario(false);
    };

    const salvarEscala = async () => {
        if (!data || !titulo || !textoEscala) {
            alert("Preencha data, título e escala");
            return;
        }

        const dados = {
            data,
            horario: horario || null,
            titulo,
            textoEscala,
            observacoes,
            ministerioId: Number(ministerioId)
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
        setEscalaSelecionada(escala);
        setData(escala.data || "");
        setHorario(escala.horario || "");
        setTitulo(escala.titulo || "");
        setTextoEscala(escala.textoEscala || "");
        setObservacoes(escala.observacoes || "");
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

                    <textarea
                        placeholder={"Escala completa\nEx: Vocal: Ana\nViolão: João\nTeclado: Maria"}
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
                {escalas.map((escala) => (
                    <div
                        key={escala.id}
                        className="menu-card"
                        onClick={() => setEscalaSelecionada(escala)}
                    >
                        <div className="menu-icon">
                            <CalendarDays size={28} />
                        </div>

                        <strong>{escala.titulo}</strong>
                        <p>{escala.data}</p>
                        <small>{escala.horario || "Horário não informado"}</small>
                    </div>
                ))}
            </div>

            {escalaSelecionada && !modoFormulario && (
                <div className="form-card">
                    <h2>{escalaSelecionada.titulo}</h2>

                    <p><strong>Data:</strong> {escalaSelecionada.data || "Não informado"}</p>
                    <p><strong>Horário:</strong> {escalaSelecionada.horario || "Não informado"}</p>

                    <h3>Escala</h3>
                    <pre className="escala-texto">
                        {escalaSelecionada.textoEscala || "Não informado"}
                    </pre>

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