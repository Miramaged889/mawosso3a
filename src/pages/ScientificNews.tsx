import React, { useState, useMemo } from "react";
import {
  useEntriesPaginated,
} from "../hooks/useApi";
import { ContentEntry } from "../services/api";
import ItemCard from "../components/ItemCard";
import SearchBar from "../components/SearchBar";
import Breadcrumb from "../components/Breadcrumb";
import Pagination from "../components/Pagination";

const ScientificNews: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Fetch paginated entries for Scientific News from API using category slug
  const {
    data: paginatedData,
    loading,
    error,
  } = useEntriesPaginated(
    {
      category: "aلaخبaر-aلعلمية", // Category slug for Scientific News
    },
    currentPage,
    itemsPerPage
  );

  const items = paginatedData?.results || [];
  const totalItems = paginatedData?.count || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const filteredItems = useMemo(() => {
    if (!items.length) return [];

    let filtered = items;
    // Apply search filter if there's a query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item: ContentEntry) => {
        const searchableText = [
          item.title || "",
          item.author || "",
          item.description || "",
          item.content || "",
          item.tags || "",
        ]
          .join(" ")
          .toLowerCase();
        return searchableText.includes(query);
      });
    }

    // Sort by date descending (newest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date || "");
      const dateB = new Date(b.date || "");
      return dateB.getTime() - dateA.getTime();
    });
  }, [items, searchQuery]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const breadcrumbItems = [{ label: "آخر الأخبار العلمية" }];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-amiri font-bold text-blue-gray mb-4">
            آخر الأخبار العلمية
          </h1>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            onSearch={handleSearch}
            placeholder="ابحث في الأخبار العلمية..."
          />
        </div>

        {/* Results Count */}
        {!loading && !error && (
          <div className="text-center mb-8">
            <p className="text-medium-gray">
              عدد النتائج:{" "}
              <span className="font-bold text-heritage-gold">
                {searchQuery ? filteredItems.length : totalItems}
              </span>{" "}
              خبر
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
              حدث خطأ أثناء تحميل الأخبار العلمية. يرجى المحاولة مرة أخرى.
            </p>
            <p className="text-sm text-red-500 mt-2">{error.toString()}</p>
          </div>
        )}

        {/* Items Grid */}
        {!loading && !error && filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item: ContentEntry) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                لا توجد نتائج
              </h3>
              <p className="text-medium-gray">
                {searchQuery
                  ? "لم نجد أي أخبار تطابق بحثك. جرب كلمات مفتاحية أخرى."
                  : "لم يتم إضافة أي أخبار علمية بعد."}
              </p>
            </div>
          )
        )}

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && !searchQuery && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default ScientificNews;
