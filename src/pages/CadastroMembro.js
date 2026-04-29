import { useEffect, useState } from "react";
import { API_URL } from "../config/api";
import { formatarCPF, formatarTelefone } from "../utils/formatadores";
import { validarEmail, validarCPF } from "../utils/validadores";

function CadastroMembro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [telefone, setTelefone] = useState("");
    const [batizado, setBatizado] = useState(false);
    const [membroDesde, setMembroDesde] = useState("");
    const [gcId, setGcId] = useState("");
    const [voluntario, setVoluntario] = useState(false);
    const [celulas, setCelulas] = useState([]);

    useEffect(() => {
        carregarCelulas();
    }, []);

    const carregarCelulas = async () => {
        try {
            const response = await fetch(`${API_URL}/celulas`);

            if (!response.ok) {
                throw new Error("Erro ao carregar células");
            }

            const data = await response.json();
            setCelulas(Array.isArray(data) ? data : []);
        } catch (error) {
            alert(error.message);
            setCelulas([]);
        }
    };

    const limparFormulario = () => {
        setNome("");
        setEmail("");
        setCpf("");
        setTelefone("");
        setBatizado(false);
        setMembroDesde("");
        setGcId("");
        setVoluntario(false);
    };

    const salvar = async () => {
        if (!nome || !email || !cpf) {
            alert("Preencha nome, email e CPF!");
            return;
        }

        if (!validarEmail(email)) {
            alert("Email inválido");
            return;
        }

        if (!validarCPF(cpf)) {
            alert("CPF inválido");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/membros`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    email,
                    cpf,
                    telefone,
                    batizado,
                    membroDesde: membroDesde || null,
                    gcId: gcId ? Number(gcId) : null,
                    voluntario
                })
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "Erro ao salvar membro");
            }

            alert("Membro cadastrado com sucesso!");
            limparFormulario();

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

            <div style={{ marginTop: "10px" }}>
                <input
                    placeholder="Telefone"
                    value={telefone}
                    maxLength={15}
                    onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                />
            </div>

            <div style={{ marginTop: "10px" }}>
                <label>
                    <input
                        type="checkbox"
                        checked={batizado}
                        onChange={(e) => setBatizado(e.target.checked)}
                    />
                    Batizado
                </label>
            </div>

            <div style={{ marginTop: "10px" }}>
                <label>
                    Membro desde:
                    <input
                        type="date"
                        value={membroDesde}
                        onChange={(e) => setMembroDesde(e.target.value)}
                    />
                </label>
            </div>

            <div style={{ marginTop: "10px" }}>
                <select value={gcId} onChange={(e) => setGcId(e.target.value)}>
                    <option value="">Selecione uma célula</option>
                    {celulas.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nome}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ marginTop: "10px" }}>
                <label>
                    <input
                        type="checkbox"
                        checked={voluntario}
                        onChange={(e) => setVoluntario(e.target.checked)}
                    />
                    Voluntário
                </label>
            </div>

            <div style={{ marginTop: "20px" }}>
                <button className="primary-button" onClick={salvar}>
                    Salvar
                </button>
            </div>
        </div>
    );
}

export default CadastroMembro;