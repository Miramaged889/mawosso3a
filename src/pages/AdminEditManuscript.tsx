import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCategories, useAuth, useEntry, useKinds } from "../hooks/useApi";
import { apiClient } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";

const AdminEditManuscript: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, initialized, validateToken } = useAuth();
  const { data: categories } = useCategories();
  const { data: kinds } = useKinds();
  const {
    data: manuscript,
    loading: manuscriptLoading,
    error: manuscriptError,
  } = useEntry(parseInt(id || "0"));

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: 0,
    date: "2024-01-01",
    description_header: "",
    description: [""],
    content: "",
    language: "العربية",
    tags: "",
    page_count: "",
    size: "",
    kind: 16,
    cover_image_link: "",
    pdf_file_link: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use all categories
  const allCategories = categories || [];

  // Filter kinds for manuscripts (مخطوط - kind 16)
  const availableKinds = kinds?.filter((kind) => kind.id === 16) || [];

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, initialized, navigate]);

  // Load manuscript data when available
  useEffect(() => {
    if (manuscript) {
      setFormData({
        title: manuscript.title || "",
        author: manuscript.author || "",
        category:
          typeof manuscript.category === "object" &&
          manuscript.category !== null
            ? manuscript.category.id
            : (manuscript.category as number) || 0,
        date: manuscript.date || "2024-01-01",
        description_header: manuscript.description_header || "",
        description: Array.isArray(manuscript.description)
          ? manuscript.description
          : [manuscript.description || ""],
        content: manuscript.content || "",
        language: manuscript.language || "العربية",
        tags: manuscript.tags || "",
        page_count:
          manuscript.page_count?.toString() ||
          manuscript.pages?.toString() ||
          "",
        size: manuscript.size?.toString() || "",
        kind: manuscript.kind || 16,
        cover_image_link: manuscript.cover_image_link || "",
        pdf_file_link: manuscript.pdf_file_link || "",
      });
    }
  }, [manuscript]);

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

  const handleDescriptionChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: prev.description.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const addDescriptionField = () => {
    setFormData((prev) => ({
      ...prev,
      description: [...prev.description, ""],
    }));
  };

  const removeDescriptionField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      description: prev.description.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.category ||
      !formData.description_header.trim()
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
        description_header: formData.description_header.trim(),
        description: formData.description.filter((item) => item.trim() !== ""),
        content: formData.content.trim(),
        language: formData.language.trim(),
        tags: formData.tags.trim(),
        page_count: pageCount,
        size: formData.size.trim() || null,
        kind: 16, // Set to مخطوط (kind 16) for manuscripts
        published: true,
      };

      // Add links to data if they exist
      if (formData.cover_image_link.trim()) {
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

      try {
        await apiClient.updateEntry(parseInt(id || "0"), entryData);
        alert("تم تحديث المخطوطة بنجاح!");
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
    { label: "تعديل المخطوطة" },
  ];

  if (manuscriptLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-lg">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (manuscriptError || !manuscript) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-lg text-red-600">لم يتم العثور على المخطوطة</p>
          <button
            onClick={() => navigate("/admin/manuscripts")}
            className="mt-4 bg-olive-green text-white px-6 py-2 rounded-lg"
          >
            العودة إلى إدارة المخطوطات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">تعديل المخطوطة</h1>
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
                placeholder="أدخل عنوان المخطوطة"
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
            <label className="block mb-2">عنوان الوصف *</label>
            <input
              type="text"
              name="description_header"
              value={formData.description_header}
              onChange={handleChange}
              className="w-full border p-3 rounded text-right"
              required
              placeholder="عنوان الوصف"
            />
          </div>
          <div>
            <label className="block mb-2">وصف المحتوى</label>
            {formData.description.map((desc, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={desc}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                  className="flex-1 border p-3 rounded text-right"
                  placeholder={`وصف ${index + 1}`}
                />
                {formData.description.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDescriptionField(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  >
                    -
                  </button>
                )}
                {index === formData.description.length - 1 && (
                  <button
                    type="button"
                    onClick={addDescriptionField}
                    className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
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
              {isSubmitting ? "جاري التحديث..." : "تحديث المخطوطة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditManuscript;
