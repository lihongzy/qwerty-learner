import { useState } from "react";
import clsx from "clsx";

export const Tooltip = ({
  children,
  content,
  className,
  placement = "top",
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const placementClasses = {
    top: "bottom-full pb-2",
    bottom: "top-full pt-2",
  }[placement];

  return (
    <div className={clsx("relative", className)}>
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onBlur={() => setVisible(false)}
      >
        {children}
      </div>
      <div
        className={clsx(
          visible ? "opacity-100" : "opacity-0",
          placementClasses,
          "pointer-events-none absolute left-1/2 -translate-x-1/2 flex items-center justify-center transition-opacity",
        )}
      >
        <span className="tooltip">{content}</span>
      </div>
    </div>
  );
};

export type TooltipProps = {
  children: React.ReactNode;
  // 显示文本
  content: string;
  className?: string;
  // 位置
  placement?: "top" | "bottom";
};
