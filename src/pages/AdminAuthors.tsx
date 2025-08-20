import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEntries, useAuth, useCategories } from "../hooks/useApi";
import { apiClient, ContentEntry } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";

const AdminAuthors: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initialized } = useAuth();
  const { data: entriesData, error, refetch } = useEntries();
  const { data: categories } = useCategories();
  const [deleting, setDeleting] = useState<number | null>(null);

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

  // Filter authors based on kind field (مؤلفات)
  const authors = (entriesData || []).filter((item: ContentEntry) => {
    // Only include items with kind 11 (مؤلفات)
    return item.kind === 11;
  });

  // Debug category data
  React.useEffect(() => {
    if (authors.length > 0) {
      console.log("Sample author category data:", authors[0]?.category);
    }
  }, [authors]);

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
              إدارة المؤلفات
            </h1>
            <p className="text-medium-gray">عرض وإدارة جميع المؤلفات المضافة</p>
          </div>
          <Link
            to="/admin/authors/add"
            className="bg-olive-green text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
          >
            إضافة مؤلفة جديدة
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            خطأ في تحميل البيانات: {error}
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
                        <span className="bg-heritage-gold text-white px-3 py-1 rounded-full text-sm">
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
      </div>
    </div>
  );
};

export default AdminAuthors;
