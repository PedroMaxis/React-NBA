import { Header } from "../Components/Header"
import { Card } from "../Components/Card"
export function LandingPage() {
    return(
        <>
            <Header></Header>
            <div className="mt-3 ml-3 mr-3 shrink-0 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 justify-center">
                <Card></Card>
                <Card></Card>
                <Card></Card>
                <Card></Card>
                <Card></Card>
                <Card></Card>
                <Card></Card>
                <Card></Card>
           
            </div>
        </>

    )
}