import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEntry } from "../hooks/useApi";
import Breadcrumb from "../components/Breadcrumb";
import { makeUrlsClickable } from "../utils/textUtils";

const ScientificNewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? parseInt(id) : null;

  const { data: item, error, loading } = useEntry(numericId);

  // Enhanced image URL formatting
  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    // Handle both relative and absolute paths
    if (url.startsWith("/")) {
      return `https://chinguitipedia.alldev.org${url}`;
    }
    return `https://chinguitipedia.alldev.org/${url}`;
  };

  // Enhanced PDF URL formatting
  const getPdfUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    // Handle both relative and absolute paths
    if (url.startsWith("/")) {
      return `https://chinguitipedia.alldev.org${url}`;
    }
    return `https://chinguitipedia.alldev.org/${url}`;
  };

  // Handle PDF download
  const handlePdfDownload = () => {
    if (pdfFileUrl) {
      window.open(pdfFileUrl, "_blank");
    }
  };

  // Handle share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.title || "خبر علمي من شنقيط",
        text: item?.description || "",
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("تم نسخ الرابط إلى الحافظة");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-olive-green"></div>
          <h2 className="text-2xl font-amiri font-bold text-blue-gray mt-4">
            جاري التحميل...
          </h2>
          <p className="text-medium-gray">Loading... يرجى الانتظار</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-3xl font-amiri font-bold text-blue-gray mb-4">
            الخبر غير موجود
          </h2>
          <p className="text-medium-gray mb-8">
            عذراً، لم نتمكن من العثور على الخبر المطلوب.
          </p>
          <Link
            to="/scientific-news"
            className="bg-olive-green text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
          >
            العودة إلى الأخبار العلمية
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "الأخبار العلمية", path: "/scientific-news" },
    { label: item.title },
  ];

  const coverImageUrl = getImageUrl(item.cover_image_link);
  const pdfFileUrl = getPdfUrl(item.pdf_file_link);

  // Get category name safely
  const getCategoryName = () => {
    if (typeof item.category === "object" && item.category?.name) {
      return item.category.name;
    } else if (typeof item.category === "number") {
      // Map category IDs to names
      const categoryNames: { [key: number]: string } = {
        33: "فوائد",
        34: "الكل",
        99: "الأخبار العلمية",
        100: "العلوم الشرعية",
        109: "العلوم اللغوية",
        118: "علوم أجتماعية",
        122: "مكتبة التعليم النظامي",
        127: "المنوعات",
      };
      return categoryNames[item.category] || "غير محدد";
    }
    return "غير محدد";
  };

  // Get kind name safely
  const getKindName = () => {
    if (item?.kind) {
      const kindNames: { [key: number]: string } = {
        1: "كتاب",
        14: "منشور",
        15: "المولفات",
        16: "المخطوطات",
        17: "التحقيقات",
        18: "عن الشنقيط",
      };
      return kindNames[item?.kind] || "غير محدد";
    }
    return "غير محدد";
  };

  // Get page count safely
  const getPageCount = () => {
    return item.pages || item.page_count || 0;
  };

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            {coverImageUrl ? (
              <div className="h-64 md:h-80 overflow-hidden relative group">
                <img
                  src={coverImageUrl}
                  alt={item.title}
                  className="w-full h-full object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-manuscript.png";
                    target.onerror = null;
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
              </div>
            ) : (
              <div className="h-64 md:h-80 bg-gray-50 flex items-center justify-center">
                <div className="text-gray-400 text-6xl">📰</div>
              </div>
            )}

            <div className="p-8">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between mb-6">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-heritage-gold text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {getCategoryName()}
                  </span>
                  <span className="bg-olive-green text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {getKindName()}
                  </span>
                </div>
                <span className="text-medium-gray">{item.date}</span>
              </div>

              {/* Title and Author */}
              <h1 className="text-3xl md:text-4xl font-amiri font-bold text-blue-gray mb-4 leading-tight">
                {item.title}
              </h1>
              {item.author &&
                item.author !== "Unknown Author" &&
                item.author.trim() !== "" && (
                  <h2 className="text-xl text-heritage-gold font-semibold mb-6">
                    {item.author}
                  </h2>
                )}

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-ivory rounded-lg">
                <div className="text-center">
                  <div className="text-xl font-bold text-olive-green">
                    {getPageCount() || "غير محدد"}
                  </div>
                  <div className="text-medium-gray text-sm">عدد المواد</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-olive-green">
                    {item.size || "غير محدد"}
                  </div>
                  <div className="text-medium-gray text-sm">الحجم</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-olive-green">
                    {item.language || "غير محدد"}
                  </div>
                  <div className="text-medium-gray text-sm">اللغة</div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-blue-gray mb-2">التصنيف</h4>
                  <p className="text-medium-gray">{getCategoryName()}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-gray mb-2">الحالة</h4>
                  <p className="text-medium-gray">
                    {item.published ? "منشور" : "غير منشور"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-lg max-w-none p-4 rounded-lg">
                <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                  وصف الخبر
                </h3>
                <p className="text-medium-gray leading-relaxed mb-6">
                  {makeUrlsClickable(item.content || item.description || "")}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                {pdfFileUrl && (
                  <button
                    onClick={handlePdfDownload}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center space-x-2 space-x-reverse font-semibold"
                  >
                    <span>تحميل الملف</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="bg-heritage-gold text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center space-x-2 space-x-reverse"
                >
                  <span>مشاركة</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificNewsDetail;
