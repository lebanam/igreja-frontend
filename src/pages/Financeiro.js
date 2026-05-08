import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import "./Celulas.css";

function Financeiro() {
    const navigate = useNavigate();

    const cards = [
        {
            title: "Lançar Arrecadação",
            icon: TrendingUp,
            action: () => navigate("/financeiro/receita")
        },
        {
            title: "Lançar Despesa",
            icon: TrendingDown,
            action: () => navigate("/financeiro/despesa")
        },
        {
            title: "Relatório",
            icon: BarChart3,
            action: () => navigate("/financeiro/relatorio")
        }
    ];

    return (
        <div className="page">
            <h1 className="page-title">Financeiro</h1>

            <div className="card-grid celulas-grid">
                {cards.map((card, index) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={index}
                            className="menu-card"
                            onClick={card.action}
                        >
                            <div className="menu-icon">
                                <Icon size={28} />
                            </div>

                            <strong>{card.title}</strong>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Financeiro;