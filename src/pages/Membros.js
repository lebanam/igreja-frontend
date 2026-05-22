import { useState } from "react";
import CadastroMembro from "./CadastroMembro";
import ListaMembros from "./ListaMembros";
import CadastrosPendentes from "./CadastrosPendentes";
import {
    UserPlus,
    List,
    Clock3,
} from "lucide-react";

function Membros() {
    const [tela, setTela] = useState(null);

    return (
        <div className="page">
            <h1 className="page-title">
                Membros
            </h1>

            {!tela && (
                <div className="card-grid">

                    <div
                        className="menu-card"
                        onClick={() => setTela("cadastro")}
                    >
                        <div className="menu-icon">
                            <UserPlus size={28} />
                        </div>

                        <strong>Cadastrar</strong>
                    </div>

                    <div
                        className="menu-card"
                        onClick={() => setTela("lista")}
                    >
                        <div className="menu-icon">
                            <List size={28} />
                        </div>

                        <strong>Listar</strong>
                    </div>

                    <div
                        className="menu-card"
                        onClick={() => setTela("pendentes")}
                    >
                        <div className="menu-icon">
                            <Clock3 size={28} />
                        </div>

                        <strong>Cadastros Pendentes</strong>
                    </div>

                </div>
            )}

            {tela && (
                <button
                    className="back-button"
                    onClick={() => setTela(null)}
                >
                    Voltar para Membros
                </button>
            )}

            {tela === "cadastro" && <CadastroMembro />}
            {tela === "lista" && <ListaMembros />}
            {tela === "pendentes" && <CadastrosPendentes />}
        </div>
    );
}

export default Membros;