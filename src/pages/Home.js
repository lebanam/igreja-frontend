import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
    Users,
    Home as HomeIcon,
    Folder,
    Package,
    DollarSign,
    UserPlus,
    BarChart3,
    Baby,
    CalendarDays
} from "lucide-react";

function Home() {
    const navigate = useNavigate();

    const cards = [
        { title: "Membros", icon: Users, action: () => navigate("/membros") },
        { title: "Células", icon: HomeIcon, action: () => navigate("/celulas") },
        { title: "Ministérios", icon: Folder, action: () => navigate("/ministerios") },
        { title: "Visitantes", icon: UserPlus, action: () => alert("Em breve") },
        { title: "Financeiro", icon: DollarSign, action: () => navigate("/financeiro") },
        { title: "Kids", icon: Baby, action: () => alert("Em breve") },
        { title: "Eventos", icon: CalendarDays, action: () => alert("Em breve") },
        { title: "Dashboard", icon: BarChart3, action: () => alert("Em breve") },
        { title: "Inventário", icon: Package, action: () => alert("Em breve") },
    ];

    const sair = () => {
        localStorage.removeItem("logado");
        navigate("/");
    };

    return (
        <main className="home-page">
            <header className="home-header">
                <div>
                    <h1>Igreja360</h1>
                    <p>Gestão simples e organizada para sua igreja</p>
                </div>

                <button className="logout-button" onClick={sair}>
                    Sair
                </button>
            </header>

            <section className="home-grid">
                {cards.map((card, index) => {
                    const Icon = card.icon;

                    return (
                        <button
                            key={index}
                            className="home-card"
                            onClick={card.action}
                        >
                            <Icon className="home-card-icon" size={36} />
                            <span className="home-card-title">{card.title}</span>
                        </button>
                    );
                })}
            </section>
        </main>
    );
}

export default Home;