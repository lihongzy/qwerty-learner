import weChat from '@/assets/weChat.png'
import alipay from '@/assets/alipay.jpg'
export const DonatingCard = () => {
  return (
    <div className="mt-4 w-full px-6">
      <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-4">
        <div className="overflow-hidden rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
          <img className="h-auto w-full object-contain" src={alipay} alt="alipay" />
        </div>
        <div className="overflow-hidden rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
          <img className="h-auto w-full object-contain" src={weChat} alt="weChat" />
        </div>
      </div>
    </div>
  )
}
