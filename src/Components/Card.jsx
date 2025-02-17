
 

export function Card({id,logo_url,nome,cor1,cor2}){
return(
        <>
<div key={id} className={`rounded-xl pt-4 pr-9 pb-[30px] pl-9 flex gap-2.5 items-end justify-center flex-wrap shrink-0 h-[280px] relative overflow-hidden`}>
    <img className="h-[80px] w-[80px] md:h-[180px] md:w-[190px] shrink-0 " src={logo_url} alt={nome} />

    <div className="flex flex-row gap-2.5">  
        <a href={`/info/${nome}`} className="hover:scale-110 transition ease-in-out delay-100 bg-[#0c0465] rounded-md p-space-300 flex flex-row gap-space-200 items-center justify-center shrink-0 w-[89px] h-6 relative overflow-hidden">
    <div className="text-[#d9d9d9] text-center font-single-line-body-base-font-family text-single-line-body-base-font-size leading-single-line-body-base-line-height font-single-line-body-base-font-weight relative">
      Info
    </div>
  </a>
  <a href="" className="hover:scale-110 transition ease-in-out delay-100 bg-[#303030] rounded-md border-solid border-border-brand-default border p-space-300 flex flex-row gap-space-200 items-center justify-center shrink-0 w-[89px] h-6 relative overflow-hidden">
    <div className="text-[#d9d9d9] text-center font-single-line-body-base-font-family text-single-line-body-base-font-size leading-single-line-body-base-line-height font-single-line-body-base-font-weight relative flex items-center justify-start">
      Jogadores
    </div>
  </a>
  </div>

</div>




        </>
    )
}