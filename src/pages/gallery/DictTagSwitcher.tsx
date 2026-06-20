type Props = {
  tagList: string[];
  currentTag: string;
  onChangeCurrentTag: (tag: string) => void;
};

export default function DictTagSwitcher({ tagList, currentTag, onChangeCurrentTag }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tagList.map((option) => {
        const isChecked = currentTag === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChangeCurrentTag(option)}
            className={`inline-flex min-h-9 items-center justify-center rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
              isChecked
                ? 'border-primary bg-primary/10'
                : 'text-muted-foreground hover:border-primary hover:text-foreground border-transparent'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
