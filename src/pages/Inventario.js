import { useEffect, useState } from "react";
import { Boxes } from "lucide-react";
import "./Inventario.css";

const API_URL = "https://igreja-backend-eyfg.onrender.com";

function Inventario() {
    const [categorias, setCategorias] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

    const [modoFormularioCategoria, setModoFormularioCategoria] = useState(false);
    const [modoEdicaoItens, setModoEdicaoItens] = useState(false);

    const [categoriaEditando, setCategoriaEditando] = useState(null);
    const [nomeCategoria, setNomeCategoria] = useState("");
    const [descricaoCategoria, setDescricaoCategoria] = useState("");

    const [itensEditaveis, setItensEditaveis] = useState([]);

    useEffect(() => {
        carregarCategorias();
    }, []);

    const carregarCategorias = async () => {
        try {
            const response = await fetch(`${API_URL}/inventario/categorias`);

            if (!response.ok) {
                throw new Error("Erro ao carregar inventário");
            }

            const data = await response.json();
            setCategorias(Array.isArray(data) ? data : []);
        } catch (error) {
            alert(error.message);
            setCategorias([]);
        }
    };

    const buscarCategoria = async (id) => {
        const response = await fetch(`${API_URL}/inventario/categorias/${id}`);

        if (!response.ok) {
            throw new Error("Erro ao buscar categoria");
        }

        return response.json();
    };

    const selecionarCategoria = (categoria) => {
        setCategoriaSelecionada(categoria);
        setItensEditaveis(Array.isArray(categoria.itens) ? categoria.itens : []);
        setModoFormularioCategoria(false);
        setModoEdicaoItens(false);
        setCategoriaEditando(null);
    };

    const abrirNovaCategoria = () => {
        setCategoriaSelecionada(null);
        setCategoriaEditando(null);
        setNomeCategoria("");
        setDescricaoCategoria("");
        setModoFormularioCategoria(true);
        setModoEdicaoItens(false);
    };

    const editarCategoria = (categoria) => {
        setCategoriaEditando(categoria);
        setNomeCategoria(categoria.nome || "");
        setDescricaoCategoria(categoria.descricao || "");
        setModoFormularioCategoria(true);
        setModoEdicaoItens(false);
    };

    const limparFormularioCategoria = () => {
        setCategoriaEditando(null);
        setNomeCategoria("");
        setDescricaoCategoria("");
        setModoFormularioCategoria(false);
    };

    const salvarCategoria = async () => {
        if (!nomeCategoria.trim()) {
            alert("Informe o nome da categoria");
            return;
        }

        const dados = {
            nome: nomeCategoria.trim(),
            descricao: descricaoCategoria
        };

        try {
            const url = categoriaEditando
                ? `${API_URL}/inventario/categorias/${categoriaEditando.id}`
                : `${API_URL}/inventario/categorias`;

            const response = await fetch(url, {
                method: categoriaEditando ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "Erro ao salvar categoria");
            }

            const categoriaSalva = JSON.parse(text);

            alert("Categoria salva com sucesso!");

            setModoFormularioCategoria(false);
            setCategoriaEditando(null);
            setNomeCategoria("");
            setDescricaoCategoria("");

            await carregarCategorias();

            const categoriaAtualizada = await buscarCategoria(categoriaSalva.id);
            setCategoriaSelecionada(categoriaAtualizada);
            setItensEditaveis(categoriaAtualizada.itens || []);
        } catch (error) {
            alert(error.message);
        }
    };

    const excluirCategoria = async (id) => {
        const confirmar = window.confirm(
            "Deseja excluir esta categoria? Todos os itens vinculados também serão excluídos."
        );

        if (!confirmar) return;

        try {
            const response = await fetch(`${API_URL}/inventario/categorias/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Erro ao excluir categoria");
            }

            alert("Categoria excluída com sucesso!");
            setCategoriaSelecionada(null);
            await carregarCategorias();
        } catch (error) {
            alert(error.message);
        }
    };

    const iniciarEdicaoItens = () => {
        setItensEditaveis(
            Array.isArray(categoriaSelecionada.itens)
                ? categoriaSelecionada.itens.map((item) => ({ ...item }))
                : []
        );

        setModoEdicaoItens(true);
        setModoFormularioCategoria(false);
    };

    const cancelarEdicaoItens = () => {
        setItensEditaveis(
            Array.isArray(categoriaSelecionada.itens)
                ? categoriaSelecionada.itens
                : []
        );

        setModoEdicaoItens(false);
    };

    const adicionarItemLocal = () => {
        setItensEditaveis((itens) => [
            ...itens,
            {
                id: null,
                nome: "",
                quantidade: 0,
                observacao: ""
            }
        ]);
    };

    const atualizarItem = (index, campo, valor) => {
        setItensEditaveis((itens) =>
            itens.map((item, itemIndex) =>
                itemIndex === index
                    ? { ...item, [campo]: valor }
                    : item
            )
        );
    };

    const alterarQuantidade = (index, valor) => {
        setItensEditaveis((itens) =>
            itens.map((item, itemIndex) => {
                if (itemIndex !== index) return item;

                return {
                    ...item,
                    quantidade: Math.max(0, Number(item.quantidade || 0) + valor)
                };
            })
        );
    };

    const removerItemLocal = async (item, index) => {
        if (!item.id) {
            setItensEditaveis((itens) =>
                itens.filter((_, itemIndex) => itemIndex !== index)
            );
            return;
        }

        const confirmar = window.confirm("Deseja excluir este item?");
        if (!confirmar) return;

        try {
            const response = await fetch(`${API_URL}/inventario/itens/${item.id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Erro ao excluir item");
            }

            const categoriaAtualizada = await buscarCategoria(categoriaSelecionada.id);

            setCategoriaSelecionada(categoriaAtualizada);
            setItensEditaveis(categoriaAtualizada.itens || []);
            await carregarCategorias();
        } catch (error) {
            alert(error.message);
        }
    };

    const salvarItens = async () => {
        if (!categoriaSelecionada) return;

        const itemSemNome = itensEditaveis.some((item) => !item.nome.trim());

        if (itemSemNome) {
            alert("Todos os itens precisam ter nome");
            return;
        }

        const dados = itensEditaveis.map((item) => ({
            id: item.id,
            nome: item.nome.trim(),
            quantidade: Number(item.quantidade) || 0,
            observacao: item.observacao || ""
        }));

        try {
            const response = await fetch(
                `${API_URL}/inventario/categorias/${categoriaSelecionada.id}/itens`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dados)
                }
            );

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "Erro ao salvar itens");
            }

            alert("Itens salvos com sucesso!");

            const categoriaAtualizada = await buscarCategoria(categoriaSelecionada.id);

            setCategoriaSelecionada(categoriaAtualizada);
            setItensEditaveis(categoriaAtualizada.itens || []);
            setModoEdicaoItens(false);

            await carregarCategorias();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="page">
            <h1 className="page-title">Inventário</h1>

            <button className="primary-button" onClick={abrirNovaCategoria}>
                Nova Categoria
            </button>

            {modoFormularioCategoria && (
                <div className="form-card">
                    <h2>{categoriaEditando ? "Editar Categoria" : "Cadastrar Categoria"}</h2>

                    <input
                        placeholder="Nome da categoria"
                        value={nomeCategoria}
                        onChange={(e) => setNomeCategoria(e.target.value)}
                    />

                    <textarea
                        placeholder="Descrição"
                        value={descricaoCategoria}
                        onChange={(e) => setDescricaoCategoria(e.target.value)}
                    />

                    <div className="button-row">
                        <button className="primary-button" onClick={salvarCategoria}>
                            Salvar
                        </button>

                        <button className="secondary-button" onClick={limparFormularioCategoria}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <div className="card-grid inventario-grid">
                {categorias.map((categoria) => (
                    <div
                        key={categoria.id}
                        className="menu-card"
                        onClick={() => selecionarCategoria(categoria)}
                    >
                        <div className="menu-icon">
                            <Boxes size={28} />
                        </div>

                        <strong>{categoria.nome}</strong>
                        <p>{categoria.descricao || "Sem descrição"}</p>
                        <small>{categoria.totalItens || 0} item(ns)</small>
                    </div>
                ))}
            </div>

            {categoriaSelecionada && (
                <div className="form-card inventario-detalhe">
                    <h2>{categoriaSelecionada.nome}</h2>

                    <p>
                        <strong>Descrição:</strong>{" "}
                        {categoriaSelecionada.descricao || "Não informada"}
                    </p>

                    <div className="button-row">
                        <button
                            className="secondary-button"
                            onClick={() => editarCategoria(categoriaSelecionada)}
                        >
                            Editar Categoria
                        </button>

                        <button
                            className="danger-button"
                            onClick={() => excluirCategoria(categoriaSelecionada.id)}
                        >
                            Excluir Categoria
                        </button>

                        <button
                            className="secondary-button"
                            onClick={() => setCategoriaSelecionada(null)}
                        >
                            Fechar
                        </button>
                    </div>

                    <div className="inventario-header">
                        <h3>Itens</h3>

                        {!modoEdicaoItens && (
                            <button className="primary-button" onClick={iniciarEdicaoItens}>
                                Editar Itens
                            </button>
                        )}
                    </div>

                    {!modoEdicaoItens && (
                        <>
                            {!categoriaSelecionada.itens || categoriaSelecionada.itens.length === 0 ? (
                                <p>Nenhum item cadastrado nesta categoria.</p>
                            ) : (
                                <div className="inventario-linhas">
                                    {categoriaSelecionada.itens.map((item) => (
                                        <div key={item.id} className="inventario-linha">
                                            <div>
                                                <strong>{item.nome}</strong>
                                                {item.observacao && <small>{item.observacao}</small>}
                                            </div>

                                            <span>{item.quantidade}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {modoEdicaoItens && (
                        <>
                            <button className="primary-button" onClick={adicionarItemLocal}>
                                Novo Item
                            </button>

                            <div className="inventario-itens">
                                {itensEditaveis.map((item, index) => (
                                    <div key={item.id || index} className="inventario-item">
                                        <div className="inventario-item__main">
                                            <input
                                                placeholder="Nome do item"
                                                value={item.nome}
                                                onChange={(e) =>
                                                    atualizarItem(index, "nome", e.target.value)
                                                }
                                            />

                                            <textarea
                                                placeholder="Observação"
                                                value={item.observacao || ""}
                                                onChange={(e) =>
                                                    atualizarItem(index, "observacao", e.target.value)
                                                }
                                            />
                                        </div>

                                        <div className="inventario-item__numbers">
                                            <label>Quantidade</label>

                                            <div className="quantity-control">
                                                <button
                                                    type="button"
                                                    className="secondary-button"
                                                    onClick={() => alterarQuantidade(index, -1)}
                                                >
                                                    -
                                                </button>

                                                <span>{item.quantidade}</span>

                                                <button
                                                    type="button"
                                                    className="secondary-button"
                                                    onClick={() => alterarQuantidade(index, 1)}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                className="danger-button"
                                                onClick={() => removerItemLocal(item, index)}
                                            >
                                                Excluir Item
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="button-row">
                                <button className="primary-button" onClick={salvarItens}>
                                    Salvar Alterações
                                </button>

                                <button className="secondary-button" onClick={cancelarEdicaoItens}>
                                    Cancelar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default Inventario;