import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCategories,
  useSubcategories,
  useAuth,
  useKinds,
} from "../hooks/useApi";
import { apiClient, ContentEntry } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";

const AdminAddBook: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initialized, validateToken } = useAuth();
  const { data: categories, loading: categoriesLoading } = useCategories();
  const { data: subcategories, loading: subcategoriesLoading } =
    useSubcategories();
  const { data: kinds, loading: kindsLoading } = useKinds();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    entry_type: "book" as ContentEntry["entry_type"],
    category: 0, // تعيين القيمة الافتراضية للتصنيف إلى 0
    subcategory: 0,
    date: "2024-01-01", // تعيين التاريخ الافتراضي
    description: "",
    content: "",
    language: "العربية",
    tags: "",
    page_count: "",
    size: "",
    kind: 0,
    cover_image_link: "",
    pdf_file_link: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter subcategories to exclude those belonging to category 10
  const availableSubcategories =
    subcategories?.filter(
      (sub) => sub.category === formData.category && sub.category !== 10
    ) || [];

  // Filter out manuscripts category (ID 10) from available categories
  const availableCategories = categories?.filter((cat) => cat.id !== 10) || [];

  // Filter kinds for books (كتاب or محتوي or عن شنقيط)
  const availableKinds =
    kinds?.filter(
      (kind) =>
        kind.name === "كتاب" ||
        kind.name === "محتوي" ||
        kind.name === "عن شنقيط"
    ) || [];

  // Redirect if not authenticated
  React.useEffect(() => {
    if (initialized && !isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, initialized, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "category" || name === "subcategory" || name === "kind"
          ? parseInt(value) || 0
          : value,
      ...(name === "category" ? { subcategory: 0 } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.category
    ) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate token
      const isValid = await validateToken();
      if (!isValid) {
        alert("انتهت صلاحية جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى.");
        navigate("/admin");
        return;
      }

      console.log("Starting submission with valid token");

      // Handle page_count and size properly
      const pageCount =
        formData.page_count.trim() === ""
          ? undefined
          : parseInt(formData.page_count) || undefined;

      const sizeValue =
        formData.size.trim() === ""
          ? undefined
          : parseInt(formData.size) || undefined;

      const entryData: any = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        entry_type: formData.entry_type,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        date: formData.date,
        page_count: pageCount,
        size: sizeValue,
        kind: formData.kind,
        description: formData.description.trim(),
        content: formData.content.trim(),
        language: formData.language.trim(),
        tags: formData.tags.trim(),
        published: true,
        // Remove slug - let backend generate it automatically
      };

      // إضافة روابط إلى البيانات إذا كانت موجودة
      if (formData.cover_image_link.trim()) {
        // إضافة http:// إذا لم يكن موجوداً
        let coverImageLink = formData.cover_image_link.trim();
        if (
          coverImageLink &&
          !coverImageLink.startsWith("http://") &&
          !coverImageLink.startsWith("https://")
        ) {
          coverImageLink = "http://" + coverImageLink;
        }
        entryData.cover_image_link = coverImageLink;
      }

      if (formData.pdf_file_link.trim()) {
        // إضافة http:// إذا لم يكن موجوداً
        let pdfFileLink = formData.pdf_file_link.trim();
        if (
          pdfFileLink &&
          !pdfFileLink.startsWith("http://") &&
          !pdfFileLink.startsWith("https://")
        ) {
          pdfFileLink = "http://" + pdfFileLink;
        }
        entryData.pdf_file_link = pdfFileLink;
      }

      // Debug info
      console.log("Entry data:", entryData);
      console.log("Links:", {
        cover_image_link: formData.cover_image_link || "none",
        pdf_file_link: formData.pdf_file_link || "none",
      });

      console.log("Submitting entry data with links");

      try {
        await apiClient.createEntry(entryData);
        alert("تم حفظ العنصر بنجاح!");
        navigate("/admin/books");
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

  if (categoriesLoading || subcategoriesLoading || kindsLoading) {
    return (
      <div className="min-h-screen bg-ivory">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-lg">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "لوحة التحكم", path: "/admin" },
    { label: "إدارة الكتب", path: "/admin/books" },
    { label: "إضافة عنصر جديد" },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">إضافة عنصر جديد</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">العنوان *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-3 rounded text-right"
                required
                placeholder="أدخل العنوان"
              />
            </div>
            <div>
              <label className="block mb-2">المؤلف/المحقق *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full border p-3 rounded text-right"
                required
                placeholder="أدخل اسم المؤلف أو المحقق"
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
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
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
              <label className="block mb-2">النوع *</label>
              <select
                name="kind"
                value={formData.kind}
                onChange={handleChange}
                className="w-full border p-3 rounded text-right"
                required
              >
                <option value="">اختر النوع</option>
                {availableKinds.map((kind) => (
                  <option key={kind.id} value={kind.id}>
                    {kind.name}
                  </option>
                ))}
              </select>
            </div>
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
              <label className="block mb-2">عدد المواد</label>
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
              <label className="block mb-2">الحجم</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full border p-3 rounded text-right"
                placeholder="مثال: 2.5 MB"
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
              <label className="block mb-2 font-semibold">
                رابط صورة الغلاف
              </label>
              <input
                type="text"
                name="cover_image_link"
                value={formData.cover_image_link}
                onChange={handleChange}
                className="w-full mb-2 p-3 border rounded text-right"
                placeholder="https://example.com/cover-image.jpg"
              />
              <p className="text-sm text-gray-600 mt-1">
                أدخل رابط مباشر لصورة الغلاف
              </p>
            </div>

            <div className="border p-4 rounded bg-gray-50">
              <label className="block mb-2 font-semibold">رابط ملف PDF</label>
              <input
                type="text"
                name="pdf_file_link"
                value={formData.pdf_file_link}
                onChange={handleChange}
                className="w-full mb-2 p-3 border rounded text-right"
                placeholder="https://example.com/document.pdf"
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
            <label className="block mb-2">المحتوى</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              className="w-full border p-3 rounded text-right"
              placeholder="محتوى تفصيلي (اختياري)"
            ></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/books")}
              className="px-6 py-2 border rounded"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ العنصر"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddBook;
