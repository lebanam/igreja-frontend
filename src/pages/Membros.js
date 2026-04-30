import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CadastroMembro from "./CadastroMembro";
import ListaMembros from "./ListaMembros";
import { UserPlus, List } from "lucide-react";

function Membros() {
    const navigate = useNavigate();
    const [tela, setTela] = useState(null);

    return (
        <div className="page-header">
            <h1>
                <List size={20} />
                Lista de Membros
            </h1>

            <button className="btn btn-primary" onClick={abrirFormulario}>
                <UserPlus size={18} />
                Cadastrar Membro
            </button>


            <h1 className="page-title">Membros</h1>

            {!tela && (
                <div className="card-grid">
                    <div className="menu-card" onClick={() => setTela("cadastro")}>
                        <div className="menu-icon">➕</div>
                        <strong>Cadastrar</strong>
                    </div>

                    <div className="menu-card" onClick={() => setTela("lista")}>
                        <div className="menu-icon">📋</div>
                        <strong>Listar</strong>
                    </div>
                </div>
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