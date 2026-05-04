import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import "./Celulas.css";

const API_URL = "https://igreja-backend-eyfg.onrender.com";

function LancamentoFinanceiro() {
    const navigate = useNavigate();
    const { tipo } = useParams();

    const isReceita = tipo === "receita";

    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [data, setData] = useState("");
    const [categoria, setCategoria] = useState("");
    const [observacoes, setObservacoes] = useState("");

    const salvarLancamento = async () => {
        if (!descricao || !valor || !data) {
            alert("Preencha descrição, valor e data");
            return;
        }

        const dados = {
            tipo: isReceita ? "ARRECADACAO" : "DESPESA",
            descricao,
            valor: Number(valor),
            data,
            categoria,
            observacoes
        };

        try {
            const response = await fetch(`${API_URL}/financeiro`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "Erro ao salvar lançamento");
            }

            alert("Lançamento salvo com sucesso!");
            navigate("/financeiro");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="page">
            <button className="back-button" onClick={() => navigate("/financeiro")}>
                Voltar
            </button>

            <h1 className="page-title">
                {isReceita ? "Lançar Arrecadação" : "Lançar Despesa"}
            </h1>

            <div className="form-card">
                <input
                    placeholder="Descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />

                <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Valor"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                />

                <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                />

                <input
                    placeholder="Categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                />

                <textarea
                    placeholder="Observações"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                />

                <div className="button-row">
                    <button className="primary-button" onClick={salvarLancamento}>
                        Salvar
                    </button>

                    <button className="secondary-button" onClick={() => navigate("/financeiro")}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LancamentoFinanceiro;