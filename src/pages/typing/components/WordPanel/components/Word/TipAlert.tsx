import { TriangleAlert } from 'lucide-react';

export const TipAlert = ({
  className,
  show,
  setShow,
}: {
  className?: string;
  show: boolean;
  setShow: (show: boolean) => void;
}) => {
  if (!show) return null;

  return (
    <div className={`cursor-pointer ${className ?? ''}`} onClick={() => setShow(false)}>
      <div
        role="alert"
        className="border-destructive/30 bg-destructive/10 relative max-w-sm rounded-lg border p-4 pl-11 shadow-md"
      >
        <TriangleAlert className="text-destructive absolute top-4 left-4 h-4 w-4" />
        <h5 className="text-destructive mb-1 font-medium">输入异常提示</h5>
        <div className="text-muted-foreground text-sm">
          如果持续无法正常输入，可能是浏览器扩展造成干扰。请先关闭相关扩展，或换一个浏览器再试。
        </div>
      </div>
    </div>
  );
};
