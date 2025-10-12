import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCategories,
  useSubcategories,
  useAuth,
  useEntry,
  useKinds,
} from "../hooks/useApi";
import { apiClient } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";

const AdminEditPost: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, initialized, validateToken } = useAuth();
  const { data: categories } = useCategories();
  const { data: subcategories } = useSubcategories();
  const { data: kinds } = useKinds();
  const {
    data: post,
    loading: postLoading,
    error: postError,
  } = useEntry(parseInt(id || "0"));

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    subcategory: "",
    date: "2024-01-01",
    page_count: "",
    size: "",
    kind: 0,
    description_header: "",
    description: [""],
    content: "",
    language: "العربية",
    tags: "",
    cover_image_link: "",
    pdf_file_link: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSubcategories =
    subcategories?.filter(
      (sub) => sub.category === parseInt(formData.category)
    ) || [];

  // Filter out manuscripts category (ID 10) from available categories
  const availableCategories = categories?.filter((cat) => cat.id !== 14) || [];

  // Filter kinds for posts (أخبار - kind 14)
  const availableKinds = kinds?.filter((kind) => kind.id === 14) || [];

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
        description_header: post.description_header || "",
        description: Array.isArray(post.description)
          ? post.description
          : [post.description || ""],
        content: post.content || "",
        language: post.language || "العربية",
        tags: post.tags || "",
        page_count: post.page_count?.toString() || post.pages?.toString() || "",
        size: post.size?.toString() || "",
        kind: post.kind || 0,
        cover_image_link: post.cover_image_link || "",
        pdf_file_link: post.pdf_file_link || "",
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

      // معالجة حقل page_count و size بشكل صحيح
      const pageCount =
        formData.page_count.trim() === ""
          ? null
          : parseInt(formData.page_count) || null;

      const sizeValue =
        formData.size.trim() === "" ? null : parseInt(formData.size) || null;

      const entryData: any = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: parseInt(formData.category),
        date: formData.date,
        description_header: formData.description_header.trim(),
        description: JSON.stringify(
          formData.description.filter((item) => item.trim() !== "")
        ),
        content: formData.content.trim(),
        language: formData.language.trim(),
        tags: formData.tags.trim(),
        page_count: pageCount,
        size: sizeValue,
        kind: 14, // Set to أخبار (kind 14) for posts
        published: true,
      };

      // Only add subcategory if it's selected and valid
      if (formData.subcategory && formData.subcategory !== "") {
        entryData.subcategory = parseInt(formData.subcategory);
      }

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

      // Only add pdf_file_link if it's not empty and skip validation
      if (formData.pdf_file_link.trim()) {
        entryData.pdf_file_link = formData.pdf_file_link.trim();
      }

      try {
        await apiClient.updateEntry(parseInt(id || "0"), entryData);
        alert("تم تحديث المنشور بنجاح!");
        navigate("/admin/posts");
      } catch (apiError) {
        throw apiError;
      }
    } catch (error) {
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
                {availableCategories?.map((cat) => (
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
              <label className="block mb-2">الحجم (ميجابايت)</label>
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full border p-3 rounded text-right"
                min="1"
                placeholder="اتركه فارغًا إذا كان غير معروف"
              />
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
