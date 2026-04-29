import { useState } from "react";

function CadastroMembro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");


    const salvar = async () => {
        if (!nome || !email || !cpf) {
            alert("Preencha todos os campos!");
            return;
        }

        if (!validarEmail(email)) {
            alert("Email inválido");
            return;
        }

        if (cpf.length !== 14) {
            alert("CPF inválido");
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

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text);
            }

            alert("Membro cadastrado com sucesso!");

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
                    onChange={(e) => setCpf(formatarCPF(e.target.value))}
                    maxLength={14}
                />
            </div>

            <div style={{ marginTop: "20px" }}>
                <button className="primary-button" onClick={salvar}>
                    Salvar
                </button>
            </div>

        </div>
    );
}

function formatarCPF(valor) {
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return valor;
}

function validarEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

export default CadastroMembro;