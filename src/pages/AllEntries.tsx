import React, { useState, useMemo } from "react";
import { useEntriesPaginated, useCategories } from "../hooks/useApi";
import { ContentEntry } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";
import ItemCard from "../components/ItemCard";

const AllEntries: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const {
    data: paginatedData,
    loading,
    error,
  } = useEntriesPaginated(currentPage, itemsPerPage);
  const { data: categoriesData } = useCategories();

  // Get unique categories from API
  const categories = useMemo(() => {
    if (!categoriesData) return [];
    const categoryNames = categoriesData.map((cat) => cat.name).sort();
    return categoryNames;
  }, [categoriesData]);

  // Filter entries based on search term and selected filters
  const filteredEntries = useMemo(() => {
    if (!paginatedData?.results) return [];

    const filtered = paginatedData.results.filter((entry: ContentEntry) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "" ||
        (() => {
          if (typeof entry.category === "object" && entry.category?.name) {
            const matches = entry.category.name === selectedCategory;
            return matches;
          } else if (typeof entry.category === "number") {
            // Find category by ID from categoriesData
            const categoryObj = categoriesData?.find(
              (cat) => cat.id === entry.category
            );
            const matches = categoryObj?.name === selectedCategory;
            return matches;
          }
          return false;
        })();

      return matchesSearch && matchesCategory;
    });

    return filtered;
  }, [paginatedData, categoriesData, searchTerm, selectedCategory]);

  // Pagination logic
  const totalPages = paginatedData
    ? Math.ceil(paginatedData.count / itemsPerPage)
    : 0;
  const currentEntries = filteredEntries;

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const breadcrumbItems = [
    { label: "الرئيسية", path: "/" },
    { label: "جميع المواد" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory">
        <Breadcrumb items={breadcrumbItems} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green mx-auto mb-4"></div>
            <p className="text-medium-gray">جاري تحميل المواد...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ivory">
        <Breadcrumb items={breadcrumbItems} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
              خطأ في تحميل البيانات
            </h2>
            <p className="text-medium-gray">
              عذراً، حدث خطأ أثناء تحميل المواد. يرجى المحاولة مرة أخرى.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-amiri font-bold text-blue-gray mb-4">
            جميع المواد
          </h1>
          <p className="text-lg text-medium-gray max-w-3xl mx-auto">
            استكشف جميع المواد المتاحة في موسوعة شنقيط، بما في ذلك المخطوطات
            والتحقيقات والمؤلفات والأخبار العلمية
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search Bar */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-blue-gray mb-3">
                البحث
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث في العناوين والمؤلفين والمحتوى..."
                  className="w-full py-3 pr-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-green focus:border-transparent text-right"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-blue-gray mb-3">
                التصنيف
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-green focus:border-transparent text-right"
              >
                <option value="">جميع التصنيفات</option>
                {categories.map((category: string) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Items Per Page Slider */}
            <div>
              <label className="block text-sm font-semibold text-blue-gray mb-3">
                عدد العناصر: {itemsPerPage}
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={itemsPerPage}
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #8B7355 0%, #8B7355 ${
                      ((itemsPerPage - 10) / 90) * 100
                    }%, #E5E7EB ${
                      ((itemsPerPage - 10) / 90) * 100
                    }%, #E5E7EB 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count and Reset Button */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-medium-gray">
              تم العثور على{" "}
              <span className="font-semibold text-olive-green text-lg">
                {paginatedData?.count || 0}
              </span>{" "}
              مادة
              {selectedCategory && ` في تصنيف "${selectedCategory}"`}
              {searchTerm && ` تحتوي على "${searchTerm}"`}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setCurrentPage(1);
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
              >
                إعادة تعيين الفلاتر
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {filteredEntries.length > 0 ? (
          <div className="space-y-8">
            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentEntries.map((entry, index) => (
                <ItemCard key={`${entry.id}-${index}`} item={entry} />
              ))}
            </div>

            {/* Pagination Info */}
            <div className="text-center py-4 border-t border-gray-100">
              <p className="text-medium-gray mb-4">
                صفحة{" "}
                <span className="font-semibold text-olive-green">
                  {currentPage}
                </span>{" "}
                من أصل{" "}
                <span className="font-semibold text-blue-gray">
                  {totalPages}
                </span>{" "}
                صفحة (إجمالي {paginatedData?.count || 0} مادة)
              </p>

              {/* Pagination Controls */}
              {totalPages > 1 && (
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
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-amiri font-bold text-blue-gray mb-4">
              لا توجد نتائج
            </h3>
            <p className="text-medium-gray mb-8 max-w-md mx-auto">
              لم نتمكن من العثور على مواد تطابق معايير البحث المحددة. جرب تغيير
              الفلاتر أو البحث بكلمات مختلفة.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setCurrentPage(1);
                }}
                className="bg-olive-green text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 font-semibold"
              >
                إعادة تعيين الفلاتر
              </button>
              <button
                onClick={() => setSearchTerm("")}
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold"
              >
                مسح البحث
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEntries;
