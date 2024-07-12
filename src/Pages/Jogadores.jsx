import { Header } from "../Components/Header"
import { CardJogadores } from "../Components/cardJogadores"
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';

export function Jogadores(){
    var { nome } = useParams()
    const [players, setPlayers ] = useState([])

    useEffect(() => {
        const buscarTime = async () => {
            const response = await fetch('/players.json');
            const data = await response.json();
            const timesNBA = data.times_nba;
            
            
            // Encontrar o time correto pelo nome
            const timeEncontrado = timesNBA.find(time => time.nome === nome);
            console.log(timeEncontrado)
            console.log(timeEncontrado.jogadores)
            // Setar o estado com o time encontrado
            setPlayers(timeEncontrado.jogadores);
        };

        buscarTime();
    }, [nome]);

    return(
        <>
            <Header/>   
            <h1 className="text-center mt-7 text-2xl" >Jogadores Mais Famosos </h1>  
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pr-4 pl-4 pt-5" >
            {players.map((player) =>
                    <CardJogadores
                    nome={player.nome}
                    image_url={player.draft_photo_url}
                    />
                    )}

                </div> 
        </>
    )
}