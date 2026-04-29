import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    const cards = [
        { title: "Membros", action: () => navigate("/membros") },
        { title: "Células", icon: "🏠", action: () => navigate("/celulas") },
        { title: "Ministérios", action: () => alert("Em breve") },
        { title: "Inventário", action: () => alert("Em breve") },
        { title: "Financeiro", action: () => alert("Em breve") },
        { title: "Visitantes", action: () => alert("Em breve") },
        { title: "Dashboard", action: () => alert("Em breve") },
    ];

    return (
        <div className="dashboard">
            <h1>Igreja360</h1>

            <div className="grid">
                {cards.map((card, index) => (
                    <div key={index} className="card" onClick={card.action}>
                        <div className="icon">📌</div>
                        <span>{card.title}</span>
                    </div>
                ))}
            </div>

            <button className="logout" onClick={() => {
                localStorage.removeItem("logado");
                navigate("/");
            }}>
                Sair
            </button>
        </div>
    );
}

export default Home;