import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories, useAuth, useKinds } from "../hooks/useApi";
import { apiClient } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";

const AdminAddManuscript: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initialized, validateToken } = useAuth();
  const { data: categories } = useCategories();
  const { data: kinds } = useKinds();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: 10, // تعيين القيمة الافتراضية للتصنيف إلى المخطوطات (10)
    date: "2024-01-01", // تعيين التاريخ الافتراضي
    description: "",
    content: "",
    language: "العربية",
    tags: "",
    page_count: "",
    size: "",
    kind: 0,
    cover_image_link: "",
    pdf_file_link: "", // تغيير من ملف إلى رابط
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use all categories
  const allCategories = categories || [];

  // Filter kinds for manuscripts (مخطوطه)
  const availableKinds = kinds?.filter((kind) => kind.name === "مخطوطه") || [];

  useEffect(() => {
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
        name === "category" || name === "kind" ? parseInt(value) || 0 : value,
    }));
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
        entry_type: "manuscript" as const,
        category: formData.category,
        date: formData.date,
        description: formData.description.trim(),
        content: formData.content.trim(),
        language: formData.language.trim(),
        tags: formData.tags.trim(),
        page_count: pageCount,
        size: formData.size.trim() || null,
        kind: formData.kind,
        published: true, // تعيين القيمة الافتراضية للنشر إلى true
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

      // إضافة معلومات تصحيح
      console.log("Entry data:", entryData);
      console.log("Links:", {
        cover_image_link: formData.cover_image_link || "none",
        pdf_file_link: formData.pdf_file_link || "none",
      });

      // إرسال البيانات
      console.log("Submitting entry data with links");

      try {
        await apiClient.createEntry(entryData);
        alert("تم حفظ المخطوطة بنجاح!");
        navigate("/admin/manuscripts");
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
    { label: "إدارة المخطوطات", path: "/admin/manuscripts" },
    { label: "إضافة مخطوطة جديدة" },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">إضافة مخطوطة جديدة</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">عنوان المخطوطة *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-3 rounded text-right"
                required
                placeholder="مثال:ادخل العنوان"
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
                placeholder="مثال:ادخل المؤلف"
              />
            </div>
            <div>
              <label className="block mb-2">التصنيف *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-3 rounded text-right"
                required
              >
                <option value="">اختر التصنيف</option>
                {allCategories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
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
              placeholder="مثال:ادخل الوصف"
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
              placeholder="محتوى المخطوطة (اختياري)"
            ></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/manuscripts")}
              className="px-6 py-2 border rounded"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ المخطوطة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddManuscript;
