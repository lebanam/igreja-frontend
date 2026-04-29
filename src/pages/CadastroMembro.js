import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CadastroMembro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");

    const navigate = useNavigate();

    const salvar = async () => {
        if (!nome || !email || !cpf) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const response = await fetch("https://igreja-backend-eyfg.onrender.com/membros", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nome, email, cpf })
            });

            if (!response.ok) {
                const text = await response.text();

                if (!response.ok) {
                    throw new Error(text || "Erro ao salvar");
                }
            }

            alert("Membro cadastrado com sucesso!");

            // limpar campos
            setNome("");
            setEmail("");
            setCpf("");

        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h2>Cadastro de Membro</h2>

            <div style={{ marginTop: "20px" }}>
                <input
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
            </div>

            <div style={{ marginTop: "10px" }}>
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div style={{ marginTop: "10px" }}>
                <input
                    placeholder="CPF"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                />
            </div>

            <div style={{ marginTop: "20px" }}>
                <button onClick={salvar}>Salvar</button>
            </div>

            <div style={{ marginTop: "20px" }}>
                <button onClick={() => navigate("/")}>Voltar</button>
            </div>
        </div>
    );
}

export default CadastroMembro;