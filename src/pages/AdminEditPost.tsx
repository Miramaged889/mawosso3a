import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCategories,
  useSubcategories,
  useAuth,
  useEntry,
} from "../hooks/useApi";
import { apiClient } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";

const AdminEditPost: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, initialized, validateToken } = useAuth();
  const { data: categories, loading: categoriesLoading } = useCategories();
  const { data: subcategories, loading: subcategoriesLoading } =
    useSubcategories();
  const {
    data: post,
    loading: postLoading,
    error: postError,
  } = useEntry(parseInt(id || "0"));

  const fileInputRefs = {
    cover_image: useRef<HTMLInputElement>(null),
  };

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    subcategory: "",
    date: "2024-01-01",
    page_count: "",
    description: "",
    content: "",
    language: "العربية",
    tags: "",
    cover_image: null as File | null,
    pdf_file: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCategory = categories?.find(
    (cat) => cat.id === parseInt(formData.category)
  );
  const availableSubcategories =
    subcategories?.filter(
      (sub) => sub.category === parseInt(formData.category)
    ) || [];

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, initialized, navigate]);

  // Load post data when available
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        author: post.author || "",
        category:
          typeof post.category === "object" && post.category !== null
            ? post.category.id.toString()
            : post.category !== null && post.category !== undefined
            ? post.category.toString()
            : "",
        subcategory:
          typeof post.subcategory === "object" && post.subcategory !== null
            ? post.subcategory.id.toString()
            : post.subcategory !== null && post.subcategory !== undefined
            ? post.subcategory.toString()
            : "",
        date: post.date || "2024-01-01",
        description: post.description || "",
        content: post.content || "",
        language: post.language || "العربية",
        tags: post.tags || "",
        page_count: post.page_count?.toString() || post.pages?.toString() || "",
        cover_image: null,
        pdf_file: post.pdf_file || "",
      });
    }
  }, [post]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "category" ? value : value,
      // Reset subcategory when category changes
      ...(name === "category" ? { subcategory: "" } : {}),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      if (name === "cover_image") {
        const validTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        if (!validTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
          alert("صورة غير صالحة. الحد الأقصى 5MB وبصيغة JPG/PNG/WebP");
          if (fileInputRefs.cover_image.current) {
            fileInputRefs.cover_image.current.value = "";
          }
          return;
        }
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.category ||
      !formData.description.trim()
    ) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);

    try {
      // تحقق من صلاحية الرمز المميز
      const isValid = await validateToken();
      if (!isValid) {
        alert("انتهت صلاحية جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى.");
        navigate("/admin");
        return;
      }

      console.log("Starting submission with valid token");

      // معالجة حقل page_count بشكل صحيح
      const pageCount =
        formData.page_count.trim() === ""
          ? null
          : parseInt(formData.page_count) || null;

      const entryData: any = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: parseInt(formData.category),
        date: formData.date,
        description: formData.description.trim(),
        content: formData.content.trim(),
        language: formData.language.trim(),
        tags: formData.tags.trim(),
        page_count: pageCount,
        pdf_file: formData.pdf_file.trim() || undefined,
        published: true,
      };

      // Only add subcategory if it's selected and valid
      if (formData.subcategory && formData.subcategory !== "") {
        entryData.subcategory = parseInt(formData.subcategory);
      }

      // تجميع الملفات إذا كانت موجودة
      const files: {
        cover_image?: File;
      } = {};

      if (formData.cover_image) {
        files.cover_image = formData.cover_image;
      }

      // إضافة معلومات تصحيح
      console.log("Entry data:", entryData);
      console.log("Files:", {
        cover_image: files.cover_image ? files.cover_image.name : "none",
        pdf_file: formData.pdf_file || "none",
      });

      // تحقق من وجود ملفات
      const hasFiles = files.cover_image;

      // إرسال البيانات والملفات في طلب واحد
      console.log(
        `Submitting entry data ${hasFiles ? "with" : "without"} files`
      );

      try {
        await apiClient.updateEntry(
          parseInt(id || "0"),
          entryData,
          hasFiles ? files : undefined
        );
        alert("تم تحديث المنشور بنجاح!");
        navigate("/admin/posts");
      } catch (apiError) {
        console.error("API Error:", apiError);
        throw apiError;
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "حدث خطأ غير متوقع";

      if (
        errorMessage.includes("صلاحية") ||
        errorMessage.includes("تسجيل الدخول")
      ) {
        alert(
          "يبدو أن جلسة تسجيل الدخول قد انتهت. يرجى تسجيل الدخول مرة أخرى."
        );
        navigate("/admin");
      } else {
        alert(`حدث خطأ أثناء الحفظ: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbItems = [
    { label: "لوحة التحكم", path: "/admin" },
    { label: "إدارة المنشورات", path: "/admin/posts" },
    { label: "تعديل المنشور" },
  ];

  if (postLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-lg">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-lg text-red-600">لم يتم العثور على المنشور</p>
          <button
            onClick={() => navigate("/admin/posts")}
            className="mt-4 bg-olive-green text-white px-6 py-2 rounded-lg"
          >
            العودة إلى إدارة المنشورات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">تعديل المنشور</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">عنوان المنشور *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-3 rounded text-right"
                required
                placeholder="أدخل عنوان المنشور"
              />
            </div>
            <div>
              <label className="block mb-2">المؤلف *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full border p-3 rounded text-right"
                required
                placeholder="أدخل اسم المؤلف"
              />
            </div>
            <div>
              <label className="block mb-2">التصنيف الرئيسي *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-3 rounded text-right"
                required
              >
                <option value="">اختر التصنيف</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {availableSubcategories.length > 0 && (
              <div>
                <label className="block mb-2">التصنيف الفرعي</label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full border p-3 rounded text-right"
                >
                  <option value="">اختر التصنيف الفرعي (اختياري)</option>
                  {availableSubcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block mb-2">التاريخ</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border p-3 rounded text-right"
              />
            </div>
            <div>
              <label className="block mb-2">عدد الصفحات</label>
              <input
                type="number"
                name="page_count"
                value={formData.page_count}
                onChange={handleChange}
                className="w-full border p-3 rounded text-right"
                min="1"
                placeholder="اتركه فارغًا إذا كان غير معروف"
              />
            </div>
            <div>
              <label className="block mb-2">اللغة</label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full border p-3 rounded text-right"
              />
            </div>
            <div>
              <label className="block mb-2">الكلمات المفتاحية</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full border p-3 rounded text-right"
                placeholder="كلمات مفتاحية مفصولة بفواصل"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border p-4 rounded bg-gray-50">
              <label className="block mb-2 font-semibold">صورة الغلاف</label>
              <input
                type="file"
                name="cover_image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full mb-2"
                ref={fileInputRefs.cover_image}
              />
              <p className="text-sm text-gray-600 mt-1">
                الحد الأقصى 5MB بصيغة JPG/PNG/WebP
              </p>
              {post.cover_image && !formData.cover_image && (
                <div className="mt-2 text-sm text-blue-600">
                  الصورة الحالية: متوفرة
                </div>
              )}
            </div>

            <div className="border p-4 rounded bg-gray-50">
              <label className="block mb-2 font-semibold">رابط ملف PDF</label>
              <input
                type="url"
                name="pdf_file"
                value={formData.pdf_file}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right"
                placeholder="https://example.com/file.pdf"
              />
              <p className="text-sm text-gray-600 mt-1">
                أدخل رابط مباشر لملف PDF
              </p>
            </div>
          </div>

          <div>
            <label className="block mb-2">الوصف المختصر *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border p-3 rounded text-right"
              required
              placeholder="وصف مختصر للمحتوى"
            ></textarea>
          </div>
          <div>
            <label className="block mb-2">المحتوى التفصيلي</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              className="w-full border p-3 rounded text-right"
              placeholder="وصف تفصيلي شامل للمحتوى"
            ></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/posts")}
              className="px-6 py-2 border rounded"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              {isSubmitting ? "جاري التحديث..." : "تحديث المنشور"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditPost;
