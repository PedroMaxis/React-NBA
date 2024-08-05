export function CardJogadores({nome,image_url}){
    return(
        <>
        <div className="rounded-xl bg-[#c8c8c8] pt-4 pr-9 pb-[30px] pl-9 flex gap-2.5 items-end justify-center flex-wrap relative overflow-hidden">
    <h1 className="text-xl">{nome}</h1>
<img className="min-w-44 md:h-[250px] lg:h-[700px] rounded-xl object-cover" src={image_url} alt={nome} />
</div>
        </>
    )
}