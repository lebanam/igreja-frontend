import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    Home,
    Users,
    Network,
    Music,
    CalendarDays,
    Wallet,
    Boxes,
    Settings,
    LogOut
} from "lucide-react";
import "./AppLayout.css";

function AppLayout() {
    const navigate = useNavigate();

    const usuario = JSON.parse(localStorage.getItem("usuario")) || {
        nome: "Administrador",
        role: "ADMIN"
    };

    const igreja = JSON.parse(localStorage.getItem("igreja")) || {
        nome: "Igreja360",
        logoUrl: ""
    };

    const sair = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    {igreja.logoUrl ? (
                        <img src={igreja.logoUrl} alt={igreja.nome} />
                    ) : (
                        <div className="sidebar-logo-placeholder">
                            {igreja.nome.charAt(0)}
                        </div>
                    )}

                    <div>
                        <strong>{igreja.nome}</strong>
                        <span>Gestão de Igrejas</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/home">
                        <Home size={20} />
                        Início
                    </NavLink>

                    <NavLink to="/membros">
                        <Users size={20} />
                        Membros
                    </NavLink>

                    <NavLink to="/celulas">
                        <Network size={20} />
                        Células
                    </NavLink>

                    <NavLink to="/ministerios">
                        <Music size={20} />
                        Ministérios
                    </NavLink>

                    <NavLink to="/escalas">
                        <CalendarDays size={20} />
                        Escalas
                    </NavLink>

                    <NavLink to="/financeiro">
                        <Wallet size={20} />
                        Financeiro
                    </NavLink>

                    <NavLink to="/inventario">
                        <Boxes size={20} />
                        Inventário
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <NavLink to="/configuracoes">
                        <Settings size={20} />
                        Configurações
                    </NavLink>

                    <button onClick={sair}>
                        <LogOut size={20} />
                        Sair
                    </button>
                </div>
            </aside>

            <div className="main-shell">
                <header className="topbar">
                    <div>
                        <strong>{igreja.nome}</strong>
                        <span>Sistema de gestão ministerial</span>
                    </div>

                    <div className="topbar-user">
                        <div>
                            <strong>{usuario.nome}</strong>
                            <span>{usuario.role}</span>
                        </div>

                        <div className="user-avatar">
                            {usuario.nome.charAt(0)}
                        </div>
                    </div>
                </header>

                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppLayout;