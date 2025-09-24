import React, { useState, useMemo } from "react";
import { useEntries } from "../hooks/useApi";
import { ContentEntry } from "../services/api";
import ItemCard from "../components/ItemCard";
import SearchBar from "../components/SearchBar";
import Breadcrumb from "../components/Breadcrumb";

const Tahqiq: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Fetch entries with kind slug "lthkykt" (التحقيقات)
  const {
    data: entriesData,
    loading,
    error,
  } = useEntries({
    kind: "lthkykt",
  });

  // Entries are already filtered by kind from API
  const tahqiqat = useMemo(() => {
    const results = entriesData || [];
    const allEntries = Array.isArray(results)
      ? (results as ContentEntry[])
      : [];

    return allEntries;
  }, [entriesData]);

  const filteredItems = useMemo(() => {
    let filtered = tahqiqat;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item: ContentEntry) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [tahqiqat, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const breadcrumbItems = [{ label: "تحقيقات الشناقطة" }];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-amiri font-bold text-blue-gray mb-4">
            تحقيقات الشناقطة
          </h1>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            onSearch={handleSearch}
            placeholder="ابحث في التحقيقات والمحققين..."
          />
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="text-center mb-8">
            <p className="text-medium-gray">
              عدد النتائج:{" "}
              <span className="font-bold text-heritage-gold">
                {filteredItems.length}
              </span>{" "}
              تحقيق
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
              خطأ في تحميل البيانات
            </h3>
            <p className="text-medium-gray">
              حدث خطأ أثناء تحميل التحقيقات. يرجى المحاولة مرة أخرى.
            </p>
          </div>
        )}

        {/* Tahqiqat Grid */}
        {!loading && !error && paginatedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedItems.map((tahqiq: ContentEntry) => (
              <ItemCard key={tahqiq.id} item={tahqiq} />
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                لا توجد نتائج
              </h3>
              <p className="text-medium-gray">
                لم نجد أي تحقيقات تطابق بحثك. جرب كلمات مفتاحية أخرى.
              </p>
            </div>
          )
        )}

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && (
          <div className="text-center py-4 border-t border-gray-100 mt-8">
            <p className="text-medium-gray mb-4">
              صفحة{" "}
              <span className="font-semibold text-olive-green">
                {currentPage}
              </span>{" "}
              من أصل{" "}
              <span className="font-semibold text-blue-gray">{totalPages}</span>{" "}
              صفحة (إجمالي {filteredItems.length} تحقيق)
            </p>

            <div className="flex justify-center items-center gap-2 flex-wrap">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                السابق
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 border rounded-lg text-sm ${
                      currentPage === pageNum
                        ? "bg-olive-green text-white border-olive-green"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tahqiq;
