import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useAllEntriesPaginated,
  useAuth,
  useCategories,
} from "../hooks/useApi";
import { apiClient, ContentEntry, Category } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";

const AdminManuscripts: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initialized } = useAuth();
  const { data: categories } = useCategories();
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
  } = useAllEntriesPaginated(currentPage, itemsPerPage, "lmkhtott");

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
        )}&page=${page}&kind=16`;
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

        // Filter results to only include manuscripts (kind 16)
        const filteredResults =
          result.results?.filter((item: ContentEntry) => item.kind === 16) ||
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

  // Filter manuscripts based on kind field (مخطوط - kind 16, slug: lmkhtott)
  const allManuscripts = useMemo(() => {
    if (!paginatedData?.results) return [];
    return paginatedData.results.filter((item: ContentEntry) => {
      // Only include items with kind 16 (مخطوط)
      return item.kind === 16;
    });
  }, [paginatedData]);

  // Helper function to get category name
  const getCategoryName = (category: Category | number | undefined): string => {
    if (!category) return "غير محدد";

    // If category is an object with name property
    if (typeof category === "object" && category.name) {
      return category.name;
    }

    // If category is a number (ID), find it in categories list
    if (typeof category === "number" && categories) {
      const foundCategory = categories.find(
        (cat: Category) => cat.id === category
      );
      if (foundCategory) {
        return foundCategory.name;
      }
    }

    return "غير محدد";
  };

  // Determine which manuscripts to show
  const currentManuscripts = useMemo(() => {
    if (activeSearchTerm !== "") {
      return searchResults;
    } else {
      return allManuscripts;
    }
  }, [activeSearchTerm, searchResults, allManuscripts]);

  // Pagination logic
  const totalPages = paginatedData
    ? Math.ceil(paginatedData.count / itemsPerPage)
    : 0;

  // Search pagination logic
  const searchTotalPages =
    activeSearchTerm !== "" && totalSearchCount > 0
      ? Math.ceil(totalSearchCount / searchItemsPerPage)
      : 0;

  const manuscripts = currentManuscripts;

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

  // Format image URL
  const getImageUrl = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    return `${url}`;
  };

  // Redirect if not authenticated (but wait for auth to initialize)
  useEffect(() => {
    if (initialized && !isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, initialized, navigate]);

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه المخطوطة؟")) {
      setDeleting(id);
      try {
        await apiClient.deleteEntry(id);
        alert("تم حذف المخطوطة بنجاح!");
        refetch();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "حدث خطأ غير متوقع";
        alert(`حدث خطأ أثناء حذف المخطوطة: ${errorMessage}`);
      } finally {
        setDeleting(null);
      }
    }
  };

  const breadcrumbItems = [
    { label: "لوحة التحكم", path: "/admin" },
    { label: "إدارة المخطوطات" },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-amiri font-bold text-blue-gray mb-2">
              إدارة المخطوطات
            </h1>
            <p className="text-medium-gray">
              {activeSearchTerm ? (
                <>
                  نتائج البحث عن "{activeSearchTerm}" - تم العثور على{" "}
                  {totalSearchCount} مخطوطة
                </>
              ) : (
                <>عرض وإدارة جميع المخطوطات المضافة</>
              )}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
            <Link
              to="/admin/manuscripts/add"
              className="bg-olive-green text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 text-center"
            >
              إضافة مخطوطة جديدة
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-blue-gray mb-3">
                البحث في المخطوطات
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

        {/* Loading State */}
        {(loading || searchLoading) && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
              {searchLoading
                ? `جاري البحث في المخطوطات... صفحة ${searchCurrentPage}`
                : `جاري تحميل المخطوطات من الخادم... صفحة ${currentPage}`}
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

        {/* Manuscripts Table */}
        {manuscripts.length > 0 ? (
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
                      التصنيف
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      النوع
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      التاريخ
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      عدد المواد
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      الحجم
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {manuscripts.map(
                    (manuscript: ContentEntry, index: number) => (
                      <tr
                        key={manuscript.id}
                        className={index % 2 === 0 ? "bg-ivory" : "bg-white"}
                      >
                        <td className="px-6 py-4 w-24">
                          {getImageUrl(manuscript.cover_image_link) ? (
                            <img
                              src={
                                getImageUrl(manuscript.cover_image_link) ||
                                "/placeholder-manuscript.png"
                              }
                              alt={manuscript.title}
                              className="w-20 h-20 object-contain rounded bg-gray-50"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-manuscript.png";
                                target.onerror = null;
                              }}
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-50 rounded flex items-center justify-center">
                              <span className="text-2xl">📜</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-semibold text-blue-gray">
                          {manuscript.title}
                        </td>
                        <td className="px-6 py-4 text-medium-gray">
                          {manuscript.author}
                        </td>
                        <td className="px-4 py-4">
                          <span className="bg-heritage-gold-dark text-white px-4 py-1 rounded-full text-sm font-semibold shadow-sm">
                            {getCategoryName(manuscript.category)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-olive-green text-white px-3 py-1 rounded-full text-sm">
                            {manuscript.kind === 16 ? "مخطوط" : "غير محدد"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-medium-gray">
                          {manuscript.date}
                        </td>
                        <td className="px-6 py-4 text-medium-gray">
                          {manuscript.pages || manuscript.page_count || 0}
                        </td>
                        <td className="px-6 py-4 text-medium-gray">
                          {manuscript.size || "غير محدد"}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex space-x-2 space-x-reverse">
                            <Link
                              to={`/admin/manuscripts/edit/${manuscript.id}`}
                              className="bg-blue-gray text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 transition-colors"
                            >
                              تعديل
                            </Link>
                            <button
                              onClick={() => handleDelete(manuscript.id)}
                              disabled={deleting === manuscript.id}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              {deleting === manuscript.id
                                ? "جاري الحذف..."
                                : "حذف"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📜</div>
            <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
              لا توجد مخطوطات
            </h3>
            <p className="text-medium-gray mb-8">
              لم يتم إضافة أي مخطوطات بعد. ابدأ بإضافة مخطوطة جديدة.
            </p>
            <Link
              to="/admin/manuscripts/add"
              className="bg-olive-green text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
            >
              إضافة مخطوطة جديدة
            </Link>
          </div>
        )}

        {/* Pagination Controls */}
        {((activeSearchTerm !== "" && searchTotalPages > 1) ||
          (activeSearchTerm === "" &&
            allManuscripts &&
            allManuscripts.length > itemsPerPage)) && (
          <div className="bg-white rounded-lg shadow-lg border-t border-gray-200 px-6 py-4 mt-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-medium-gray">
                {activeSearchTerm !== "" ? (
                  <>
                    صفحة {searchCurrentPage} من أصل {searchTotalPages} صفحة -
                    عرض {manuscripts.length} مخطوطة من أصل {totalSearchCount}{" "}
                    نتيجة بحث
                  </>
                ) : (
                  <>
                    صفحة {currentPage} من أصل {totalPages} صفحة - عرض{" "}
                    {allManuscripts.length} مخطوطة من أصل{" "}
                    {paginatedData?.count || 0} إدخال
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

export default AdminManuscripts;
