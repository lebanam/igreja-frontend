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
    const [gc, setGc] = useState("");
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
            console.error("Erro ao carregar células:", error);
            alert("Erro ao carregar células");
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
        setGc("");
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

        const dados = {
            nome,
            email,
            cpf,
            telefone,
            batizado,
            membroDesde: membroDesde || null,
            gc,
            voluntario
        };

        try {
            const response = await fetch(`${API_URL}/membros`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const text = await response.text();

            if (!response.ok) {
                console.error("Erro ao salvar membro:", text);
                throw new Error("Erro ao salvar membro");
            }

            alert("Membro cadastrado com sucesso!");
            limparFormulario();
        } catch (error) {
            console.error("Erro ao cadastrar membro:", error);
            alert(error.message);
        }
    };

    return (
        <div className="form-card">
            <h2>Cadastro de Membro</h2>

            <input
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
            />

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(formatarCPF(e.target.value))}
                maxLength={14}
            />

            <input
                placeholder="Telefone"
                value={telefone}
                maxLength={15}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
            />

            <label className="checkbox-field">
                <input
                    type="checkbox"
                    checked={batizado}
                    onChange={(e) => setBatizado(e.target.checked)}
                />
                <span>Batizado</span>
            </label>

            <label className="field-label">Membro desde:</label>

            <input
                type="date"
                value={membroDesde}
                onChange={(e) => setMembroDesde(e.target.value)}
            />

            <select value={gc} onChange={(e) => setGc(e.target.value)}>
                <option value="">Selecione uma célula</option>
                {celulas.map((c) => (
                    <option key={c.id} value={c.nome}>
                        {c.nome}
                    </option>
                ))}
            </select>

            <label className="checkbox-field">
                <input
                    type="checkbox"
                    checked={voluntario}
                    onChange={(e) => setVoluntario(e.target.checked)}
                />
                <span>Voluntário</span>
            </label>

            <div className="button-row">
                <button className="primary-button" onClick={salvar}>
                    Salvar
                </button>

                <button className="secondary-button" onClick={limparFormulario}>
                    Limpar
                </button>
            </div>
        </div>
    );
}

export default CadastroMembro;