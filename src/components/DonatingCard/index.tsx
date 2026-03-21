import { useState } from 'react'
import weChat from '@/assets/weChat.png'
import alipay from '@/assets/alipay.jpg'

function DonateImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="overflow-hidden rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
      <div className="relative aspect-[3/4] w-full">
        {!loaded && <div className="absolute inset-0 animate-pulse rounded-md bg-slate-200" />}
        <img
          className={`h-full w-full object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  )
}

export const DonatingCard = () => {
  return (
    <div className="mt-4 w-full px-6">
      <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-4">
        <DonateImage src={alipay} alt="alipay" />
        <DonateImage src={weChat} alt="weChat" />
      </div>
    </div>
  )
}
