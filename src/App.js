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
                <Route path="/ministerios" element={
                    <PrivateRoute>
                        <Ministerios />
                    </PrivateRoute> } />

                <Route path="/ministerios/:ministerioId/escalas" element={
                    <PrivateRoute>
                        <EscalasMinisterios />
                    </PrivateRoute> } />

                <Route path="/financeiro" element={
                    <PrivateRoute>
                        <Financeiro />
                    </PrivateRoute> } />

                <Route path="/financeiro/:tipo" element={<LancamentoFinanceiro />} />
                <Route path="/financeiro/relatorio" element={<RelatorioFinanceiro />} />
            </Routes>

            </BrowserRouter>
    );
}

export default App;