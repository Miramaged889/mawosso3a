import React from "react";
import { Link } from "react-router-dom";
import { ContentEntry } from "../services/api";

interface ItemCardProps {
  item: ContentEntry;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  // Get category name safely
  const getCategoryName = () => {
    if (typeof item.category === "object" && item.category?.name) {
      return item.category.name;
    }
    // Show tags if available, otherwise show "غير محدد"
    return item.tags || "غير محدد";
  };

  // Get subcategory name safely
  const getSubcategoryName = () => {
    if (typeof item.subcategory === "object" && item.subcategory?.name) {
      return item.subcategory.name;
    }
    return null;
  };

  // Get page count safely
  const getPageCount = () => {
    return item.pages || item.page_count || 0;
  };

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

  // Determine the correct route based on entry type and category
  const getDetailRoute = () => {
    // First check entry_type if available
    if (item.entry_type) {
      switch (item.entry_type) {
        case "manuscript":
          return `/manuscripts/${item.id}`;
        case "book":
          return `/books-on-chinguitt/${item.id}`;
        case "investigation":
          return `/tahqiq/${item.id}`;
        default:
          break;
      }
    }

    // If no entry_type, try to determine from category ID
    let categoryId = null;

    // Get category ID from different possible formats
    if (typeof item.category === "object" && item.category?.id) {
      categoryId = item.category.id;
    } else if (typeof item.category === "number") {
      categoryId = item.category;
    }

    // Route based on category ID
    if (categoryId === 10) {
      // مخطوطات
      return `/manuscripts/${item.id}`;
    }

    if (categoryId === 9) {
      // مؤلفات عن شنقيط
      return `/books-on-chinguitt/${item.id}`;
    }

    if (categoryId === 8) {
      // تحقيقات الشناقطة
      return `/tahqiq/${item.id}`;
    }

    if (categoryId === 7) {
      // الأخبار العلمية
      return `/scientific-news/${item.id}`;
    }

    if (categoryId === 6) {
      // مكتبة التعليم النظامي
      return `/formal-education-library/${item.id}`;
    }

    if (categoryId === 5) {
      // فوائد
      return `/benefits/${item.id}`;
    }

    if (categoryId === 4) {
      // المنوعات
      return `/varieties/${item.id}`;
    }

    if (categoryId === 3) {
      // العلوم الاجتماعية
      return `/social-sciences/${item.id}`;
    }

    if (categoryId === 2) {
      // العلوم اللغوية
      return `/linguistic-sciences/${item.id}`;
    }

    if (categoryId === 1) {
      // العلوم الشرعية
      return `/sharia-sciences/${item.id}`;
    }

    // Fallback: try to determine from category name if ID is not available
    const categoryName = getCategoryName();

    if (categoryName === "مخطوطات") {
      return `/manuscripts/${item.id}`;
    }

    if (categoryName === "مؤلفات عن شنقيط") {
      return `/books-on-chinguitt/${item.id}`;
    }

    if (categoryName === "تحقيقات الشناقطة") {
      return `/tahqiq/${item.id}`;
    }

    if (categoryName === "الأخبار العلمية") {
      return `/scientific-news/${item.id}`;
    }

    if (categoryName === "مكتبة التعليم النظامي") {
      return `/formal-education-library/${item.id}`;
    }

    if (categoryName === "فوائد") {
      return `/benefits/${item.id}`;
    }

    if (categoryName === "المنوعات") {
      return `/varieties/${item.id}`;
    }

    if (categoryName === "العلوم الاجتماعية") {
      return `/social-sciences/${item.id}`;
    }

    if (categoryName === "العلوم اللغوية") {
      return `/linguistic-sciences/${item.id}`;
    }

    if (categoryName === "العلوم الشرعية") {
      return `/sharia-sciences/${item.id}`;
    }

    // Default to books if no specific category is found
    return `/books-on-chinguitt/${item.id}`;
  };

  const coverImageUrl = getImageUrl(item.cover_image_link);
  const pdfFileUrl = getPdfUrl(item.pdf_file_link);
  const detailRoute = getDetailRoute();

  // Handle PDF download
  const handlePdfDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pdfFileUrl) {
      window.open(pdfFileUrl, "_blank");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {coverImageUrl ? (
        <div className="h-48 overflow-hidden relative group">
          <Link to={detailRoute}>
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
          </Link>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        </div>
      ) : (
        <div className="h-48 bg-gray-50 flex items-center justify-center">
          <Link to={detailRoute}>
            <div className="text-gray-400 text-4xl">📜</div>
          </Link>
        </div>
      )}
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
          <div className="flex flex-wrap gap-2">
            <span className="bg-heritage-gold text-white px-3 py-1 rounded-full text-sm">
              {getCategoryName()}
            </span>
            {getSubcategoryName() && (
              <span className="bg-blue-gray text-white px-3 py-1 rounded-full text-sm">
                {getSubcategoryName()}
              </span>
            )}
          </div>
          <span className="text-medium-gray text-sm">{item.date}</span>
        </div>
        <Link to={detailRoute}>
          <h3 className="text-xl font-louguiya font-bold text-blue-gray mb-3 leading-tight hover:text-heritage-gold transition-colors">
            {item.title}
          </h3>
        </Link>
        <p className="text-heritage-gold font-semibold mb-2">{item.author}</p>
        <p className="text-medium-gray leading-relaxed mb-4 line-clamp-3">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-medium-gray">
              {getPageCount()} صفحة
            </span>
            <div className="flex gap-2">
              {pdfFileUrl && (
                <button
                  onClick={handlePdfDownload}
                  title="تحميل PDF"
                  className="text-red-500 hover:text-red-700 transition-colors p-1 rounded"
                >
                  📄
                </button>
              )}
              {coverImageUrl && (
                <span title="صورة الغلاف متوفرة" className="text-blue-500">
                  🖼️
                </span>
              )}
            </div>
          </div>
          <Link
            to={detailRoute}
            className="bg-olive-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300 text-sm font-semibold"
          >
            عرض التفاصيل
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
