import clsx from "clsx";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

import { Fragment } from "react";

export type Placement = "left" | "top" | "right" | "bottom";

interface DrawerProps {
  open?: boolean;
  placement?: Placement;
  onClose?: () => void;
  children?: React.ReactNode;
  classNames?: string;
}

// 进入/离开动画的屏幕外位置
const transitionDirectionMap = {
  left: "-translate-x-full",
  right: "translate-x-full",
  top: "-translate-y-full",
  bottom: "translate-y-full",
};
export function Drawer(props: DrawerProps) {
  const { open = false, placement = "left", onClose, children } = props;

  // Dialog 的关闭处理
  function onCloseDrawer() {
    onClose?.();
  }
  const transitionDirection = transitionDirectionMap[placement];

  return (
    <Transition show={open} appear as={Fragment}>
      {/* Dialog 负责无障碍与焦点管理 */}
      <Dialog as="div" className="relative z-30" onClose={onCloseDrawer}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* 遮罩层 */}
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        {/* 抽屉面板的全屏容器 */}
        <div className="fixed inset-0 h-full w-full">
          <TransitionChild
            as={Fragment}
            enter="transition ease-out duration-300 "
            enterFrom={transitionDirection}
            enterTo=""
            leave="transition ease-in duration-300 "
            leaveFrom=""
            leaveTo={transitionDirection}
          >
            {/* 抽屉面板 */}
            <DialogPanel
              className={clsx(
                `${placement}-0`,
                props.classNames,
                "absolute flex h-full w-140 flex-col drop-shadow-2xl transition-all duration-300 ease-out",
              )}
            >
              {children}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
