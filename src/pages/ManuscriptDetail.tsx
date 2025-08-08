import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEntry, useEntries } from "../hooks/useApi";
import { ContentEntry } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";
import ItemCard from "../components/ItemCard";

const ManuscriptDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? parseInt(id) : null;

  const { data: manuscript, error } = useEntry(numericId);
  const { data: relatedData } = useEntries({ entry_type: "manuscript" });

  // Debug image URLs
  React.useEffect(() => {
    if (manuscript) {
      console.log("Manuscript cover_image_link:", manuscript.cover_image_link);
      console.log(
        "Manuscript full URL:",
        manuscript.cover_image_link
          ? manuscript.cover_image_link.startsWith("http")
            ? manuscript.cover_image_link
            : `https://chinguitipedia.alldev.org${manuscript.cover_image_link}`
          : null
      );
    }
  }, [manuscript]);

  const relatedItems = React.useMemo(() => {
    if (!relatedData || !manuscript) return [];
    return (relatedData as ContentEntry[])
      .filter(
        (item: ContentEntry) =>
          item.id !== numericId &&
          typeof item.category === "object" &&
          typeof manuscript.category === "object" &&
          item.category?.id === manuscript.category?.id
      )
      .slice(0, 3);
  }, [relatedData, manuscript, numericId]);

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

  if (error || !manuscript) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-3xl font-amiri font-bold text-blue-gray mb-4">
            المخطوطة غير موجودة
          </h2>
          <p className="text-medium-gray mb-8">
            عذراً، لم نتمكن من العثور على المخطوطة المطلوبة.
          </p>
          <Link
            to="/manuscripts"
            className="bg-olive-green text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
          >
            العودة إلى المخطوطات
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "المخطوطات", path: "/manuscripts" },
    { label: manuscript.title },
  ];

  const coverImageUrl = getImageUrl(manuscript.cover_image_link);
  const pdfFileUrl = getPdfUrl(manuscript.pdf_file_link);

  // Handle PDF download
  const handlePdfDownload = () => {
    if (pdfFileUrl) {
      window.open(pdfFileUrl, "_blank");
    }
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
                  alt={manuscript.title}
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
                <div className="text-gray-400 text-6xl">📜</div>
              </div>
            )}

            <div className="p-8">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between mb-6">
                <span className="bg-heritage-gold text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {typeof manuscript.category === "object"
                    ? manuscript.category.name
                    : manuscript.tags || "غير محدد"}
                </span>
                <span className="text-medium-gray">{manuscript.date}</span>
              </div>

              {/* Title and Author */}
              <h1 className="text-3xl md:text-4xl font-amiri font-bold text-blue-gray mb-4 leading-tight">
                {manuscript.title}
              </h1>
              <h2 className="text-xl text-heritage-gold font-semibold mb-6">
                {manuscript.author}
              </h2>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-ivory rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-olive-green">
                    {manuscript.page_count || manuscript.pages || "غير محدد"}
                  </div>
                  <div className="text-medium-gray">صفحة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-olive-green">
                    {manuscript.language}
                  </div>
                  <div className="text-medium-gray">اللغة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-olive-green">
                    {typeof manuscript.category === "object"
                      ? manuscript.category.name
                      : "غير محدد"}
                  </div>
                  <div className="text-medium-gray">التصنيف</div>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                  وصف المخطوطة
                </h3>
                <p className="text-medium-gray leading-relaxed mb-6">
                  {manuscript.content}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                {pdfFileUrl && (
                  <button
                    onClick={handlePdfDownload}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center space-x-2 space-x-reverse font-semibold"
                  >
                    <span>تحميل PDF</span>
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
                <button className="bg-heritage-gold text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center space-x-2 space-x-reverse">
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

          {/* Related Items */}
          {relatedItems.length > 0 && (
            <div>
              <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-8 text-center">
                مخطوطات ذات صلة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManuscriptDetail;
