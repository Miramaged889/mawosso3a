import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories, useSubcategories, useAuth } from "../hooks/useApi";
import { apiClient, ContentEntry } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";

const AdminAddBook: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initialized, validateToken } = useAuth();
  const { data: categories, loading: categoriesLoading } = useCategories();
  const { data: subcategories, loading: subcategoriesLoading } =
    useSubcategories();

  const fileInputRefs = {
    cover_image: useRef<HTMLInputElement>(null),
    pdf_file: useRef<HTMLInputElement>(null),
  };

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
    cover_image: null as File | null,
    pdf_file: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

 
  // Filter subcategories to exclude those belonging to category 10
  const availableSubcategories =
    subcategories?.filter(
      (sub) => sub.category === formData.category && sub.category !== 10
    ) || [];

  // Filter out manuscripts category (ID 10) from available categories
  const availableCategories = categories?.filter((cat) => cat.id !== 10) || [];

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
        name === "category" || name === "subcategory"
          ? parseInt(value) || 0
          : value,
      ...(name === "category" ? { subcategory: 0 } : {}),
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

      if (name === "pdf_file") {
        if (file.type !== "application/pdf" || file.size > 10 * 1024 * 1024) {
          alert("ملف PDF غير صالح. الحد الأقصى 10MB");
          if (fileInputRefs.pdf_file.current) {
            fileInputRefs.pdf_file.current.value = "";
          }
          return;
        }
      }

      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
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

      // Handle page_count properly
      const pageCount =
        formData.page_count.trim() === ""
          ? undefined
          : parseInt(formData.page_count) || undefined;

      const entryData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        entry_type: formData.entry_type,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        date: formData.date,
        page_count: pageCount,
        description: formData.description.trim(),
        content: formData.content.trim(),
        language: formData.language.trim(),
        tags: formData.tags.trim(),
        published: true,
      };

      // Prepare files if they exist
      const files: {
        cover_image?: File;
        pdf_file?: File;
      } = {};

      if (formData.cover_image) {
        files.cover_image = formData.cover_image;
      }

      if (formData.pdf_file) {
        files.pdf_file = formData.pdf_file;
      }

      // Debug info
      console.log("Entry data:", entryData);
      console.log("Files:", {
        cover_image: files.cover_image ? files.cover_image.name : "none",
        pdf_file: files.pdf_file ? files.pdf_file.name : "none",
      });

      const hasFiles = files.cover_image || files.pdf_file;
      console.log(
        `Submitting entry data ${hasFiles ? "with" : "without"} files`
      );

      try {
        await apiClient.createEntry(entryData, hasFiles ? files : undefined);
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



  const breadcrumbItems = [
    { label: "لوحة التحكم", path: "/admin" },
    { label: "إدارة الكتب", path: "/admin/books" },
    { label: "إضافة عنصر جديد" },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-amiri font-bold text-blue-gray mb-2">
              إضافة عنصر جديد
            </h1>
            <p className="text-medium-gray">
              أدخل معلومات الكتاب أو المخطوطة أو التحقيق الجديد
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-blue-gray mb-2">
                    نوع المحتوى *
                  </label>
                  <select
                    name="entry_type"
                    value={formData.entry_type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right"
                  >
                    <option value="book">كتاب</option>
                    <option value="investigation">تحقيق</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-blue-gray mb-2">
                    العنوان *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right"
                    placeholder="أدخل العنوان"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-blue-gray mb-2">
                    المؤلف/المحقق *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right"
                    placeholder="أدخل اسم المؤلف أو المحقق"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-blue-gray mb-2">
                    التصنيف الرئيسي *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right"
                  >
                    <option value="">اختر التصنيف</option>
                    {availableCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                {availableSubcategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-blue-gray mb-2">
                      التصنيف الفرعي
                    </label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right"
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

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-blue-gray mb-2">
                    التاريخ *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right"
                  />
                </div>

                {/* Page Count */}
                <div>
                  <label className="block text-sm font-medium text-blue-gray mb-2">
                    عدد الصفحات
                  </label>
                  <input
                    type="number"
                    name="page_count"
                    value={formData.page_count}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right"
                    placeholder="اتركه فارغًا إذا كان غير معروف"
                  />
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-blue-gray mb-2">
                    اللغة
                  </label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-blue-gray mb-2">
                    الكلمات المفتاحية
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right"
                    placeholder="كلمات مفتاحية مفصولة بفواصل"
                  />
                </div>
              </div>

              {/* File Upload Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border p-4 rounded bg-gray-50">
                  <label className="block mb-2 font-semibold">
                    صورة الغلاف
                  </label>
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
                  {formData.cover_image && (
                    <div className="mt-2 text-sm text-gray-600">
                      الملف المحدد: {formData.cover_image.name}
                    </div>
                  )}
                </div>

                <div className="border p-4 rounded bg-gray-50">
                  <label className="block mb-2 font-semibold">ملف PDF</label>
                  <input
                    type="file"
                    name="pdf_file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="w-full mb-2"
                    ref={fileInputRefs.pdf_file}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    الحد الأقصى 10MB بصيغة PDF
                  </p>
                  {formData.pdf_file && (
                    <div className="mt-2 text-sm text-gray-600">
                      الملف المحدد: {formData.pdf_file.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-blue-gray mb-2">
                  الوصف المختصر *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right resize-vertical"
                  placeholder="وصف مختصر للمحتوى"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-blue-gray mb-2">
                  المحتوى
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right resize-vertical"
                  placeholder="محتوى تفصيلي (اختياري)"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 space-x-reverse">
                <button
                  type="button"
                  onClick={() => navigate("/admin/books")}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-medium-gray hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-olive-green text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "جاري الحفظ..." : "حفظ العنصر"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddBook;
