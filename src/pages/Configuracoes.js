import { useEffect, useState } from "react";
import { Save, Building2, User, Lock } from "lucide-react";
import { API_URL } from "../config/api";
import "./Configuracoes.css";

function Configuracoes() {
    const usuarioRole = localStorage.getItem("usuarioRole");
    const isAdmin = usuarioRole === "ADMIN";

    const [carregando, setCarregando] = useState(false);
    const [salvando, setSalvando] = useState(false);

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [pastorResponsavel, setPastorResponsavel] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [endereco, setEndereco] = useState("");

    const [perfilNome, setPerfilNome] = useState(
        localStorage.getItem("usuarioNome") || ""
    );
    const [perfilEmail] = useState(
        localStorage.getItem("usuarioEmail") || ""
    );
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    useEffect(() => {
        if (isAdmin) {
            carregarConfiguracoes();
        }
    }, [isAdmin]);

    const carregarConfiguracoes = async () => {
        setCarregando(true);

        try {
            const response = await fetch(`${API_URL}/igreja`);

            if (!response.ok) {
                throw new Error("Erro ao carregar configurações da igreja");
            }

            const data = await response.json();

            setNome(data.nome || "");
            setEmail(data.email || "");
            setTelefone(data.telefone || "");
            setPastorResponsavel(data.pastorResponsavel || "");
            setLogoUrl(data.logoUrl || "");
            setEndereco(data.endereco || "");

            localStorage.setItem("igreja", JSON.stringify(data));
        } catch (error) {
            alert(error.message);
        } finally {
            setCarregando(false);
        }
    };

    const salvarConfiguracoes = async () => {
        if (!nome.trim()) {
            alert("Informe o nome da igreja");
            return;
        }

        setSalvando(true);

        const dados = {
            nome: nome.trim(),
            email,
            telefone,
            pastorResponsavel,
            logoUrl,
            endereco
        };

        try {
            const response = await fetch(`${API_URL}/igreja`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "Erro ao salvar configurações");
            }

            const igrejaAtualizada = JSON.parse(text);
            localStorage.setItem("igreja", JSON.stringify(igrejaAtualizada));

            alert("Configurações salvas com sucesso!");
            window.location.reload();
        } catch (error) {
            alert(error.message);
        } finally {
            setSalvando(false);
        }
    };

    const salvarPerfil = async () => {
        if (!perfilNome.trim()) {
            alert("Informe seu nome");
            return;
        }

        localStorage.setItem("usuarioNome", perfilNome.trim());

        alert("Perfil atualizado localmente. Depois vamos conectar isso ao backend.");
        window.location.reload();
    };

    const alterarSenha = async () => {
        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            alert("Preencha todos os campos de senha");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            alert("A nova senha e a confirmação não coincidem");
            return;
        }

        if (novaSenha.length < 6) {
            alert("A nova senha deve ter no mínimo 6 caracteres");
            return;
        }

        alert("Próximo passo: criar endpoint no backend para alteração real da senha.");
    };

    if (!isAdmin) {
        return (
            <div className="page">
                <h1 className="page-title">
                    <User size={24} />
                    Meu Perfil
                </h1>

                <div className="configuracoes-grid">
                    <div className="form-card configuracoes-card">
                        <h2>Dados da conta</h2>

                        <input
                            placeholder="Nome"
                            value={perfilNome}
                            onChange={(e) => setPerfilNome(e.target.value)}
                        />

                        <input
                            placeholder="Email"
                            value={perfilEmail}
                            disabled
                        />

                        <input
                            placeholder="Perfil"
                            value={usuarioRole}
                            disabled
                        />

                        <div className="button-row">
                            <button
                                className="primary-button"
                                onClick={salvarPerfil}
                            >
                                <Save size={18} />
                                Salvar perfil
                            </button>
                        </div>
                    </div>

                    <div className="form-card configuracoes-card">
                        <h2>Alterar senha</h2>

                        <input
                            type="password"
                            placeholder="Senha atual"
                            value={senhaAtual}
                            onChange={(e) => setSenhaAtual(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Nova senha"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Confirmar nova senha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                        />

                        <div className="button-row">
                            <button
                                className="primary-button"
                                onClick={alterarSenha}
                            >
                                <Lock size={18} />
                                Alterar senha
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <h1 className="page-title">
                <Building2 size={24} />
                Configurações da Igreja
            </h1>

            {carregando ? (
                <p>Carregando configurações...</p>
            ) : (
                <div className="configuracoes-grid">
                    <div className="form-card configuracoes-card">
                        <h2>Dados da igreja</h2>

                        <input
                            placeholder="Nome da igreja"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            placeholder="Telefone"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                        />

                        <input
                            placeholder="Pastor responsável"
                            value={pastorResponsavel}
                            onChange={(e) => setPastorResponsavel(e.target.value)}
                        />

                        <textarea
                            placeholder="Endereço"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                        />

                        <div className="button-row">
                            <button
                                className="primary-button"
                                onClick={salvarConfiguracoes}
                                disabled={salvando}
                            >
                                <Save size={18} />
                                {salvando ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </div>

                    <div className="form-card configuracoes-card">
                        <h2>Logo da igreja</h2>

                        <input
                            placeholder="URL da logo"
                            value={logoUrl}
                            onChange={(e) => setLogoUrl(e.target.value)}
                        />

                        <div className="logo-preview">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo da igreja" />
                            ) : (
                                <div className="logo-placeholder">
                                    {nome ? nome.charAt(0).toUpperCase() : "I"}
                                </div>
                            )}
                        </div>

                        <p className="configuracoes-info">
                            Por enquanto, informe uma URL de imagem. Depois podemos evoluir para upload real da logo.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Configuracoes;