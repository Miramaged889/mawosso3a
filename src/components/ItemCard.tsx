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
    } else if (typeof item.category === "number") {
      // Map category IDs to names based on API response
      const categoryNames: { [key: number]: string } = {
        1: "Uncategorized",
        32: "مقالات",
        33: "فوائد",
        34: "الكل",
        67: "خطب و دروس",
        99: "الأخبار العلمية",
        100: "العلوم الشرعية",
        109: "العلوم اللغوية",
        118: "علوم أخرى",
        122: "مكتبة التعليم النظامي",
        127: "المنوعات",
      };
      return categoryNames[item.category] || "غير محدد";
    }
    return "غير محدد";
  };

  // Get kind name safely
  const getKindName = () => {
    if (!item.kind) return null;
    const kindNames: { [key: number]: string } = {
      1: "كتاب",
      14: "منشور",
      15: "المولفات",
      16: "المخطوطات",
      17: "التحقيقات",
      18: "عن الشنقيط",
    };
    return kindNames[item.kind] || null;
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

    return `${url}`;
  };

  // Determine the correct route based on kind and category
  const getDetailRoute = () => {
    // Route based on kind first
    if (item.kind === 1) {
      // كتاب
      return `/books-on-chinguitt/${item.id}`;
    }
    if (item.kind === 14) {
      // منشور
      return `/varieties/${item.id}`;
    }
    if (item.kind === 15) {
      // المولفات
      return `/books-on-chinguitt/${item.id}`;
    }
    if (item.kind === 16) {
      // المخطوطات
      return `/manuscripts/${item.id}`;
    }
    if (item.kind === 17) {
      // التحقيقات
      return `/tahqiq/${item.id}`;
    }
    if (item.kind === 18) {
      // عن الشنقيط
      return `/about-chinguit/${item.id}`;
    }

    // If no specific kind or kind is not 1, try to determine from category ID
    let categoryId = null;

    // Get category ID from different possible formats
    if (typeof item.category === "object" && item.category?.id) {
      categoryId = item.category.id;
    } else if (typeof item.category === "number") {
      categoryId = item.category;
    }

    // Route based on category ID (updated to match new API categories)
    if (categoryId === 99) {
      // الأخبار العلمية
      return `/scientific-news/${item.id}`;
    }

    if (categoryId === 122) {
      // مكتبة التعليم النظامي
      return `/formal-education-library/${item.id}`;
    }

    if (categoryId === 33) {
      // فوائد
      return `/benefits/${item.id}`;
    }

    if (categoryId === 127) {
      // المنوعات
      return `/varieties/${item.id}`;
    }

    if (categoryId === 109) {
      // العلوم اللغوية
      return `/linguistic-sciences/${item.id}`;
    }

    if (categoryId === 100) {
      // العلوم الشرعية
      return `/sharia-sciences/${item.id}`;
    }

    if (categoryId === 118) {
      // علوم أخرى
      return `/social-sciences/${item.id}`;
    }

    if (categoryId === 67) {
      // خطب و دروس
      return `/varieties/${item.id}`;
    }

    if (categoryId === 32) {
      // مقالات
      return `/varieties/${item.id}`;
    }

    // Default to books if no specific category is found
    return `/books-on-chinguitt/${item.id}`;
  };

  const coverImageUrl = getImageUrl(item.cover_image_link);
  const detailRoute = getDetailRoute();

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
            {/* Category Badge */}
            <span className="bg-heritage-gold text-white px-3 py-1 rounded-full text-sm font-semibold">
              {getCategoryName()}
            </span>
            {/* Kind Badge - only show for books (kind 1) */}
            {getKindName() && (
              <span className="bg-olive-green text-white px-3 py-1 rounded-full text-sm font-semibold">
                {getKindName()}
              </span>
            )}
            {/* Subcategory Badge */}
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
        {/* Metadata Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-medium-gray flex items-center gap-1">
              <span className="text-gray-400">📄</span>
              {getPageCount()} صفحة
            </span>
            {item.language && (
              <span className="text-sm text-medium-gray flex items-center gap-1">
                <span className="text-gray-400">🌐</span>
                {item.language}
              </span>
            )}
          </div>
          {/* Action Button */}
          <div className="flex justify-end">
            <Link
              to={detailRoute}
              className="bg-olive-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300 text-sm font-semibold"
            >
              عرض التفاصيل
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
