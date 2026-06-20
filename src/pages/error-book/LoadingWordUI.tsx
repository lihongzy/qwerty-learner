import ErrorIcon from '~icons/ic/outline-error';

type Props = {
  className?: string;
  isLoading: boolean;
  hasError: boolean;
};

export function LoadingWordUI({ className, isLoading, hasError }: Props) {
  return (
    <div className={className}>
      {hasError ? (
        <ErrorIcon className="text-destructive" />
      ) : (
        isLoading && (
          <span className="border-muted-foreground inline-block h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
        )
      )}
    </div>
  );
}
