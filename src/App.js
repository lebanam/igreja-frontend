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
import Configuracoes from "./pages/Configuracoes";
import Dashboard from "./pages/Dashboard";

import "./App.css";

function PrivateRoute({ children }) {
    const logado = localStorage.getItem("logado");

    return logado ? children : <Navigate to="/" />;
}

function App() {
    return (
        <BrowserRouter>
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

                    <Route
                        path="/configuracoes"
                        element={<Configuracoes />}
                    />
                </Route>
                <Route path="/dashboard" element={<Dashboard />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;