import { useEffect, useState } from "react";
import {
    Users,
    Home as HomeIcon,
    Folder,
    Wallet,
    TrendingUp,
    TrendingDown,
    BarChart3,
    PieChart,
    Boxes,
    Church
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { API_URL } from "../config/api";
import "./Dashboard.css";
import "./Celulas.css";

function Dashboard() {
    const [dados, setDados] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [graficoSelecionado, setGraficoSelecionado] = useState("financeiro");

    useEffect(() => {
        carregarDashboard();
    }, []);

    const carregarDashboard = async () => {
        try {
            const response = await fetch(`${API_URL}/dashboard`);

            if (!response.ok) {
                throw new Error("Erro ao carregar dashboard");
            }

            const data = await response.json();
            setDados(data);
        } catch (error) {
            alert(error.message);
            setDados(null);
        } finally {
            setCarregando(false);
        }
    };

    const formatarMoeda = (valor) => {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    };

    if (carregando) {
        return (
            <div className="page">
                <h1 className="page-title">Dashboard</h1>
                <p>Carregando dados...</p>
            </div>
        );
    }

    if (!dados) {
        return (
            <div className="page">
                <h1 className="page-title">Dashboard</h1>
                <p>Não foi possível carregar os dados do dashboard.</p>
            </div>
        );
    }

    const cards = [
        {
            titulo: "Membros",
            valor: dados.totalMembros || 0,
            descricao: "Total cadastrado",
            icon: Users
        },
        {
            titulo: "Células",
            valor: dados.totalCelulas || 0,
            descricao: "Células cadastradas",
            icon: HomeIcon
        },
        {
            titulo: "Ministérios",
            valor: dados.totalMinisterios || 0,
            descricao: "Ministérios ativos",
            icon: Folder
        },
        {
            titulo: "Saldo do mês",
            valor: formatarMoeda(dados.saldoMes),
            descricao: "Entradas - saídas",
            icon: Wallet
        }
    ];

    const graficos = [
        {
            id: "financeiro",
            titulo: "Financeiro",
            descricao: "Entradas, saídas e saldo",
            icon: BarChart3
        },
        {
            id: "membros",
            titulo: "Membros",
            descricao: "Crescimento e cadastros",
            icon: Users
        },
        {
            id: "celulas",
            titulo: "Células",
            descricao: "Presença e visitantes",
            icon: Church
        },
        {
            id: "inventario",
            titulo: "Inventário",
            descricao: "Itens e estoque",
            icon: Boxes
        }
    ];

    return (
        <div className="page">
            <h1 className="page-title">Dashboard</h1>

            <section className="dashboard-cards">
                {cards.map((card, index) => {
                    const Icon = card.icon;

                    return (
                        <div key={index} className="dashboard-card">
                            <div className="dashboard-card-icon">
                                <Icon size={24} />
                            </div>

                            <div>
                                <span>{card.titulo}</span>
                                <strong>{card.valor}</strong>
                                <p>{card.descricao}</p>
                            </div>
                        </div>
                    );
                })}
            </section>

            <section className="dashboard-grid">
                <div className="dashboard-panel">
                    <div className="dashboard-panel-header">
                        <h2>Financeiro do mês</h2>
                        <Wallet size={20} />
                    </div>

                    <div className="financeiro-resumo">
                        <div className="financeiro-linha">
                            <div>
                                <TrendingUp size={18} />
                                <span>Entradas</span>
                            </div>

                            <strong className="valor-positivo">
                                {formatarMoeda(dados.entradasMes)}
                            </strong>
                        </div>

                        <div className="financeiro-linha">
                            <div>
                                <TrendingDown size={18} />
                                <span>Saídas</span>
                            </div>

                            <strong className="valor-negativo">
                                {formatarMoeda(dados.saidasMes)}
                            </strong>
                        </div>

                        <div className="financeiro-linha financeiro-total">
                            <div>
                                <Wallet size={18} />
                                <span>Saldo</span>
                            </div>

                            <strong>{formatarMoeda(dados.saldoMes)}</strong>
                        </div>
                    </div>
                </div>

                <div className="dashboard-panel">
                    <div className="dashboard-panel-header">
                        <h2>Análises por setor</h2>
                        <PieChart size={20} />
                    </div>

                    <div className="dashboard-analises">
                        {graficos.map((grafico) => {
                            const Icon = grafico.icon;

                            return (
                                <button
                                    key={grafico.id}
                                    className={
                                        graficoSelecionado === grafico.id
                                            ? "analise-card analise-card-ativo"
                                            : "analise-card"
                                    }
                                    onClick={() => setGraficoSelecionado(grafico.id)}
                                >
                                    <Icon size={22} />

                                    <div>
                                        <strong>{grafico.titulo}</strong>
                                        <span>{grafico.descricao}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="dashboard-panel dashboard-chart-panel">
                <div className="dashboard-panel-header">
                    <h2>
                        {graficoSelecionado === "financeiro"
                            ? "Financeiro dos últimos 3 meses"
                            : "Análise em breve"}
                    </h2>

                    <BarChart3 size={20} />
                </div>

                {graficoSelecionado === "financeiro" ? (
                    <div className="dashboard-chart">
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={dados.graficoFinanceiro || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatarMoeda(value)} />
                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="entradas"
                                    name="Entradas"
                                    stroke="#16a34a"
                                    strokeWidth={3}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="saidas"
                                    name="Saídas"
                                    stroke="#dc2626"
                                    strokeWidth={3}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="saldo"
                                    name="Saldo"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="grafico-placeholder">
                        <BarChart3 size={42} />

                        <p>Esse gráfico será implementado na próxima etapa.</p>

                        <small>
                            A estrutura já está pronta para alternar entre setores.
                        </small>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Dashboard;