import { useState } from 'react'
import alipay from '@/assets/alipay.jpg'
import weChat from '@/assets/weChat.png'

type DonateImageProps = {
  src: string
  alt: string
  label: string
}

function DonateImage({ src, alt, label }: DonateImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm shadow-slate-200/80 dark:border-slate-800 dark:bg-slate-950">
      <div className="rounded-[1.25rem] bg-slate-50 p-3 shadow-[0_12px_26px_rgba(15,23,42,0.12)] dark:bg-white">
        <div className="relative aspect-[11/16] w-full overflow-hidden rounded-xl">
          {!loaded && <div className="absolute inset-0 animate-pulse rounded-xl bg-slate-200" />}
          <img
            className={`h-full w-full object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
      <div className="mt-3 text-center text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {label}
      </div>
    </div>
  )
}

export const DonatingCard = () => {
  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <DonateImage src={alipay} alt="支付宝赞助二维码" label="支付宝" />
        <DonateImage src={weChat} alt="微信赞助二维码" label="微信支付" />
      </div>
    </div>
  )
}
