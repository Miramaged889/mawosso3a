import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEntry, useEntries } from "../hooks/useApi";
import { ContentEntry } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";
import ItemCard from "../components/ItemCard";

const ScientificNewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? parseInt(id) : null;

  const { data: news, error } = useEntry(numericId);
  const { data: relatedData } = useEntries({ category: "7" });

  // Debug image URLs
  React.useEffect(() => {
    if (news) {
      console.log("Scientific News cover_image:", news.cover_image);
      console.log(
        "Scientific News full URL:",
        news.cover_image
          ? news.cover_image.startsWith("http")
            ? news.cover_image
            : `https://chinguitipedia.alldev.org${news.cover_image}`
          : null
      );
    }
  }, [news]);

  const relatedItems = React.useMemo(() => {
    if (!relatedData || !news) return [];
    return (relatedData as ContentEntry[])
      .filter(
        (contentItem: ContentEntry) =>
          contentItem.id !== numericId &&
          typeof contentItem.category === "object" &&
          typeof news.category === "object" &&
          contentItem.category?.id === news.category?.id
      )
      .slice(0, 3);
  }, [relatedData, news, numericId]);

  // Format image URL
  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `https://chinguitipedia.alldev.org${url}`;
  };

  if (error || !news) {
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

  const coverImageUrl = getImageUrl(news.cover_image);
  const pdfFileUrl = getImageUrl(news.pdf_file);

  // Get category name safely
  const getCategoryName = () => {
    if (typeof news.category === "object" && news.category?.name) {
      return news.category.name;
    }
    return "غير محدد";
  };

  // Get subcategory name safely
  const getSubcategoryName = () => {
    if (typeof news.subcategory === "object" && news.subcategory?.name) {
      return news.subcategory.name;
    }
    return null;
  };

  // Get page count safely
  const getPageCount = () => {
    return news.pages || news.page_count || 0;
  };

  const breadcrumbItems = [
    { label: "آخر الأخبار العلمية", path: "/scientific-news" },
    { label: news.title }
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="md:flex">
              {/* Image Section */}
              <div className="md:w-1/3">
                {coverImageUrl ? (
                  <div className="h-64 md:h-full">
                    <img
                      src={coverImageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-manuscript.png";
                        target.onerror = null;
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-64 md:h-full bg-gray-50 flex items-center justify-center">
                    <div className="text-gray-400 text-6xl">📰</div>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="md:w-2/3 p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-heritage-gold text-white px-3 py-1 rounded-full text-sm">
                    {getCategoryName()}
                  </span>
                  {getSubcategoryName() && (
                    <span className="bg-blue-gray text-white px-3 py-1 rounded-full text-sm">
                      {getSubcategoryName()}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-amiri font-bold text-blue-gray mb-4">
                  {news.title}
                </h1>

                <p className="text-heritage-gold font-semibold text-lg mb-4">
                  {news.author}
                </p>

                <p className="text-medium-gray mb-6 leading-relaxed">
                  {news.description}
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm text-medium-gray">
                    {news.date}
                  </span>
                  {getPageCount() > 0 && (
                    <span className="text-sm text-medium-gray">
                      {getPageCount()} صفحة
                    </span>
                  )}
                  {news.language && (
                    <span className="text-sm text-medium-gray">
                      {news.language}
                    </span>
                  )}
                </div>

                <div className="flex gap-4">
                  {pdfFileUrl && (
                    <button
                      onClick={() => window.open(pdfFileUrl, "_blank")}
                      className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center space-x-2 space-x-reverse"
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
          </div>

          {/* Full Description */}
          {news.content && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-6">
                الوصف التفصيلي
              </h2>
              <div className="prose prose-lg max-w-none text-medium-gray leading-relaxed">
                {news.content}
              </div>
            </div>
          )}

          {/* Related Items */}
          {relatedItems.length > 0 && (
            <div>
              <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-8 text-center">
                أخبار ذات صلة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedItems.map((contentItem) => (
                  <ItemCard
                    key={contentItem.id}
                    item={contentItem}
                    linkPrefix="/scientific-news"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScientificNewsDetail; 