import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Style/Avaliacoes.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";

const Avaliacoes = ({jogoId}) => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [avaliacaoTexto, setAvaliacaoTexto] = useState("");
  const [estrelas, setEstrelas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editarAvaliacaoId, setEditarAvaliacaoId] = useState(null);

 

  
  const { currentUser } = useSelector((state) => state.userReducer); // Usuário atual
  const ID = currentUser?.id;
  const Nome = currentUser?.nome;
  const Tipo = currentUser?.TipoAdm === true;



 const API_URL = "http://localhost:5000/avaliacoes";

  function notify(x) {
    if (x === 0) {
      toast.success("Avaliação excluída!", {
        position: "top-center",
        autoClose: 2500,
        theme: "dark",
      });
    }

    if (x === 1) {
      toast.success("Avaliação enviada com sucesso!", {
        position: "top-center",
        autoClose: 2500,
        theme: "dark",
      });
    }

    if (x === 2) {
      toast.success("Avaliação atualizada!", {
        position: "top-center",
        autoClose: 2500,
        theme: "dark",
      });
    }
  }

  const fetchAvaliacoes = async () => {
    try {
      const response = await axios.get(API_URL);
      setAvaliacoes(response.data.filter(item => item.JogoId.toString() === jogoId.toString()));
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
    } finally {
      setLoading(false); // Certifique-se de desativar o loading
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (avaliacaoTexto.trim() === "" || estrelas <= 0) {
      alert("Preencha todos os campos antes de enviar!");
      return;
    }

    try {
      if (editarAvaliacaoId) {
        await axios.put(`${API_URL}/${editarAvaliacaoId}`, {
          texto: avaliacaoTexto,
          estrelas,
          JogoId: jogoId,
          usuario: Nome,
          IdUsuario: ID,
        });
        notify(2);
        setEditarAvaliacaoId(null);


      } else {
        await axios.post(API_URL, {
          JogoId: jogoId,
          usuario: Nome,
          texto: avaliacaoTexto,
          estrelas,
          IdUsuario: ID,
        });
        notify(1);
      }
      setAvaliacaoTexto("");
      setEstrelas(0);
      fetchAvaliacoes(); // Atualiza as avaliações
    } catch (error) {
      console.error("Erro ao enviar/atualizar avaliação:", error);
      alert("Erro ao enviar/atualizar avaliação.");
    }
  };

  const handleEdit = (avaliacoes) => {
    setEditarAvaliacaoId(avaliacoes.id);
    setAvaliacaoTexto(avaliacoes.texto);
    setEstrelas(avaliacoes.estrelas);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      notify(0);
      setAvaliacoes(avaliacoes.filter((avaliacoes) => avaliacoes.id !== id));
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
      alert("Erro ao excluir avaliação.");
    }
  };

  useEffect(() => {
    fetchAvaliacoes();
  }, [jogoId]);

  return (
    <div className="avaliacoes-container">
      <h2>Avaliações</h2>
      {loading ? (
        <p>Carregando avaliações...</p>
      ) : avaliacoes.length === 0 ? (
        <p>Sem avaliações para este jogo.</p>
      ) : (
        <ul>
          {avaliacoes.map((avaliacoes) => (
            <li key={avaliacoes.id}>
              <strong>{avaliacoes.usuario}</strong>: {" "}
              <span>
                {"★".repeat(avaliacoes.estrelas)}
                {"☆".repeat(5 - avaliacoes.estrelas)}
              </span>
              <p>{avaliacoes.texto}</p>


              {avaliacoes.IdUsuario === ID ? ( // Somente a pessoa que fez o comentário pode editá-lo ou apagá-lo (exceto adm)
              <>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleEdit(avaliacoes)}
                >
                  Editar
                </button>
                
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(avaliacoes.id)}
                >
                  Excluir
                </button>
              </>
            ) : (Tipo ? (
              <>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(avaliacoes.id)}
                >
                  Excluir
                </button>
              </>
            ) : null)}


            </li>
          ))}
        </ul>
      )}

      <div className="avaliacoes-formulario">
        <h3>{editarAvaliacaoId ? "Editar Avaliação" : "Adicionar Avaliação"}</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={avaliacaoTexto}
            onChange={(e) => setAvaliacaoTexto(e.target.value)}
            placeholder="Escreva sua avaliação..."
            rows="4"
            required
          ></textarea>
          <br />
          <label>
            Estrelas:
            <input
              type="number"
              value={estrelas}
              onChange={(e) => setEstrelas(Number(e.target.value))}
              min={1}
              max={5}
              required
            />
          </label>
          <br />
          <div className="botoes-container">
            <button type="submit">
              {editarAvaliacaoId ? "Atualizar Avaliação" : "Enviar Avaliação"}
            </button>
            {editarAvaliacaoId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditarAvaliacaoId(null);
                  setAvaliacaoTexto("");
                  setEstrelas(0);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Avaliacoes;
