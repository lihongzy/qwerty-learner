import { useState } from 'react';
import alipay from '@/assets/alipay.jpg';
import weChat from '@/assets/weChat.png';

type DonateImageProps = {
  src: string;
  alt: string;
};

function DonateImage({ src, alt }: DonateImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="rounded-app-md border-border-main bg-bg-panel border p-3">
      <div className="rounded-app-sm bg-bg-elevated relative aspect-[11/16] w-full overflow-hidden">
        {!loaded && <div className="bg-border-soft absolute inset-0 animate-pulse" />}
        <img
          className={`h-full w-full object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
        ·{' '}
      </div>
    </div>
  );
}

export const DonatingCard = () => {
  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <DonateImage src={alipay} alt="支付宝赞助二维码" />
        <DonateImage src={weChat} alt="微信赞助二维码" />
      </div>
    </div>
  );
};
