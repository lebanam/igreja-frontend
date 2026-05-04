import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CadastroMembro from "./CadastroMembro";
import ListaMembros from "./ListaMembros";
import { UserPlus, List } from "lucide-react";

function Membros() {
    const [tela, setTela] = useState(null);
    const navigate = useNavigate();

    return (
        <div className="page">
            <h1 className="page-title">
                <List size={24} />
                Membros
            </h1>

            {!tela && (
                <>
                    {/* BOTÃO INÍCIO */}
                    <button className="back-button" onClick={() => navigate("/home")}>
                       Início
                    </button>

                    <div className="card-grid">
                        <div className="menu-card" onClick={() => setTela("cadastro")}>
                            <div className="menu-icon">
                                <UserPlus size={28} />
                            </div>
                            <strong>Cadastrar</strong>
                        </div>

                        <div className="menu-card" onClick={() => setTela("lista")}>
                            <div className="menu-icon">
                                <List size={28} />
                            </div>
                            <strong>Listar</strong>
                        </div>
                    </div>
                </>
            )}

            {tela && (
                <button className="back-button" onClick={() => setTela(null)}>
                    Voltar para Membros
                </button>
            )}

            {tela === "cadastro" && <CadastroMembro />}
            {tela === "lista" && <ListaMembros />}
        </div>
    );
}

export default Membros;