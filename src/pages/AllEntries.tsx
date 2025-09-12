import React, { useState, useMemo, useCallback } from "react";
import { useEntriesPaginated, useCategories, useKinds } from "../hooks/useApi";
import { ContentEntry } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";
import ItemCard from "../components/ItemCard";

const AllEntries: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedKind, setSelectedKind] = useState("");
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchItemsPerPage] = useState(20);

  // New state for managing search results with pagination
  const [searchResults, setSearchResults] = useState<ContentEntry[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [totalSearchCount, setTotalSearchCount] = useState(0);

  const {
    data: paginatedData,
    loading: paginatedLoading,
    error: paginatedError,
  } = useEntriesPaginated(currentPage, itemsPerPage);
  const { data: categoriesData } = useCategories();
  const { data: kindsData } = useKinds();

  // Function to fetch search results for a specific page
  const fetchSearchResults = useCallback(
    async (query: string, page: number = 1) => {
      if (!query.trim()) {
        setSearchResults([]);
        setTotalSearchCount(0);
        return;
      }

      setSearchLoading(true);
      setSearchError(null);

      try {
        // Create a custom API call with page parameter
        const searchUrl = `/api/entries/?search=${encodeURIComponent(
          query
        )}&page=${page}`;
        const response = await fetch(searchUrl, {
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "omit",
        });

        let result;
        if (!response.ok) {
          // Try fallback URL
          const fallbackUrl = `https://mawso3a.pythonanywhere.com/api/entries/?search=${encodeURIComponent(
            query
          )}&page=${page}`;
          const fallbackResponse = await fetch(fallbackUrl, {
            headers: {
              "Content-Type": "application/json",
            },
            mode: "cors",
            credentials: "omit",
          });

          if (!fallbackResponse.ok) {
            throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
          }

          result = await fallbackResponse.json();
        } else {
          result = await response.json();
        }

        // Update state with results
        setSearchResults(result.results || []);
        setTotalSearchCount(result.count || 0);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchError("فشل في تحميل نتائج البحث");
        setSearchResults([]);
        setTotalSearchCount(0);
      } finally {
        setSearchLoading(false);
      }
    },
    []
  );

  // Function to handle search button click
  const handleSearch = useCallback(() => {
    setActiveSearchTerm(searchTerm);
    setSearchCurrentPage(1); // Reset search page when search term changes

    // Fetch first page of search results when search button is clicked
    if (searchTerm.trim()) {
      fetchSearchResults(searchTerm, 1);
    } else {
      setSearchResults([]);
      setTotalSearchCount(0);
    }
  }, [searchTerm, fetchSearchResults]);

  // Function to handle Enter key press in search input
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Get unique categories from API
  const categories = useMemo(() => {
    if (!categoriesData) return [];
    const categoryNames = categoriesData.map((cat) => cat.name).sort();
    return categoryNames;
  }, [categoriesData]);

  // Get unique kinds from API
  const kinds = useMemo(() => {
    if (!kindsData) return [];
    const kindNames = kindsData.map((kind) => kind.name).sort();
    return kindNames;
  }, [kindsData]);

  // Determine loading and error states
  const loading = activeSearchTerm !== "" ? searchLoading : paginatedLoading;
  const error = activeSearchTerm !== "" ? searchError : paginatedError;

  // Filter entries based on search term and selected filters
  const filteredEntries = useMemo(() => {
    // If we're searching, use our search results
    if (activeSearchTerm !== "" && searchResults.length > 0) {
      return searchResults.filter((entry: ContentEntry) => {
        // Apply category and kind filters to search results
        const matchesCategory =
          selectedCategory === "" ||
          (() => {
            if (typeof entry.category === "object" && entry.category?.name) {
              const matches = entry.category.name === selectedCategory;
              return matches;
            } else if (typeof entry.category === "number") {
              const categoryObj = categoriesData?.find(
                (cat) => cat.id === entry.category
              );
              const matches = categoryObj?.name === selectedCategory;
              return matches;
            }
            return false;
          })();

        const matchesKind =
          selectedKind === "" ||
          (() => {
            if (entry.kind) {
              const kindObj = kindsData?.find((kind) => kind.id === entry.kind);
              const matches = kindObj?.name === selectedKind;
              return matches;
            }
            return false;
          })();

        return matchesCategory && matchesKind;
      });
    }

    // If not searching, use paginated data with category/kind filters
    if (!paginatedData?.results) return [];

    return paginatedData.results.filter((entry: ContentEntry) => {
      const matchesCategory =
        selectedCategory === "" ||
        (() => {
          if (typeof entry.category === "object" && entry.category?.name) {
            const matches = entry.category.name === selectedCategory;
            return matches;
          } else if (typeof entry.category === "number") {
            const categoryObj = categoriesData?.find(
              (cat) => cat.id === entry.category
            );
            const matches = categoryObj?.name === selectedCategory;
            return matches;
          }
          return false;
        })();

      const matchesKind =
        selectedKind === "" ||
        (() => {
          if (entry.kind) {
            const kindObj = kindsData?.find((kind) => kind.id === entry.kind);
            const matches = kindObj?.name === selectedKind;
            return matches;
          }
          return false;
        })();

      return matchesCategory && matchesKind;
    });
  }, [
    paginatedData,
    searchResults,
    activeSearchTerm,
    categoriesData,
    kindsData,
    selectedCategory,
    selectedKind,
  ]);

  // Pagination logic
  const totalPages = paginatedData
    ? Math.ceil(paginatedData.count / itemsPerPage)
    : 0;

  // Search pagination logic - calculate total pages based on total count
  const searchTotalPages =
    activeSearchTerm !== "" && totalSearchCount > 0
      ? Math.ceil(totalSearchCount / searchItemsPerPage)
      : 0;

  // When searching, show current search results; when not searching, show paginated results
  const currentEntries =
    activeSearchTerm !== "" ? filteredEntries : filteredEntries;

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
    setSearchCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedKind]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Search pagination handlers
  const handleSearchPageChange = (page: number) => {
    setSearchCurrentPage(page);
    // Fetch the new page of search results
    if (activeSearchTerm.trim()) {
      fetchSearchResults(activeSearchTerm, page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search Bar */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-blue-gray mb-3">
                البحث
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    placeholder="ابحث في العناوين والمؤلفين والمحتوى..."
                    className="w-full py-3 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-green focus:border-transparent text-right"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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
                <button
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="bg-olive-green text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {searchLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>جاري البحث...</span>
                    </div>
                  ) : (
                    "بحث"
                  )}
                </button>
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

            {/* Kind Filter */}
            <div>
              <label className="block text-sm font-semibold text-blue-gray mb-3">
                النوع
              </label>
              <select
                value={selectedKind}
                onChange={(e) => setSelectedKind(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-green focus:border-transparent text-right"
              >
                <option value="">جميع الأنواع</option>
                {kinds.map((kind: string) => (
                  <option key={kind} value={kind}>
                    {kind}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count and Reset Button */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-medium-gray">
              تم العثور على{" "}
              <span className="font-semibold text-olive-green text-lg">
                {activeSearchTerm !== ""
                  ? totalSearchCount || filteredEntries.length
                  : paginatedData?.count || 0}
              </span>{" "}
              مادة
              {selectedCategory && ` في تصنيف "${selectedCategory}"`}
              {selectedKind && ` من نوع "${selectedKind}"`}
              {activeSearchTerm && ` تحتوي على "${activeSearchTerm}"`}
            </p>
            {(searchTerm || selectedCategory || selectedKind) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveSearchTerm("");
                  setSelectedCategory("");
                  setSelectedKind("");
                  setCurrentPage(1);
                  setSearchCurrentPage(1);
                  setSearchResults([]);
                  setTotalSearchCount(0);
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium whitespace-nowrap"
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
                {activeSearchTerm !== "" ? (
                  <>
                    صفحة{" "}
                    <span className="font-semibold text-olive-green">
                      {searchCurrentPage}
                    </span>{" "}
                    من أصل{" "}
                    <span className="font-semibold text-blue-gray">
                      {searchTotalPages}
                    </span>{" "}
                    صفحة (عرض {currentEntries.length} من أصل {totalSearchCount}{" "}
                    نتيجة بحث)
                  </>
                ) : (
                  <>
                    صفحة{" "}
                    <span className="font-semibold text-olive-green">
                      {currentPage}
                    </span>{" "}
                    من أصل{" "}
                    <span className="font-semibold text-blue-gray">
                      {totalPages}
                    </span>{" "}
                    صفحة (إجمالي {paginatedData?.count || 0} مادة)
                  </>
                )}
              </p>

              {/* Pagination Controls */}
              {activeSearchTerm !== "" && searchTotalPages > 1 ? (
                // Search pagination controls
                <div className="flex justify-center items-center gap-2 flex-wrap">
                  {/* Previous Button */}
                  <button
                    onClick={() =>
                      handleSearchPageChange(searchCurrentPage - 1)
                    }
                    disabled={searchCurrentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    السابق
                  </button>

                  {/* Page Numbers */}
                  {Array.from(
                    { length: Math.min(5, searchTotalPages) },
                    (_, i) => {
                      let pageNum;
                      if (searchTotalPages <= 5) {
                        pageNum = i + 1;
                      } else if (searchCurrentPage <= 3) {
                        pageNum = i + 1;
                      } else if (searchCurrentPage >= searchTotalPages - 2) {
                        pageNum = searchTotalPages - 4 + i;
                      } else {
                        pageNum = searchCurrentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handleSearchPageChange(pageNum)}
                          className={`px-3 py-2 border rounded-lg text-sm ${
                            searchCurrentPage === pageNum
                              ? "bg-olive-green text-white border-olive-green"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  {/* Next Button */}
                  <button
                    onClick={() =>
                      handleSearchPageChange(searchCurrentPage + 1)
                    }
                    disabled={searchCurrentPage === searchTotalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    التالي
                  </button>
                </div>
              ) : activeSearchTerm === "" && totalPages > 1 ? (
                // Regular pagination controls
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
              ) : null}
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
                  setActiveSearchTerm("");
                  setSelectedCategory("");
                  setSelectedKind("");
                  setCurrentPage(1);
                  setSearchCurrentPage(1);
                  setSearchResults([]);
                  setTotalSearchCount(0);
                }}
                className="bg-olive-green text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 font-semibold"
              >
                إعادة تعيين الفلاتر
              </button>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveSearchTerm("");
                  setSearchResults([]);
                  setTotalSearchCount(0);
                }}
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
