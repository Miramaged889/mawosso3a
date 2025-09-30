import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  loading = false,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push("...");
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        if (totalPages > 5) {
          pages.push("...");
        }
        for (let i = Math.max(2, totalPages - 4); i <= totalPages - 1; i++) {
          pages.push(i);
        }
      } else {
        // Show current page and surrounding pages
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="text-center py-4 border-t border-gray-100 mt-8">
      {/* Page Info */}
      <p className="text-medium-gray mb-4">
        صفحة{" "}
        <span className="font-semibold text-olive-green">{currentPage}</span> من
        أصل <span className="font-semibold text-blue-gray">{totalPages}</span>{" "}
        صفحة (إجمالي {totalItems} عنصر)
      </p>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 flex-wrap">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
        >
          السابق
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-400"
              >
                ...
              </span>
            );
          }

          const isCurrentPage = currentPage === pageNum;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum as number)}
              disabled={loading}
              className={`px-3 py-2 border rounded-lg text-sm transition-colors ${
                isCurrentPage
                  ? "bg-olive-green text-white border-olive-green"
                  : "border-gray-300 hover:bg-gray-50"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
        >
          التالي
        </button>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="mt-4">
          <div className="inline-flex items-center gap-2 text-sm text-medium-gray">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-olive-green"></div>
            جاري التحميل...
          </div>
        </div>
      )}
    </div>
  );
};

export default Pagination;
