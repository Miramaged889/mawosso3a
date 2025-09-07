import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAllEntriesPaginated, useAuth } from "../hooks/useApi";
import { apiClient, ContentEntry } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";


const AdminManuscripts: React.FC = () => {
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
  } = useAllEntriesPaginated(currentPage, itemsPerPage);

  // Filter manuscripts based on kind field (المخطوطات)
  const allManuscripts = useMemo(() => {
    if (!paginatedData?.results) return [];
    return paginatedData.results.filter((item: ContentEntry) => {
      // Only include items with kind 16 (المخطوطات)
      return item.kind === 16;
    });
  }, [paginatedData]);

  // Pagination logic
  const totalPages = paginatedData
    ? Math.ceil(paginatedData.count / itemsPerPage)
    : 0;
  const manuscripts = allManuscripts;

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
              عرض وإدارة جميع المخطوطات المضافة
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

        {/* Loading State */}
        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
              جاري تحميل المخطوطات من الخادم... صفحة {currentPage}
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
                              <span className="text-2xl">�</span>
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
                          <span className="bg-heritage-gold text-white px-4 py-1 rounded-full text-sm">
                            {typeof manuscript.category === "object"
                              ? manuscript.category?.name
                              : typeof manuscript.category === "number"
                              ? (() => {
                                  // Map category IDs to names
                                  const categoryNames: {
                                    [key: number]: string;
                                  } = {
                                    1: "العلوم الشرعية",
                                    2: "العلوم اللغوية",
                                    3: "العلوم الاجتماعية",
                                    4: "المتنوعات",
                                    5: "الفوائد",
                                    6: "مكتبة التعليم النظامي",
                                    7: "الأخبار العلمية",
                                    8: "الكتب عن شنقيط",
                                    9: "التحقيقات",
                                    10: "المخطوطات",
                                  };
                                  return (
                                    categoryNames[manuscript.category] ||
                                    "غير محدد"
                                  );
                                })()
                              : manuscript.tags || "غير محدد"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-olive-green text-white px-3 py-1 rounded-full text-sm">
                            {manuscript.kind === 16 ? "المخطوطات" : "غير محدد"}
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
        {allManuscripts && allManuscripts.length > itemsPerPage && (
          <div className="bg-white rounded-lg shadow-lg border-t border-gray-200 px-6 py-4 mt-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-medium-gray">
                صفحة {currentPage} من أصل {totalPages} صفحة - عرض{" "}
                {allManuscripts.length} مخطوطة من أصل {allManuscripts.length || 0}{" "}
                إدخال
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

export default AdminManuscripts;
