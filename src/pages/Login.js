import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    async function fazerLogin(e) {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    senha,
                }),
            });

            if (!response.ok) {
                alert("E-mail ou senha inválidos");
                return;
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("usuarioNome", data.nome);
            localStorage.setItem("usuarioEmail", data.email);
            localStorage.setItem("usuarioRole", data.role);
            localStorage.setItem("logado", "true");

            navigate("/home");
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Erro ao conectar com o servidor");
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Igreja360</h1>
                <p className="subtitle">Acesse sua igreja</p>

                <form onSubmit={fazerLogin}>
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />

                    <button type="submit">Entrar</button>
                </form>
            </div>
        </div>
    );
}

export default Login;