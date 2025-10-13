import React, { useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useAllEntriesPaginated,
  useAuth,
  useCategories,
} from "../hooks/useApi";
import { apiClient, ContentEntry } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";

const AdminAuthors: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initialized } = useAuth();
  const [deleting, setDeleting] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(18);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ContentEntry[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [totalSearchCount, setTotalSearchCount] = useState(0);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchItemsPerPage] = useState(18);

  const {
    data: paginatedData,
    loading,
    error,
    refetch,
  } = useAllEntriesPaginated(currentPage, itemsPerPage, "lmolft");
  const { data: categories } = useCategories();

  // Format image URL
  const getImageUrl = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    return `https://chinguitipedia.alldev.org${url}`;
  };

  // Function to fetch search results
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
          )}&page=${page}&kind=15`;
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

        // Filter results to only include authors (kind 15)
        const filteredResults =
          result.results?.filter((item: ContentEntry) => item.kind === 15) ||
          [];

        setSearchResults(filteredResults);
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
    setSearchCurrentPage(1);

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

  // Redirect if not authenticated
  React.useEffect(() => {
    if (initialized && !isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, initialized, navigate]);

  // Filter authors based on kind field (المولفات - slug: lmolft)
  const allAuthors = useMemo(() => {
    if (!paginatedData?.results) return [];
    return paginatedData.results.filter((item: ContentEntry) => {
      // Only include items with kind 15 (المولفات)
      return item.kind === 15;
    });
  }, [paginatedData]);

  // Determine which authors to show
  const currentAuthors = useMemo(() => {
    if (activeSearchTerm !== "") {
      return searchResults;
    } else {
      return allAuthors;
    }
  }, [activeSearchTerm, searchResults, allAuthors]);

  // Pagination logic
  const totalPages = paginatedData
    ? Math.ceil(paginatedData.count / itemsPerPage)
    : 0;

  // Search pagination logic
  const searchTotalPages =
    activeSearchTerm !== "" && totalSearchCount > 0
      ? Math.ceil(totalSearchCount / searchItemsPerPage)
      : 0;

  const authors = currentAuthors;

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Search pagination handlers
  const handleSearchPageChange = (page: number) => {
    setSearchCurrentPage(page);
    if (activeSearchTerm.trim()) {
      fetchSearchResults(activeSearchTerm, page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper function to get category name
  const getCategoryName = (category: any, tags?: string): string => {
    if (!category) return tags || "غير محدد";

    if (typeof category === "object" && category.name) {
      return category.name;
    }

    if (typeof category === "string") {
      return category;
    }

    // If it's a number, look up the category name from categories data
    if (typeof category === "number" && categories) {
      const foundCategory = categories.find((cat) => cat.id === category);
      return foundCategory ? foundCategory.name : tags || "غير محدد";
    }

    return tags || "غير محدد";
  };

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا العنصر؟")) {
      try {
        setDeleting(id);
        await apiClient.deleteEntry(id);
        refetch();
        alert("تم حذف العنصر بنجاح");
      } catch (error) {
        console.error("Error deleting entry:", error);
        alert("حدث خطأ أثناء حذف العنصر");
      } finally {
        setDeleting(null);
      }
    }
  };

  const breadcrumbItems = [
    { label: "لوحة التحكم", path: "/admin" },
    { label: "إدارة المؤلفات" },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-amiri font-bold text-blue-gray mb-2">
              إدارة مؤلفات
            </h1>
            <p className="text-medium-gray">
              {activeSearchTerm ? (
                <>
                  نتائج البحث عن "{activeSearchTerm}" - تم العثور على{" "}
                  {totalSearchCount} مؤلفة
                </>
              ) : (
                <>
                  عرض وإدارة جميع المؤلفات المضافة ({paginatedData?.count || 0}{" "}
                  إدخال إجمالي - {allAuthors.length} مؤلفة في هذه الصفحة)
                </>
              )}
            </p>
          </div>
          <Link
            to="/admin/authors/add"
            className="bg-olive-green text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
          >
            إضافة مؤلفة جديدة
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-blue-gray mb-3">
                البحث في المؤلفات
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="ابحث في العناوين والمؤلفين والمحتوى..."
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-green focus:border-transparent text-right"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="bg-olive-green text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
            {(searchTerm || activeSearchTerm) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveSearchTerm("");
                  setSearchResults([]);
                  setTotalSearchCount(0);
                  setSearchCurrentPage(1);
                }}
                className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                مسح البحث
              </button>
            )}
          </div>
        </div>

        {/* Items Per Page Slider */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <label className="text-sm font-semibold text-blue-gray">
                عدد العناصر: {itemsPerPage}
              </label>
              <div className="w-64">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={itemsPerPage}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #8b7355 0%, #8b7355 ${
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
        </div>

        {/* Loading State */}
        {(loading || searchLoading) && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
              {searchLoading
                ? `جاري البحث في المؤلفات... صفحة ${searchCurrentPage}`
                : `جاري تحميل المؤلفات من الخادم... صفحة ${currentPage}`}
            </div>
          </div>
        )}

        {/* Error State */}
        {(error || searchError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            خطأ في تحميل البيانات: {searchError || error}
            <button
              onClick={
                searchError
                  ? () =>
                      fetchSearchResults(activeSearchTerm, searchCurrentPage)
                  : refetch
              }
              className="ml-4 underline hover:no-underline"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Authors Table */}
        {authors.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-heritage-gold text-white">
                  <tr>
                    <th className="px-6 py-4 text-right font-semibold">
                      الصورة
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      العنوان
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      المؤلف
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      النوع
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      التصنيف
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      التاريخ
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      عدد المواد
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map((author, index) => (
                    <tr
                      key={author.id}
                      className={index % 2 === 0 ? "bg-ivory" : "bg-white"}
                    >
                      <td className="px-6 py-4 w-24">
                        {getImageUrl(author.cover_image_link) ? (
                          <img
                            src={
                              getImageUrl(author.cover_image_link) ||
                              "/placeholder-manuscript.png"
                            }
                            alt={author.title}
                            className="w-20 h-20 object-contain rounded bg-gray-50"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-manuscript.png";
                              target.onerror = null;
                            }}
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-50 rounded flex items-center justify-center">
                            <span className="text-2xl">📚</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-blue-gray">
                        {author.title}
                      </td>
                      <td className="px-6 py-4 text-medium-gray">
                        {author.author}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-olive-green text-white px-3 py-1 rounded-full text-sm">
                          مؤلفات
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-heritage-gold-dark text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                          {getCategoryName(author.category, author.tags)}
                        </span>
                        {author.subcategory &&
                          typeof author.subcategory === "object" && (
                            <div className="mt-1">
                              <span className="bg-olive-green text-white px-2 py-1 rounded text-xs">
                                {author.subcategory.name}
                              </span>
                            </div>
                          )}
                      </td>
                      <td className="px-6 py-4 text-medium-gray">
                        {author.date}
                      </td>
                      <td className="px-6 py-4 text-medium-gray">
                        {author.pages || author.page_count || 0}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2 space-x-reverse">
                          <Link
                            to={`/admin/authors/edit/${author.id}`}
                            className="bg-blue-gray text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 transition-colors"
                          >
                            تعديل
                          </Link>
                          <button
                            onClick={() => handleDelete(author.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                            disabled={deleting === author.id}
                          >
                            {deleting === author.id ? "جاري الحذف..." : "حذف"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
              لا توجد مؤلفات
            </h3>
            <p className="text-medium-gray mb-8">
              لم يتم إضافة أي مؤلفات بعد. ابدأ بإضافة مؤلفة جديدة.
            </p>
            <Link
              to="/admin/authors/add"
              className="bg-olive-green text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
            >
              إضافة مؤلفة جديدة
            </Link>
          </div>
        )}

        {/* Pagination Controls */}
        {((activeSearchTerm !== "" && searchTotalPages > 1) ||
          (activeSearchTerm === "" &&
            allAuthors &&
            allAuthors.length > itemsPerPage)) && (
          <div className="bg-white rounded-lg shadow-lg border-t border-gray-200 px-6 py-4 mt-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-medium-gray">
                {activeSearchTerm !== "" ? (
                  <>
                    صفحة {searchCurrentPage} من أصل {searchTotalPages} صفحة -
                    عرض {authors.length} مؤلفة من أصل {totalSearchCount} نتيجة
                    بحث
                  </>
                ) : (
                  <>
                    صفحة {currentPage} من أصل {totalPages} صفحة - عرض{" "}
                    {allAuthors.length} مؤلفة من أصل {paginatedData?.count || 0}{" "}
                    إدخال
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeSearchTerm !== "" ? (
                  // Search pagination controls
                  <>
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
                  </>
                ) : (
                  // Regular pagination controls
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuthors;
