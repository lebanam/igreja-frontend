import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LogIn,
    UserPlus,
    Mail,
    Lock,
    User,
    Phone,
    Calendar,
    MapPin,
    AtSign,
    Heart,
    Users,
} from "lucide-react";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [modoCadastro, setModoCadastro] = useState(false);

    // LOGIN
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    // CADASTRO
    const [nomeCadastro, setNomeCadastro] = useState("");
    const [telefoneCadastro, setTelefoneCadastro] = useState("");
    const [emailCadastro, setEmailCadastro] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [sexo, setSexo] = useState("");
    const [estadoCivil, setEstadoCivil] = useState("");
    const [endereco, setEndereco] = useState("");
    const [instagram, setInstagram] = useState("");
    const [tipoCadastro, setTipoCadastro] = useState("MEMBRO");
    const [senhaCadastro, setSenhaCadastro] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [loading, setLoading] = useState(false);

    async function fazerLogin(e) {
        e.preventDefault();

        try {
            setLoading(true);

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
                const erro = await response.text();
                alert(erro || "E-mail ou senha inválidos");
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
        } finally {
            setLoading(false);
        }
    }

    async function fazerCadastro(e) {
        e.preventDefault();

        if (senhaCadastro !== confirmarSenha) {
            alert("As senhas não coincidem");
            return;
        }

        if (senhaCadastro.length < 6) {
            alert("A senha deve possuir no mínimo 6 caracteres");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nomeCadastro,
                    telefone: telefoneCadastro,
                    email: emailCadastro,
                    dataNascimento,
                    sexo,
                    estadoCivil,
                    endereco,
                    instagram,
                    tipoCadastro,
                    senha: senhaCadastro,
                }),
            });

            if (!response.ok) {
                const erro = await response.text();
                alert(erro || "Erro ao criar cadastro");
                return;
            }

            const data = await response.json();

            alert(
                data.mensagem ||
                "Cadastro enviado com sucesso. Aguarde aprovação da administração."
            );

            setModoCadastro(false);

            setEmail(emailCadastro);
            setSenha("");

            setNomeCadastro("");
            setTelefoneCadastro("");
            setEmailCadastro("");
            setDataNascimento("");
            setSexo("");
            setEstadoCivil("");
            setEndereco("");
            setInstagram("");
            setTipoCadastro("MEMBRO");
            setSenhaCadastro("");
            setConfirmarSenha("");
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            alert("Erro ao conectar com o servidor");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h1>Igreja360</h1>
                    <p className="subtitle">Sistema de gestão ministerial</p>
                </div>

                {!modoCadastro ? (
                    <>
                        <form onSubmit={fazerLogin} className="login-form">
                            <div className="input-group">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    placeholder="E-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    placeholder="Senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >
                                <LogIn size={18} />
                                {loading ? "Entrando..." : "Entrar"}
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>Não possui conta?</p>

                            <button
                                type="button"
                                className="switch-button"
                                onClick={() => setModoCadastro(true)}
                            >
                                <UserPlus size={16} />
                                Criar conta
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <form onSubmit={fazerCadastro} className="login-form cadastro-form">
                            <div className="input-group">
                                <User size={18} />
                                <input
                                    type="text"
                                    placeholder="Nome completo"
                                    value={nomeCadastro}
                                    onChange={(e) => setNomeCadastro(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <Phone size={18} />
                                <input
                                    type="text"
                                    placeholder="Celular"
                                    value={telefoneCadastro}
                                    onChange={(e) => setTelefoneCadastro(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    placeholder="E-mail"
                                    value={emailCadastro}
                                    onChange={(e) => setEmailCadastro(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <Calendar size={18} />
                                <input
                                    type="date"
                                    value={dataNascimento}
                                    onChange={(e) => setDataNascimento(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <Users size={18} />
                                <select
                                    value={sexo}
                                    onChange={(e) => setSexo(e.target.value)}
                                    required
                                >
                                    <option value="">Sexo</option>
                                    <option value="FEMININO">Feminino</option>
                                    <option value="MASCULINO">Masculino</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <Heart size={18} />
                                <select
                                    value={estadoCivil}
                                    onChange={(e) => setEstadoCivil(e.target.value)}
                                    required
                                >
                                    <option value="">Estado civil</option>
                                    <option value="SOLTEIRO">Solteiro(a)</option>
                                    <option value="CASADO">Casado(a)</option>
                                    <option value="DIVORCIADO">Divorciado(a)</option>
                                    <option value="VIUVO">Viúvo(a)</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <MapPin size={18} />
                                <input
                                    type="text"
                                    placeholder="Endereço"
                                    value={endereco}
                                    onChange={(e) => setEndereco(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <AtSign size={18} />
                                <input
                                    type="text"
                                    placeholder="Instagram"
                                    value={instagram}
                                    onChange={(e) => setInstagram(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <UserPlus size={18} />
                                <select
                                    value={tipoCadastro}
                                    onChange={(e) => setTipoCadastro(e.target.value)}
                                    required
                                >
                                    <option value="MEMBRO">Membro</option>
                                    <option value="VISITANTE">Visitante</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    placeholder="Senha"
                                    value={senhaCadastro}
                                    onChange={(e) => setSenhaCadastro(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    placeholder="Confirmar senha"
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >
                                <UserPlus size={18} />
                                {loading ? "Enviando cadastro..." : "Enviar cadastro"}
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>Já possui conta?</p>

                            <button
                                type="button"
                                className="switch-button"
                                onClick={() => setModoCadastro(false)}
                            >
                                <LogIn size={16} />
                                Voltar para login
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;