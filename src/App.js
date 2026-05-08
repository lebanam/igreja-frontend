import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Membros from "./pages/Membros";
import Celulas from "./pages/Celulas";
import Ministerios from "./pages/Ministerios";
import EscalasMinisterios from "./pages/EscalasMinisterios";
import Financeiro from "./pages/Financeiro";
import LancamentoFinanceiro from "./pages/LancamentoFinanceiro";
import RelatorioFinanceiro from "./pages/RelatorioFinanceiro";
import Inventario from "./pages/Inventario";

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
                    element={
                        <PrivateRoute>
                            <AppLayout />
                        </PrivateRoute>
                    }
                >
                    <Route path="/home" element={<Home />} />
                    <Route path="/membros" element={<Membros />} />
                    <Route path="/celulas" element={<Celulas />} />
                    <Route path="/ministerios" element={<Ministerios />} />
                    <Route
                        path="/ministerios/:ministerioId/escalas"
                        element={<EscalasMinisterios />}
                    />
                    <Route path="/financeiro" element={<Financeiro />} />
                    <Route
                        path="/financeiro/relatorio"
                        element={<RelatorioFinanceiro />}
                    />
                    <Route
                        path="/financeiro/:tipo"
                        element={<LancamentoFinanceiro />}
                    />
                    <Route path="/inventario" element={<Inventario />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;