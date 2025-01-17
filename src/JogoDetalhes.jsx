import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavbarInterna from "./assets/navbarInterna";
import Avaliacoes from "./assets/Avaliacoes";
import "./Style/JogoDetalhes.css";
import axios from "axios";


function JogoDetalhes() {
  const{id} = useParams();
  const[jogo, setJogo] = useState(null);
  const[loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const response = await fetch("../Json/jogos.json");
        const response = await axios.get(`http://localhost:5000/jogos`);
        const jogos = await response.data;

        // Verifica o jogo com o ID correspondente
        const jogoEncontrado = jogos.find((jogo) => jogo.id === id);

        setJogo(jogoEncontrado);
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAdicionarAoCarrinho = () => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      carrinho.push({
        id: jogo.id,
        nome: jogo.nome,
        imagem: jogo.imagem,
        preco: jogo.preco,
        quantidade: 1,
        quantidade_ps5: jogo.quantidade_ps5,
        quantidade_xbox: jogo.quantidade_xbox,
        quantidade_pc: jogo.quantidade_pc ,
      });
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    history.push("/Carrinho"); // Navega para a página do carrinho
  };

  if(loading){
    return <div>Carregando informações do jogo...</div>;
  }

  if(!jogo){
    return <div>Jogo não encontrado.</div>;
  }

  return(
    <div>
      <NavbarInterna />
      <div className="jogo-detalhes-container">
        <h1 className="jogo-detalhes-titulo">{jogo.nome}</h1>
        <img
          src={jogo.imagem}
          alt={jogo.nome}
          className="jogo-detalhes-imagem"
        />
        <p className="jogo-detalhes-descricao">{jogo.descricao}</p>
        <p className="jogo-detalhes-preco">
          Preço: R$ {(jogo.preco/10).toFixed(2)}
        </p>

        
        <a href="/Carrinho" onClick={handleAdicionarAoCarrinho} className="jogo-detalhes-botao">Adicionar ao Carrinho</a>

        
        

        <Avaliacoes jogoId={id} />
      </div>
    </div>
  );
}

export default JogoDetalhes;
