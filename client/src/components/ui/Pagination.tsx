import { Button } from "./Button";

type Props = {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, limit, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const canPrev = page > 1;
  const canNext = page < totalPages;
  return (
    <div className="flex items-center justify-center gap-2 py-4 mt-4">
      <Button
        variant="outline"
        disabled={!canPrev}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </Button>
      <span className="text-sm opacity-80">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        disabled={!canNext}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
