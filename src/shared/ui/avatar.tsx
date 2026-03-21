import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import clsx from "clsx";

type AvatarProps = React.ComponentPropsWithRef<typeof AvatarPrimitive.Root>

const Avatar = ({ className, ref, ...props }: AvatarProps) => {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={clsx("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  );
};
Avatar.displayName = AvatarPrimitive.Root.displayName;

type AvatarImageProps = React.ComponentPropsWithRef<typeof AvatarPrimitive.Image>

const AvatarImage = ({ className, ref, ...props }: AvatarImageProps) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={clsx("aspect-square h-full w-full", className)}
    {...props}
  />
);
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

type AvatarFallbackProps = React.ComponentPropsWithRef<typeof AvatarPrimitive.Fallback>

const AvatarFallback = ({ className, ref, ...props }: AvatarFallbackProps) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={clsx("flex h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800", className)}
    {...props}
  />
);
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;


export { Avatar, AvatarImage, AvatarFallback }