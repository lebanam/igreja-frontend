import { useEffect, useState } from "react";
import { API_URL } from "../config/api";
import { formatarTelefone } from "../utils/formatadores";
import { validarEmail } from "../utils/validadores";

function CadastroMembro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [sexo, setSexo] = useState("");
    const [estadoCivil, setEstadoCivil] = useState("");
    const [endereco, setEndereco] = useState("");
    const [batizado, setBatizado] = useState(false);
    const [membroDesde, setMembroDesde] = useState("");
    const [celulaId, setCelulaId] = useState("");
    const [voluntario, setVoluntario] = useState(false);
    const [celulas, setCelulas] = useState([]);

    useEffect(() => {
        carregarCelulas();
    }, []);

    const carregarCelulas = async () => {
        try {
            const response = await fetch(`${API_URL}/celulas/resumo`);

            if (!response.ok) {
                throw new Error("Erro ao carregar células");
            }

            const data = await response.json();
            setCelulas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao carregar células:", error);
            setCelulas([]);
        }
    };

    const limparFormulario = () => {
        setNome("");
        setEmail("");
        setTelefone("");
        setDataNascimento("");
        setSexo("");
        setEstadoCivil("");
        setEndereco("");
        setBatizado(false);
        setMembroDesde("");
        setCelulaId("");
        setVoluntario(false);
    };

    const salvar = async () => {
        if (!nome || !email ) {
            alert("Preencha nome e email!");
            return;
        }

        if (!validarEmail(email)) {
            alert("Email inválido");
            return;
        }

        const dados = {
            nome,
            email,
            telefone,
            dataNascimento: dataNascimento || null,
            sexo: sexo || null,
            estadoCivil: estadoCivil || null,
            endereco,
            batizado,
            membroDesde: membroDesde || null,
            celulaId: celulaId ? Number(celulaId) : null,
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
                throw new Error(text || "Erro ao salvar membro");
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
                placeholder="Telefone"
                value={telefone}
                maxLength={15}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
            />

            <label className="field-label">Data de nascimento:</label>
            <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
            />

            <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
                <option value="">Sexo</option>
                <option value="FEMININO">Feminino</option>
                <option value="MASCULINO">Masculino</option>
            </select>

            <select value={estadoCivil} onChange={(e) => setEstadoCivil(e.target.value)}>
                <option value="">Estado civil</option>
                <option value="SOLTEIRO">Solteiro(a)</option>
                <option value="CASADO">Casado(a)</option>
                <option value="DIVORCIADO">Divorciado(a)</option>
                <option value="VIUVO">Viúvo(a)</option>
            </select>

            <textarea
                placeholder="Endereço"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
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

            <label className="field-label">Célula:</label>

            <select value={celulaId} onChange={(e) => setCelulaId(e.target.value)}>
                <option value="">Sem célula</option>

                {celulas.map((celula) => (
                    <option key={celula.id} value={celula.id}>
                        {celula.nome}
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