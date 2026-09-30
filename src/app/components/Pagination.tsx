import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const toPageNumber = (value: number, fallback: number) =>
  Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // A caller passing undefined/NaN (an API response missing `pages`, say) used to
  // make the bounds NaN, which rendered zero page buttons and emitted NaN pages.
  const total = toPageNumber(totalPages, 1);
  const current = Math.min(toPageNumber(currentPage, 1), total);

  const changePage = (page: number) => {
    if (page >= 1 && page <= total && page !== current) onPageChange(page);
  };

  const createPageNumbers = () => {
    const pages: number[] = [];

    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-4 sm:mt-8 gap-1.5 sm:gap-2 flex-wrap items-center px-2">
      {/* Prev */}
      <button
        className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded bg-gray-300 cursor-pointer disabled:opacity-50"
        onClick={() => changePage(current - 1)}
        disabled={current === 1}
      >
        &lt; Prev
      </button>

      {/* First page + ellipsis */}
      {current > 3 && (
        <>
          <button
            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm cursor-pointer rounded ${current === 1 ? 'bg-gray-500 text-white' : 'bg-gray-200'}`}
            onClick={() => changePage(1)}
          >
            1
          </button>
          <span className="px-2">...</span>
        </>
      )}

      {/* Centered pages */}
      {createPageNumbers().map((p) => (
        <button
          key={p}
          className={`px-2 sm:px-3 py-1 text-xs sm:text-sm cursor-pointer rounded ${current === p ? 'bg-gray-500 text-white' : 'bg-gray-200'}`}
          onClick={() => changePage(p)}
        >
          {p}
        </button>
      ))}

      {/* Last page + ellipsis */}
      {current < total - 2 && (
        <>
          <span className="px-2">...</span>
          <button
            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm cursor-pointer rounded ${current === total ? 'bg-gray-500 text-white' : 'bg-gray-200'}`}
            onClick={() => changePage(total)}
          >
            {total}
          </button>
        </>
      )}

      {/* Next */}
      <button
        className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded cursor-pointer bg-gray-300 disabled:opacity-50"
        onClick={() => changePage(current + 1)}
        disabled={current === total}
      >
        Next &gt;
      </button>
    </div>
  );
};

export default Pagination;
