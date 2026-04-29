import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ListaMembros() {
    const [membros, setMembros] = useState([]);
    const navigate = useNavigate();

    // ✅ FUNÇÃO DEFINIDA AQUI (IMPORTANTE)
    const carregarMembros = async () => {
        try {
            const response = await fetch("https://igreja-backend-eyfg.onrender.com/membros");
            const data = await response.json();
            setMembros(data);
        } catch (error) {
            alert("Erro ao carregar membros");
        }
    };

    useEffect(() => {
        carregarMembros();
    }, []);

    const editar = (membro) => {
        const novoNome = prompt("Novo nome:", membro.nome);
        const novoEmail = prompt("Novo email:", membro.email);
        const novoCpf = prompt("Novo CPF:", membro.cpf);

        if (!novoNome || !novoEmail || !novoCpf) {
            alert("Todos os campos são obrigatórios");
            return;
        }

        atualizar(membro.id, novoNome, novoEmail, novoCpf);
    };

    const atualizar = async (id, nome, email, cpf) => {
        try {
            const response = await fetch(`https://igreja-backend-eyfg.onrender.com/membros/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nome, email, cpf })
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "Erro ao atualizar");
            }

            carregarMembros();

        } catch (error) {
            alert(error.message);
        }
    };
    const excluir = async (id) => {
        const confirmar = window.confirm("Deseja excluir este membro?");
        if (!confirmar) return;

        try {
            await fetch(`https://igreja-backend-eyfg.onrender.com/membros/${id}`, {
                method: "DELETE"
            });

            carregarMembros(); // 🔁 recarrega lista
        } catch (error) {
            alert("Erro ao excluir membro");
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h2>Lista de Membros</h2>

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
                            <button onClick={() => editar(m)}>Editar</button>
                            <button onClick={() => excluir(m.id)}>Excluir</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{ marginTop: "20px" }}>
                <button onClick={() => navigate("/")}>Voltar</button>
            </div>
        </div>
    );
}

const thStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left"
};

const tdStyle = {
    border: "1px solid #ddd",
    padding: "10px"
};

export default ListaMembros;