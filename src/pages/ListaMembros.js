import { Fragment, useEffect, useState } from "react";
import { API_URL } from "../config/api";
import { formatarCPF, formatarTelefone } from "../utils/formatadores";
import { validarEmail, validarCPF } from "../utils/validadores";
import "./Membros.css";

function ListaMembros() {
    const [membros, setMembros] = useState([]);
    const [celulas, setCelulas] = useState([]);

    const [membroDetalhadoId, setMembroDetalhadoId] = useState(null);
    const [membroEditando, setMembroEditando] = useState(null);

    const [nomeEdit, setNomeEdit] = useState("");
    const [emailEdit, setEmailEdit] = useState("");
    const [cpfEdit, setCpfEdit] = useState("");
    const [telefoneEdit, setTelefoneEdit] = useState("");
    const [dataNascimentoEdit, setDataNascimentoEdit] = useState("");
    const [sexoEdit, setSexoEdit] = useState("");
    const [estadoCivilEdit, setEstadoCivilEdit] = useState("");
    const [enderecoEdit, setEnderecoEdit] = useState("");
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

    const formatarData = (data) => {
        if (!data) return "-";
        return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
    };

    const formatarOpcao = (valor) => {
        if (!valor) return "-";

        const texto = valor.toLowerCase().replace("_", " ");

        return texto.charAt(0).toUpperCase() + texto.slice(1);
    };

    const iniciarEdicao = (membro) => {
        setMembroEditando(membro);
        setMembroDetalhadoId(null);

        setNomeEdit(membro.nome || "");
        setEmailEdit(membro.email || "");
        setCpfEdit(membro.cpf || "");
        setTelefoneEdit(membro.telefone || "");
        setDataNascimentoEdit(membro.dataNascimento || "");
        setSexoEdit(membro.sexo || "");
        setEstadoCivilEdit(membro.estadoCivil || "");
        setEnderecoEdit(membro.endereco || "");
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
        setDataNascimentoEdit("");
        setSexoEdit("");
        setEstadoCivilEdit("");
        setEnderecoEdit("");
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
            dataNascimento: dataNascimentoEdit || null,
            sexo: sexoEdit || null,
            estadoCivil: estadoCivilEdit || null,
            endereco: enderecoEdit,
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
            setMembroDetalhadoId(null);
            carregarMembros();
        } catch (error) {
            console.error("Erro ao excluir membro:", error);
            alert(error.message);
        }
    };

    const alternarDetalhes = (id) => {
        setMembroDetalhadoId(membroDetalhadoId === id ? null : id);
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

                    <label className="field-label">Data de nascimento:</label>
                    <input
                        type="date"
                        value={dataNascimentoEdit}
                        onChange={(e) => setDataNascimentoEdit(e.target.value)}
                    />

                    <select value={sexoEdit} onChange={(e) => setSexoEdit(e.target.value)}>
                        <option value="">Sexo</option>
                        <option value="FEMININO">Feminino</option>
                        <option value="MASCULINO">Masculino</option>
                    </select>

                    <select
                        value={estadoCivilEdit}
                        onChange={(e) => setEstadoCivilEdit(e.target.value)}
                    >
                        <option value="">Estado civil</option>
                        <option value="SOLTEIRO">Solteiro(a)</option>
                        <option value="CASADO">Casado(a)</option>
                        <option value="DIVORCIADO">Divorciado(a)</option>
                        <option value="VIUVO">Viúvo(a)</option>
                    </select>

                    <textarea
                        placeholder="Endereço"
                        value={enderecoEdit}
                        onChange={(e) => setEnderecoEdit(e.target.value)}
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
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Idade</th>
                        <th>Sexo</th>
                        <th>Batizado</th>
                        <th>Célula</th>
                        <th>Voluntário</th>
                        <th>Detalhes</th>
                    </tr>
                    </thead>

                    <tbody>
                    {membros.map((m) => (
                        <Fragment key={m.id}>
                            <tr>
                                <td>{m.nome}</td>
                                <td>{m.email}</td>
                                <td>{m.telefone || "-"}</td>
                                <td>{m.idade ?? "-"}</td>
                                <td>{formatarOpcao(m.sexo)}</td>
                                <td>{m.batizado ? "Sim" : "Não"}</td>
                                <td>{m.celula ? m.celula.nome : "-"}</td>
                                <td>{m.voluntario ? "Sim" : "Não"}</td>
                                <td>
                                    <button
                                        className="secondary-button"
                                        onClick={() => alternarDetalhes(m.id)}
                                    >
                                        {membroDetalhadoId === m.id ? "Fechar" : "Detalhes"}
                                    </button>
                                </td>
                            </tr>

                            {membroDetalhadoId === m.id && (
                                <tr className="detalhe-row">
                                    <td colSpan="9">
                                        <div className="detalhe-card">
                                            <h3>{m.nome}</h3>

                                            <p><strong>Email:</strong> {m.email}</p>
                                            <p><strong>CPF:</strong> {m.cpf}</p>
                                            <p><strong>Telefone:</strong> {m.telefone || "-"}</p>
                                            <p><strong>Data de nascimento:</strong> {formatarData(m.dataNascimento)}</p>
                                            <p><strong>Idade:</strong> {m.idade ?? "-"}</p>
                                            <p><strong>Sexo:</strong> {formatarOpcao(m.sexo)}</p>
                                            <p><strong>Estado civil:</strong> {formatarOpcao(m.estadoCivil)}</p>
                                            <p><strong>Endereço:</strong> {m.endereco || "-"}</p>
                                            <p><strong>Batizado:</strong> {m.batizado ? "Sim" : "Não"}</p>
                                            <p><strong>Membro desde:</strong> {formatarData(m.membroDesde)}</p>
                                            <p><strong>Célula:</strong> {m.celula ? m.celula.nome : "-"}</p>
                                            <p><strong>Voluntário:</strong> {m.voluntario ? "Sim" : "Não"}</p>

                                            <div className="button-row">
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
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListaMembros;