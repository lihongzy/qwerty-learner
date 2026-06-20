import type { ElementType } from 'react';

type Props = {
  icon: ElementType;
  name: string;
  data: number | string;
};

export default function DataTag({ icon: Icon, name, data }: Props) {
  return (
    <div className="flex min-h-[4.75rem] min-w-44 flex-1 items-center justify-between gap-3 rounded-lg border px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <span className="text-muted-foreground text-sm">{name}</span>
      </div>
      <span className="font-mono text-base font-semibold">{data}</span>
    </div>
  );
}
