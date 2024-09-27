import { Header } from "../Components/Header"
import { Card } from "../Components/Card"
import { useState, useEffect } from 'react';
import  FadeInSection  from "../Components/FadeIn"

export function LandingPage() {
    const [ teams, setTeams ] = useState([])

useEffect(() => {
    const buscarTeams = async () => {
        const response = await fetch('./teams.json')
        const data = await response.json()
        setTeams(data.times_nba)
        console.log(data.times_nba)
    }
    buscarTeams()
   
}, []) 

  
    return(
        <>
            <Header/>
            <FadeInSection> 
            <div className="mt-3 ml-3 mr-3 shrink-0 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 justify-center">

            {
                teams.map((team) =>
                <Card 
                id={team.id}
                logo_url={team.logo_url}
                nome={team.nome}
                />
                )      
            } 
            
            </div>
            </FadeInSection>
        </>

    )
}