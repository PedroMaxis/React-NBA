import { Header } from "../Components/Header"
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';



export function Info() {
    var { nome } = useParams()

    const [teams, setTeams ] = useState([])
    const [anos, setAnos] = useState([])

   useEffect(() => {
        const buscarTime = async () => {
            const response = await fetch('/teams.json');
            const data = await response.json();
            const timesNBA = data.times_nba;
            
            // Encontrar o time correto pelo nome
            const timeEncontrado = timesNBA.find(time => time.nome === nome);
            
            // Setar o estado com o time encontrado
            setTeams(timeEncontrado);
            setAnos(timeEncontrado.anos_campeao)
        };

        buscarTime();
    }, [nome]);
    
    return(
        <>
        <Header/>
        <div className="flex h-screen justify-center items-center">
            <div className="bg-slate-600 pt-0 p-10 rounded-xl items-center">
                <div className="flex lg:grid lg:grid-flow-col lg:grid-cols-2 justify-between mb-10"> 
                    <h1 className="text-lg text-white lg:text-5xl float-left text-center">{teams.nome}</h1>
                    <h1 className="text-lg text-white lg:text-5xl float-right text-center">{teams.casa}</h1>
                </div>
                <div className="h-full grid grid-flow-col grid-cols-2 justify-between">
                    <div>
                        <h1 className="lg:text-4xl text-white mb-3 text-center">Anos que foi campeão</h1>
                        <ul className="text-white ml-7 lg:ml-[90px] float-left text-2xl ">
                        {anos.map(ano => (
                                    <li key={ano}>{ano}</li>
                                ))}   
                        </ul>
                    </div>
                    <div>
                    <h1 className="lg:text-4xl text-white mb-3 text-center">Camisa do Time</h1>
                        <img className="text-center h-[400px] object-contain" src={teams.camisa_url} alt="camisa" />
                    </div>

                </div>    
            </div>
        </div>
        
        </>
    )
};