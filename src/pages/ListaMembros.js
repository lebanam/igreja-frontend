import { useEffect, useState } from "react";

function ListaMembros() {
    const [membros, setMembros] = useState([]);

    const [membroEditando, setMembroEditando] = useState(null);
    const [nomeEdit, setNomeEdit] = useState("");
    const [emailEdit, setEmailEdit] = useState("");
    const [cpfEdit, setCpfEdit] = useState("");

    function formatarCPF(valor) {
        valor = valor.replace(/\D/g, "");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return valor;
    }

    function validarEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    const carregarMembros = async () => {
        try {
            const response = await fetch("https://igreja-backend-eyfg.onrender.com/membros");

            if (!response.ok) {
                throw new Error("Erro ao carregar membros");
            }

            const data = await response.json();
            setMembros(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            alert("Erro ao carregar membros");
            setMembros([]);
        }
    };

    useEffect(() => {
        carregarMembros();
    }, []);

    const iniciarEdicao = (membro) => {
        setMembroEditando(membro);
        setNomeEdit(membro.nome);
        setEmailEdit(membro.email);
        setCpfEdit(membro.cpf);
    };

    const cancelarEdicao = () => {
        setMembroEditando(null);
        setNomeEdit("");
        setEmailEdit("");
        setCpfEdit("");
    };

    const salvarEdicao = async () => {
        if (!nomeEdit || !emailEdit || !cpfEdit) {
            alert("Todos os campos são obrigatórios");
            return;
        }

        if (!validarEmail(emailEdit)) {
            alert("Email inválido");
            return;
        }

        if (cpfEdit.length !== 14) {
            alert("CPF inválido");
            return;
        }

        try {
            const response = await fetch(
                `https://igreja-backend-eyfg.onrender.com/membros/${membroEditando.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nome: nomeEdit,
                        email: emailEdit,
                        cpf: cpfEdit
                    })
                }
            );

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
            const response = await fetch(`https://igreja-backend-eyfg.onrender.com/membros/${id}`, {
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

                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
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