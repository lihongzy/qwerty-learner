import React from 'react'

const InfoBox: React.FC<InfoBoxProps> = ({ info, description }) => {
  return (
    <div className="group relative flex min-h-[88px] flex-col justify-center overflow-hidden rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4 transition duration-300 hover:border-white/14 hover:bg-white/[0.05]">
      <div className="pointer-events-none absolute inset-y-4 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent group-last:hidden" />
      <span className="font-mono text-[1.6rem] font-semibold tracking-[0.08em] text-white sm:text-[1.9rem]">
        {info}
      </span>
      <span className="mt-2 text-[11px] font-medium tracking-[0.28em] text-[#8f97aa] uppercase">
        {description}
      </span>
    </div>
  )
}

export default React.memo(InfoBox)

export type InfoBoxProps = {
  info: string
  description: string
}
