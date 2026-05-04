import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Membros from "./pages/Membros";
import Celulas from "./pages/Celulas";
import Ministerios from "./pages/Ministerios";
import EscalasMinisterios from "./pages/EscalasMinisterios";
import Financeiro from "./pages/Financeiro";
import LancamentoFinanceiro from "./pages/LancamentoFinanceiro";
import RelatorioFinanceiro from "./pages/RelatorioFinanceiro";
import "./App.css";

const API_URL = "https://igreja-backend-eyfg.onrender.com";

function PrivateRoute({ children }) {
    const logado = localStorage.getItem("logado");

    return logado ? children : <Navigate to="/" />;
}

function App() {
    const [backendAcordando, setBackendAcordando] = useState(false);

    useEffect(() => {
        const acordarBackend = async () => {
            setBackendAcordando(true);

            try {
                await fetch(`${API_URL}/ministerios`);
            } catch (error) {
                console.log("Servidor ainda acordando...");
            } finally {
                setTimeout(() => {
                    setBackendAcordando(false);
                }, 8000);
            }
        };

        acordarBackend();
    }, []);

    return (
        <BrowserRouter>
            {backendAcordando && (
                <div className="server-wakeup-alert">
                    Servidor iniciando... os dados podem levar alguns segundos para carregar.
                </div>
            )}

            <Routes>
                <Route path="/" element={<Login />} />

                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/membros"
                    element={
                        <PrivateRoute>
                            <Membros />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/celulas"
                    element={
                        <PrivateRoute>
                            <Celulas />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/ministerios"
                    element={
                        <PrivateRoute>
                            <Ministerios />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/ministerios/:ministerioId/escalas"
                    element={
                        <PrivateRoute>
                            <EscalasMinisterios />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/financeiro"
                    element={
                        <PrivateRoute>
                            <Financeiro />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/financeiro/:tipo"
                    element={
                        <PrivateRoute>
                            <LancamentoFinanceiro />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/financeiro/relatorio"
                    element={
                        <PrivateRoute>
                            <RelatorioFinanceiro />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;