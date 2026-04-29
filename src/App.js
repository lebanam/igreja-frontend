import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CadastroMembro from "./pages/CadastroMembro";
import ListaMembros from "./pages/ListaMembros";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cadastro" element={<CadastroMembro />} />
                <Route path="/lista" element={<ListaMembros />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;