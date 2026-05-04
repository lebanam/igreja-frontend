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
    const [celulaIdEdit, setCelulaIdEdit] = useState("");
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
            console.error("Erro ao carregar membros:", error);
            alert("Erro ao carregar membros");
            setMembros([]);
        }
    };

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

    const iniciarEdicao = (membro) => {
        setMembroEditando(membro);
        setNomeEdit(membro.nome || "");
        setEmailEdit(membro.email || "");
        setCpfEdit(membro.cpf || "");
        setTelefoneEdit(membro.telefone || "");
        setBatizadoEdit(Boolean(membro.batizado));
        setMembroDesdeEdit(membro.membroDesde || "");
        setCelulaIdEdit(membro.celula?.id || "");
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
        setCelulaIdEdit("");
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

        const dados = {
            nome: nomeEdit,
            email: emailEdit,
            cpf: cpfEdit,
            telefone: telefoneEdit,
            batizado: batizadoEdit,
            membroDesde: membroDesdeEdit || null,
            celulaId: celulaIdEdit ? Number(celulaIdEdit) : null,
            voluntario: voluntarioEdit
        };

        try {
            const response = await fetch(`${API_URL}/membros/${membroEditando.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const text = await response.text();

            if (!response.ok) {
                console.error("Erro ao atualizar membro:", text);
                throw new Error(text || "Erro ao atualizar membro");
            }

            alert("Membro atualizado com sucesso!");
            cancelarEdicao();
            carregarMembros();
        } catch (error) {
            console.error("Erro ao salvar edição:", error);
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

            alert("Membro excluído com sucesso!");
            carregarMembros();
        } catch (error) {
            console.error("Erro ao excluir membro:", error);
            alert(error.message);
        }
    };

    return (
        <div className="page-container">
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

                    <label className="checkbox-field">
                        <input
                            type="checkbox"
                            checked={batizadoEdit}
                            onChange={(e) => setBatizadoEdit(e.target.checked)}
                        />
                        <span>Batizado</span>
                    </label>

                    <label className="field-label">Membro desde:</label>

                    <input
                        type="date"
                        value={membroDesdeEdit}
                        onChange={(e) => setMembroDesdeEdit(e.target.value)}
                    />

                    <label className="field-label">Célula:</label>

                    <select
                        value={celulaIdEdit}
                        onChange={(e) => setCelulaIdEdit(e.target.value)}
                    >
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
                            checked={voluntarioEdit}
                            onChange={(e) => setVoluntarioEdit(e.target.checked)}
                        />
                        <span>Voluntário</span>
                    </label>

                    <div className="button-row">
                        <button className="primary-button" onClick={salvarEdicao}>
                            Salvar alterações
                        </button>

                        <button className="secondary-button" onClick={cancelarEdicao}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>CPF</th>
                        <th>Telefone</th>
                        <th>Batizado</th>
                        <th>Membro desde</th>
                        <th>Célula</th>
                        <th>Voluntário</th>
                        <th>Ações</th>
                    </tr>
                    </thead>

                    <tbody>
                    {membros.map((m) => (
                        <tr key={m.id}>
                            <td>{m.id}</td>
                            <td>{m.nome}</td>
                            <td>{m.email}</td>
                            <td>{m.cpf}</td>
                            <td>{m.telefone || "-"}</td>
                            <td>{m.batizado ? "Sim" : "Não"}</td>
                            <td>{m.membroDesde || "-"}</td>
                            <td>{m.celula ? m.celula.nome : "-"}</td>
                            <td>{m.voluntario ? "Sim" : "Não"}</td>
                            <td>
                                <div className="table-actions">
                                    <button
                                        className="secondary-button"
                                        onClick={() => iniciarEdicao(m)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="danger-button"
                                        onClick={() => excluir(m.id)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListaMembros;