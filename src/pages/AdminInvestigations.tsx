import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useAllEntriesPaginated,
  useAuth,
  useCategories,
} from "../hooks/useApi";
import { apiClient, ContentEntry } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";

const AdminInvestigations: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initialized } = useAuth();
  const [deleting, setDeleting] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(18);

  const {
    data: paginatedData,
    loading,
    error,
    refetch,
  } = useAllEntriesPaginated(currentPage, itemsPerPage, "lthkykt");
  const { data: categories } = useCategories();

  // Format image URL
  const getImageUrl = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    return `https://chinguitipedia.alldev.org${url}`;
  };

  // Redirect if not authenticated
  React.useEffect(() => {
    if (initialized && !isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, initialized, navigate]);

  // Filter investigations based on kind field (التحقيقات - kind 17, slug: lthkykt)
  const allInvestigations = useMemo(() => {
    if (!paginatedData?.results) return [];
    return paginatedData.results.filter((item: ContentEntry) => {
      // Only include items with kind 17 (التحقيقات)
      return item.kind === 17;
    });
  }, [paginatedData]);

  // Pagination logic
  const totalPages = paginatedData
    ? Math.ceil(paginatedData.count / itemsPerPage)
    : 0;
  const investigations = allInvestigations;

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Debug category data
  React.useEffect(() => {
    if (investigations.length > 0) {
      console.log(
        "Sample investigation category data:",
        investigations[0]?.category
      );
    }
  }, [investigations]);

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
    { label: "إدارة التحقيقات" },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-amiri font-bold text-blue-gray mb-2">
              إدارة التحقيقات
            </h1>
            <p className="text-medium-gray">
              عرض وإدارة جميع التحقيقات المضافة ({paginatedData?.count || 0}{" "}
              إدخال إجمالي - {allInvestigations.length} تحقيق في هذه الصفحة)
            </p>
          </div>
          <Link
            to="/admin/investigations/add"
            className="bg-olive-green text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
          >
            إضافة تحقيق جديد
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
              جاري تحميل التحقيقات من الخادم... صفحة {currentPage}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            خطأ في تحميل البيانات: {error}
            <button
              onClick={refetch}
              className="ml-4 underline hover:no-underline"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Investigations Table */}
        {investigations.length > 0 ? (
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
                      المحقق
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
                  {investigations.map((investigation, index) => (
                    <tr
                      key={investigation.id}
                      className={index % 2 === 0 ? "bg-ivory" : "bg-white"}
                    >
                      <td className="px-6 py-4 w-24">
                        {getImageUrl(investigation.cover_image_link) ? (
                          <img
                            src={
                              getImageUrl(investigation.cover_image_link) ||
                              "/placeholder-manuscript.png"
                            }
                            alt={investigation.title}
                            className="w-20 h-20 object-contain rounded bg-gray-50"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-manuscript.png";
                              target.onerror = null;
                            }}
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-50 rounded flex items-center justify-center">
                            <span className="text-2xl">🔍</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-blue-gray">
                        {investigation.title}
                      </td>
                      <td className="px-6 py-4 text-medium-gray">
                        {investigation.author}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-olive-green text-white px-3 py-1 rounded-full text-sm">
                          تحقيقات
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-heritage-gold-dark text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                          {getCategoryName(
                            investigation.category,
                            investigation.tags
                          )}
                        </span>
                        {investigation.subcategory &&
                          typeof investigation.subcategory === "object" && (
                            <div className="mt-1">
                              <span className="bg-olive-green text-white px-2 py-1 rounded text-xs">
                                {investigation.subcategory.name}
                              </span>
                            </div>
                          )}
                      </td>
                      <td className="px-6 py-4 text-medium-gray">
                        {investigation.date}
                      </td>
                      <td className="px-6 py-4 text-medium-gray">
                        {investigation.pages || investigation.page_count || 0}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2 space-x-reverse">
                          <Link
                            to={`/admin/investigations/edit/${investigation.id}`}
                            className="bg-blue-gray text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 transition-colors"
                          >
                            تعديل
                          </Link>
                          <button
                            onClick={() => handleDelete(investigation.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                            disabled={deleting === investigation.id}
                          >
                            {deleting === investigation.id
                              ? "جاري الحذف..."
                              : "حذف"}
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
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
              لا توجد تحقيقات
            </h3>
            <p className="text-medium-gray mb-8">
              لم يتم إضافة أي تحقيقات بعد. ابدأ بإضافة تحقيق جديد.
            </p>
            <Link
              to="/admin/investigations/add"
              className="bg-olive-green text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
            >
              إضافة تحقيق جديد
            </Link>
          </div>
        )}

        {/* Pagination Controls */}
        {allInvestigations && allInvestigations.length > itemsPerPage && (
          <div className="bg-white rounded-lg shadow-lg border-t border-gray-200 px-6 py-4 mt-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-medium-gray">
                صفحة {currentPage} من أصل {totalPages} صفحة - عرض{" "}
                {allInvestigations.length} تحقيق من أصل{" "}
                {allInvestigations.length || 0} إدخال
              </div>
              <div className="flex items-center gap-2">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInvestigations;
