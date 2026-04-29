import { useEffect, useState } from "react";
import { API_URL } from "../config/api";
import { formatarCPF, formatarTelefone } from "../utils/formatadores";
import { validarEmail, validarCPF } from "../utils/validadores";

function ListaMembros() {
    const [membros, setMembros] = useState([]);
    const [celulas, setCelulas] = useState([]);

    const [membroEditando, setMembroEditando] = useState(null);
    const [nomeEdit, setNomeEdit] = useState("");
    const [emailEdit, setEmailEdit] = useState("");
    const [cpfEdit, setCpfEdit] = useState("");
    const [telefoneEdit, setTelefoneEdit] = useState("");
    const [batizadoEdit, setBatizadoEdit] = useState(false);
    const [membroDesdeEdit, setMembroDesdeEdit] = useState("");
    const [gcIdEdit, setGcIdEdit] = useState("");
    const [voluntarioEdit, setVoluntarioEdit] = useState(false);

    useEffect(() => {
        carregarMembros();
        carregarCelulas();
    }, []);

    const carregarMembros = async () => {
        try {
            const response = await fetch(`${API_URL}/membros`);

            if (!response.ok) {
                throw new Error("Erro ao carregar membros");
            }

            const data = await response.json();
            setMembros(Array.isArray(data) ? data : []);
        } catch (error) {
            alert(error.message);
            setMembros([]);
        }
    };

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

    const iniciarEdicao = (membro) => {
        setMembroEditando(membro);
        setNomeEdit(membro.nome || "");
        setEmailEdit(membro.email || "");
        setCpfEdit(membro.cpf || "");
        setTelefoneEdit(membro.telefone || "");
        setBatizadoEdit(Boolean(membro.batizado));
        setMembroDesdeEdit(membro.membroDesde || "");
        setGcIdEdit(membro.gc?.id ? String(membro.gc.id) : "");
        setVoluntarioEdit(Boolean(membro.voluntario));
    };

    const cancelarEdicao = () => {
        setMembroEditando(null);
        setNomeEdit("");
        setEmailEdit("");
        setCpfEdit("");
        setTelefoneEdit("");
        setBatizadoEdit(false);
        setMembroDesdeEdit("");
        setGcIdEdit("");
        setVoluntarioEdit(false);
    };

    const salvarEdicao = async () => {
        if (!nomeEdit || !emailEdit || !cpfEdit) {
            alert("Preencha nome, email e CPF!");
            return;
        }

        if (!validarEmail(emailEdit)) {
            alert("Email inválido");
            return;
        }

        if (!validarCPF(cpfEdit)) {
            alert("CPF inválido");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/membros/${membroEditando.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nomeEdit,
                    email: emailEdit,
                    cpf: cpfEdit,
                    telefone: telefoneEdit,
                    batizado: batizadoEdit,
                    membroDesde: membroDesdeEdit || null,
                    gcId: gcIdEdit ? Number(gcIdEdit) : null,
                    voluntario: voluntarioEdit
                })
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "Erro ao atualizar");
            }

            alert("Membro atualizado com sucesso!");
            cancelarEdicao();
            carregarMembros();

        } catch (error) {
            alert(error.message);
        }
    };

    const excluir = async (id) => {
        const confirmar = window.confirm("Deseja excluir este membro?");
        if (!confirmar) return;

        try {
            const response = await fetch(`${API_URL}/membros/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir membro");
            }

            carregarMembros();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h2>Lista de Membros</h2>

            {membroEditando && (
                <div className="form-card">
                    <h3>Editando membro</h3>

                    <input
                        placeholder="Nome"
                        value={nomeEdit}
                        onChange={(e) => setNomeEdit(e.target.value)}
                    />

                    <input
                        placeholder="Email"
                        value={emailEdit}
                        onChange={(e) => setEmailEdit(e.target.value)}
                    />

                    <input
                        placeholder="CPF"
                        value={cpfEdit}
                        maxLength={14}
                        onChange={(e) => setCpfEdit(formatarCPF(e.target.value))}
                    />

                    <input
                        placeholder="Telefone"
                        value={telefoneEdit}
                        maxLength={15}
                        onChange={(e) => setTelefoneEdit(formatarTelefone(e.target.value))}
                    />

                    <label>
                        <input
                            type="checkbox"
                            checked={batizadoEdit}
                            onChange={(e) => setBatizadoEdit(e.target.checked)}
                        />
                        Batizado
                    </label>

                    <label>
                        Membro desde:
                        <input
                            type="date"
                            value={membroDesdeEdit}
                            onChange={(e) => setMembroDesdeEdit(e.target.value)}
                        />
                    </label>

                    <select value={gcIdEdit} onChange={(e) => setGcIdEdit(e.target.value)}>
                        <option value="">Selecione uma célula</option>
                        {celulas.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nome}
                            </option>
                        ))}
                    </select>

                    <label>
                        <input
                            type="checkbox"
                            checked={voluntarioEdit}
                            onChange={(e) => setVoluntarioEdit(e.target.checked)}
                        />
                        Voluntário
                    </label>

                    <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "15px" }}>
                        <button className="primary-button" onClick={salvarEdicao}>
                            Salvar alterações
                        </button>

                        <button className="secondary-button" onClick={cancelarEdicao}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                <tr>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Nome</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>CPF</th>
                    <th style={thStyle}>Telefone</th>
                    <th style={thStyle}>Batizado</th>
                    <th style={thStyle}>Membro desde</th>
                    <th style={thStyle}>GC</th>
                    <th style={thStyle}>Voluntário</th>
                    <th style={thStyle}>Ações</th>
                </tr>
                </thead>

                <tbody>
                {membros.map((m) => (
                    <tr key={m.id}>
                        <td style={tdStyle}>{m.id}</td>
                        <td style={tdStyle}>{m.nome}</td>
                        <td style={tdStyle}>{m.email}</td>
                        <td style={tdStyle}>{m.cpf}</td>
                        <td style={tdStyle}>{m.telefone || "-"}</td>
                        <td style={tdStyle}>{m.batizado ? "Sim" : "Não"}</td>
                        <td style={tdStyle}>{m.membroDesde || "-"}</td>
                        <td style={tdStyle}>{m.gc?.nome || "-"}</td>
                        <td style={tdStyle}>{m.voluntario ? "Sim" : "Não"}</td>
                        <td style={tdStyle}>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button className="secondary-button" onClick={() => iniciarEdicao(m)}>
                                    Editar
                                </button>

                                <button className="danger-button" onClick={() => excluir(m.id)}>
                                    Excluir
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

const thStyle = {
    border: "1px solid #475569",
    padding: "10px",
    textAlign: "left"
};

const tdStyle = {
    border: "1px solid #475569",
    padding: "10px"
};

export default ListaMembros;