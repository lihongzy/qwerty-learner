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
    <div className="rounded-app-md border border-border-main bg-bg-panel p-3">
      <div className="relative aspect-[11/16] w-full overflow-hidden rounded-app-sm bg-bg-elevated">
        {!loaded && <div className="absolute inset-0 animate-pulse bg-border-soft" />}
        <img
          className={`h-full w-full object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="mt-3 text-center text-sm font-medium text-text-muted">
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
