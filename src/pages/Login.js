import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    function fazerLogin(e) {
        e.preventDefault();

        if (email === "admin@igreja360.com" && senha === "123456") {
            localStorage.setItem("logado", "true");
            navigate("/home");
        } else {
            alert("E-mail ou senha inválidos");
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