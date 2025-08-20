import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEntries, useAuth } from "../hooks/useApi";
import { apiClient, ContentEntry } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";

// import { manuscripts as localManuscripts } from "../data/manuscripts"; // Import local data as fallback

const AdminManuscripts: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initialized } = useAuth();
  const {
    data: entriesData,
    error,
    refetch,
  } = useEntries({
    category: "10", // Use category ID for manuscripts from API
  });
  const [deleting, setDeleting] = useState<number | null>(null);
  const [filter, setFilter] = useState("");

  // Always use API data
  const manuscripts = useMemo(() => {
    const results = entriesData || [];
    console.log("API Data:", results); // Debug log to see what data is received
    const allEntries = Array.isArray(results)
      ? (results as ContentEntry[])
      : [];

    // Filter manuscripts based on kind field (مخطوطه)
    return allEntries.filter((item: ContentEntry) => {
      // Only include items with kind 8 (مخطوطه) or 9 (عن شنقيط)
      if (item.kind === 8 || item.kind === 9) {
        return true;
      }
      return false;
    });
  }, [entriesData]);

  // Format image URL
  const getImageUrl = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    return `${url}`;
  };

  // Filter manuscripts based on search term
  const filteredManuscripts = useMemo(() => {
    if (!filter) return manuscripts;

    const searchTerm = filter.toLowerCase();
    return manuscripts.filter(
      (m: ContentEntry) =>
        m.title.toLowerCase().includes(searchTerm) ||
        m.author.toLowerCase().includes(searchTerm) ||
        (typeof m.category === "object" &&
          m.category?.name?.toLowerCase().includes(searchTerm)) ||
        (typeof m.subcategory === "object" &&
          m.subcategory?.name?.toLowerCase().includes(searchTerm))
    );
  }, [manuscripts, filter]);

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
              عرض وإدارة جميع المخطوطات المضافة ({filteredManuscripts.length})
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="بحث في المخطوطات..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <Link
              to="/admin/manuscripts/add"
              className="bg-olive-green text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 text-center"
            >
              إضافة مخطوطة جديدة
            </Link>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <div>
              <p className="font-bold">تعذر الاتصال بالخادم</p>
              <p className="text-sm">
                يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.
              </p>
            </div>
            <button
              onClick={refetch}
              className="bg-orange-700 text-white px-4 py-2 rounded hover:bg-orange-800"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Manuscripts Table */}
        {filteredManuscripts.length > 0 ? (
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
                      الملفات
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredManuscripts.map(
                    (manuscript: ContentEntry, index) => (
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
                        <td className="px-6 py-4">
                          <span className="bg-heritage-gold text-white px-3 py-1 rounded-full text-sm">
                            {typeof manuscript.category === "object"
                              ? manuscript.category?.name
                              : manuscript.tags || "غير محدد"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-olive-green text-white px-3 py-1 rounded-full text-sm">
                            {manuscript.kind === 8
                              ? "مخطوطه"
                              : manuscript.kind === 9
                              ? "عن شنقيط"
                              : manuscript.kind || "غير محدد"}
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
                            {manuscript.cover_image_link && (
                              <span
                                className="text-blue-500 cursor-pointer"
                                title="صورة الغلاف متوفرة"
                                onClick={() =>
                                  manuscript.cover_image_link &&
                                  window.open(
                                    manuscript.cover_image_link,
                                    "_blank"
                                  )
                                }
                              >
                                🖼️
                              </span>
                            )}
                            {manuscript.pdf_file_link && (
                              <span
                                className="text-red-500 cursor-pointer"
                                title="ملف PDF متوفر"
                                onClick={() =>
                                  manuscript.pdf_file_link &&
                                  window.open(
                                    manuscript.pdf_file_link,
                                    "_blank"
                                  )
                                }
                              >
                                📄
                              </span>
                            )}
                            {!manuscript.cover_image_link &&
                              !manuscript.pdf_file_link && (
                                <span className="text-gray-400">-</span>
                              )}
                          </div>
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
                            <Link
                              to={`/manuscripts/${manuscript.id}`}
                              target="_blank"
                              className="bg-olive-green text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 transition-colors"
                            >
                              عرض
                            </Link>
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
              {filter
                ? "لا توجد مخطوطات تطابق معايير البحث"
                : "لم يتم إضافة أي مخطوطات بعد. ابدأ بإضافة مخطوطة جديدة."}
            </p>
            <Link
              to="/admin/manuscripts/add"
              className="bg-olive-green text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
            >
              إضافة مخطوطة جديدة
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManuscripts;
