export function Card(){
return(
        <>
<div className="rounded-xl bg-[#c8c8c8] pt-4 pr-9 pb-4 pl-9 flex gap-2.5 items-end justify-center flex-wrap shrink-0 h-[260px] relative overflow-hidden">
    <img className="m-h-[286px] shrink-0 " src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCInWr8ooc-P7k5VEd38dMBvCidEXDjfgUxQ&s" alt="" />

    <div className="flex flex-row gap-2.5">  
        <a className="hover:scale-110 transition ease-in-out delay-100 bg-[#0c0465] rounded-md p-space-300 flex flex-row gap-space-200 items-center justify-center shrink-0 w-[89px] h-6 relative overflow-hidden">
    <div className="text-[#d9d9d9] text-center font-single-line-body-base-font-family text-single-line-body-base-font-size leading-single-line-body-base-line-height font-single-line-body-base-font-weight relative">
      Info
    </div>
  </a>
  <a className="hover:scale-110 transition ease-in-out delay-100 bg-[#303030] rounded-md border-solid border-border-brand-default border p-space-300 flex flex-row gap-space-200 items-center justify-center shrink-0 w-[89px] h-6 relative overflow-hidden">
    <div className="text-[#d9d9d9] text-center font-single-line-body-base-font-family text-single-line-body-base-font-size leading-single-line-body-base-line-height font-single-line-body-base-font-weight relative flex items-center justify-start">
      Jogadores
    </div>
  </a>
  </div>

</div>




        </>
    )
}