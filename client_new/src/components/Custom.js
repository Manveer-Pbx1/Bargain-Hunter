import React from 'react'

export default function Custom({text, x, y, color, txt}) {
  return (
    <div>
      <div className={`h-[205px] w-[350px] flex -rotate-45 items-center justify-center translate-x-[${x}] translate-y-[${y}] shadow-md shadow-black rounded-md p-6 ml-12`}
      style={{backgroundColor: color, textShadow: "0px 0px 1px black"}}>
        <span className='text-lg rotate-45 font-bold'
        style={{color: txt}}
        >{text}</span>
      </div>
    </div>
  )
}

export function Another({text,color,txt}){
    return(
        <div>
            <div className="h-[205px] w-[350px] flex rotate-45 items-center justify-center shadow-md shadow-black rounded-md p-6 translate-x-[800px] -translate-y-[265px]"
            style={{backgroundColor:color, color:txt, textShadow: "0px 0px black"}}>
                <span className="text-lg -rotate-45 font-bold">{text}</span>
            </div>
        </div>
    )
}
