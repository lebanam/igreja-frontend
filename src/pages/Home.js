import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: "40px" }}>
            <h1>Sistema Igreja</h1>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                marginTop: "30px"
            }}>

                <div className="card" onClick={() => navigate("/cadastro")}>
                    Cadastro de Membros
                </div>

                <div className="card" onClick={() => navigate("/lista")}>
                    Consultar Membros
                </div>

                <div className="card">Status</div>
                <div className="card">Histórico</div>
                <div className="card">Relatórios</div>

            </div>
        </div>
    );
}

export default Home;