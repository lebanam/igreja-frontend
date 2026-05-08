import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, Settings, LogOut, Menu } from "lucide-react";
import "./AppLayout.css";

function AppLayout() {
    const navigate = useNavigate();

    const usuario = JSON.parse(localStorage.getItem("usuario")) || {
        nome: "Administrador",
        role: "ADMIN"
    };

    const igreja = JSON.parse(localStorage.getItem("igreja")) || {
        nome: "Minha Igreja",
        logoUrl: ""
    };

    const sair = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="app-layout">
            <div className="main-shell">
                <header className="topbar">
                    <div className="topbar-brand">
                        <strong>Igreja360</strong>
                        <span>Sistema de gestão ministerial</span>
                    </div>

                    <div className="topbar-center">
                        <button
                            className="topbar-home-button"
                            onClick={() => navigate("/home")}
                        >
                            <Home size={18} />
                            Início
                        </button>

                        <div className="topbar-church">
                            {igreja.logoUrl ? (
                                <img
                                    src={igreja.logoUrl}
                                    alt="Logo da igreja"
                                    className="topbar-church-logo"
                                />
                            ) : (
                                <div className="topbar-church-placeholder">
                                    {(igreja.nome || "I").charAt(0)}
                                </div>
                            )}

                            <strong className="topbar-church-name">
                                {igreja.nome || "Minha Igreja"}
                            </strong>
                        </div>
                    </div>

                    <div className="topbar-right">
                        <div className="topbar-user">
                            <div>
                                <strong>{usuario.nome}</strong>
                                <span>{usuario.role}</span>
                            </div>

                            <div className="user-avatar">
                                {usuario.nome.charAt(0)}
                            </div>
                        </div>

                        <div className="sidebar-header">
                            <div className="sidebar-trigger">
                                <Menu size={22} />
                            </div>

                            <div className="sidebar-dropdown">
                                <NavLink to="/home">
                                    <Home size={18} />
                                    Início
                                </NavLink>

                                <NavLink to="/configuracoes">
                                    <Settings size={18} />
                                    Configurações
                                </NavLink>

                                <button onClick={sair}>
                                    <LogOut size={18} />
                                    Sair
                                </button>
                            </div>
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