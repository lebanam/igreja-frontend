import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Celulas.css";

const API_URL = "https://igreja-backend-eyfg.onrender.com";

const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
];

function RelatorioFinanceiro() {
    const navigate = useNavigate();

    const [lancamentos, setLancamentos] = useState([]);
    const [mesAberto, setMesAberto] = useState(null);
    const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());

    const carregarLancamentos = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/financeiro`);

            if (!response.ok) {
                throw new Error("Erro ao carregar relatório financeiro");
            }

            const data = await response.json();
            setLancamentos(Array.isArray(data) ? data : []);
        } catch (error) {
            alert(error.message);
            setLancamentos([]);
        }
    }, []);

    useEffect(() => {
        carregarLancamentos();
    }, [carregarLancamentos]);

    const anosDisponiveis = Array.from(
        new Set([
            new Date().getFullYear(),
            ...lancamentos.map((lancamento) =>
                new Date(`${lancamento.data}T00:00:00`).getFullYear()
            )
        ])
    ).sort((a, b) => b - a);

    const formatarMoeda = (valor) => {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    };

    const obterLancamentosDoMes = (mesIndex) => {
        return lancamentos.filter((lancamento) => {
            const data = new Date(`${lancamento.data}T00:00:00`);

            return (
                data.getMonth() === mesIndex &&
                data.getFullYear() === anoSelecionado
            );
        });
    };

    const calcularResumoMes = (mesIndex) => {
        const lancamentosMes = obterLancamentosDoMes(mesIndex);

        const arrecadacao = lancamentosMes
            .filter((item) => item.tipo === "ARRECADACAO")
            .reduce((total, item) => total + Number(item.valor || 0), 0);

        const despesa = lancamentosMes
            .filter((item) => item.tipo === "DESPESA")
            .reduce((total, item) => total + Number(item.valor || 0), 0);

        return {
            arrecadacao,
            despesa,
            total: arrecadacao - despesa,
            lancamentos: lancamentosMes
        };
    };

    const alternarMes = (index) => {
        setMesAberto(mesAberto === index ? null : index);
    };

    const alterarAno = (ano) => {
        setAnoSelecionado(Number(ano));
        setMesAberto(null);
    };

    return (
        <div className="page">
            <button className="back-button" onClick={() => navigate("/financeiro")}>
                Voltar
            </button>

            <h1 className="page-title">Relatório Financeiro</h1>

            <div className="form-card">
                <h2>Relatório Mensal</h2>

                <select
                    value={anoSelecionado}
                    onChange={(e) => alterarAno(e.target.value)}
                >
                    {anosDisponiveis.map((ano) => (
                        <option key={ano} value={ano}>
                            {ano}
                        </option>
                    ))}
                </select>

                {meses.map((mes, index) => {
                    const resumo = calcularResumoMes(index);
                    const aberto = mesAberto === index;

                    return (
                        <div key={mes} className="relatorio-mes">
                            <button
                                className="relatorio-mes-header"
                                onClick={() => alternarMes(index)}
                            >
                                <strong>{mes}</strong>
                                <span>{aberto ? "−" : "+"}</span>
                            </button>

                            {aberto && (
                                <div className="relatorio-mes-detalhe">
                                    <ul className="membros-lista">
                                        <li>
                                            <strong>Arrecadação</strong> -{" "}
                                            {formatarMoeda(resumo.arrecadacao)}
                                        </li>

                                        <li>
                                            <strong>Despesa</strong> -{" "}
                                            {formatarMoeda(resumo.despesa)}
                                        </li>

                                        <li>
                                            <strong>Total</strong> -{" "}
                                            {formatarMoeda(resumo.total)}
                                        </li>
                                    </ul>

                                    <h3>Lançamentos</h3>

                                    {resumo.lancamentos.length === 0 ? (
                                        <p>Nenhum lançamento neste mês.</p>
                                    ) : (
                                        <div className="relatorio-lancamentos">
                                            {resumo.lancamentos.map((item) => (
                                                <p key={item.id}>
                                                    <strong>
                                                        {item.tipo === "ARRECADACAO"
                                                            ? "Arrecadação"
                                                            : "Despesa"}
                                                    </strong>{" "}
                                                    - {item.descricao} -{" "}
                                                    {formatarMoeda(item.valor)}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RelatorioFinanceiro;