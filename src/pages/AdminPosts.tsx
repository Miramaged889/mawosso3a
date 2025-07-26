import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEntries, useAuth, useCategories } from "../hooks/useApi";
import { apiClient } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";

const AdminPosts: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initialized } = useAuth();
  const { data: entriesData, loading, error, refetch } = useEntries();
  const { data: categories } = useCategories();
  const [deleting, setDeleting] = useState<number | null>(null);

  // Format image URL
  const getImageUrl = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    return `https://chinguitipedia.alldev.org${url}`;
  };

  // Redirect if not authenticated (but wait for auth to initialize)
  React.useEffect(() => {
    if (initialized && !isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, initialized, navigate]);

  // Fix data structure - entriesData is directly an array, not an object with results
  const posts = Array.isArray(entriesData) ? entriesData : [];

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المنشور؟")) {
      setDeleting(id);
      try {
        await apiClient.deleteEntry(id);
        alert("تم حذف المنشور بنجاح!");
        refetch();
      } catch (error) {
        console.error("Error deleting entry:", error);
        alert("حدث خطأ أثناء حذف المنشور. يرجى المحاولة مرة أخرى.");
      } finally {
        setDeleting(null);
      }
    }
  };

  const getEntryTypeLabel = (type?: string) => {
    switch (type) {
      case "manuscript":
        return "مخطوطة";
      case "book":
        return "كتاب";
      case "investigation":
        return "تحقيق";
      default:
        return "منشور";
    }
  };

  // Helper function to get category name
  const getCategoryName = (category: any): string => {
    if (!category) return "غير محدد";

    if (typeof category === "object" && category.name) {
      return category.name;
    }

    if (typeof category === "string") {
      return category;
    }

    // If it's a number, look up the category name from categories data
    if (typeof category === "number" && categories) {
      const foundCategory = categories.find((cat) => cat.id === category);
      return foundCategory ? foundCategory.name : "غير محدد";
    }

    return "غير محدد";
  };

  const breadcrumbItems = [
    { label: "لوحة التحكم", path: "/admin" },
    { label: "إدارة المنشورات" },
  ];



  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-amiri font-bold text-blue-gray mb-2">
              إدارة المنشورات
            </h1>
            <p className="text-medium-gray">
              عرض وإدارة جميع المنشورات والمحتوى ({posts.length} منشور)
            </p>
          </div>
          <Link
            to="/admin/posts/add"
            className="bg-olive-green text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
          >
            إضافة منشور جديد
          </Link>
        </div>

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

        {/* Posts Table */}
        {posts.length > 0 ? (
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
                      الملفات
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, index) => (
                    <tr
                      key={post.id}
                      className={index % 2 === 0 ? "bg-ivory" : "bg-white"}
                    >
                      <td className="px-6 py-4 w-24">
                        {getImageUrl(post.cover_image) ? (
                          <img
                            src={
                              getImageUrl(post.cover_image) ||
                              "/placeholder-manuscript.png"
                            }
                            alt={post.title}
                            className="w-20 h-20 object-contain rounded bg-gray-50"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-manuscript.png";
                              target.onerror = null;
                            }}
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-50 rounded flex items-center justify-center">
                            <span className="text-2xl">📝</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-blue-gray">
                        <div className="max-w-xs truncate">{post.title}</div>
                      </td>
                      <td className="px-6 py-4 text-medium-gray">
                        <div className="max-w-xs truncate">{post.author}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-olive-green text-white px-3 py-1 rounded-full text-sm">
                          {getEntryTypeLabel(post.entry_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-heritage-gold text-white px-3 py-1 rounded-full text-sm">
                          {getCategoryName(post.category)}
                        </span>
                        {post.subcategory &&
                          typeof post.subcategory === "object" && (
                            <div className="mt-1">
                              <span className="bg-olive-green text-white px-2 py-1 rounded text-xs">
                                {post.subcategory.name}
                              </span>
                            </div>
                          )}
                      </td>
                      <td className="px-6 py-4 text-medium-gray text-sm">
                        {post.date}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-1 space-x-reverse">
                          {post.cover_image && (
                            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                              صورة
                            </span>
                          )}
                          {post.pdf_file && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                              PDF
                            </span>
                          )}
                          {!post.cover_image && !post.pdf_file && (
                            <span className="text-gray-400 text-xs">
                              لا توجد ملفات
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2 space-x-reverse">
                          <Link
                            to={`/admin/posts/edit/${post.id}`}
                            className="bg-blue-gray text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 transition-colors"
                          >
                            تعديل
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={deleting === post.id}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            {deleting === post.id ? "جاري الحذف..." : "حذف"}
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
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
              لا توجد منشورات
            </h3>
            <p className="text-medium-gray mb-8">
              لم يتم إضافة أي منشورات بعد. ابدأ بإضافة منشور جديد.
            </p>
            <Link
              to="/admin/posts/add"
              className="bg-olive-green text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
            >
              إضافة منشور جديد
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPosts;
