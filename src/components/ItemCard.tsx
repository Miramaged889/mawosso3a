import React from "react";
import { Link } from "react-router-dom";
import { ContentEntry } from "../services/api";

interface ItemCardProps {
  item: ContentEntry;
  linkPrefix: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, linkPrefix }) => {
  // Get category name safely
  const getCategoryName = () => {
    if (typeof item.category === "object" && item.category?.name) {
      return item.category.name;
    }
    return "غير محدد";
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

  // Format image URL
  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `https://chinguitipedia.alldev.org${url}`;
  };

  const coverImageUrl = getImageUrl(item.cover_image);
  const pdfFileUrl = getImageUrl(item.pdf_file);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {coverImageUrl ? (
        <div className="h-48 overflow-hidden relative group">
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
        <div className="h-48 bg-gray-50 flex items-center justify-center">
          <div className="text-gray-400 text-4xl">📜</div>
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
        <h3 className="text-xl font-amiri font-bold text-blue-gray mb-3 leading-tight">
          {item.title}
        </h3>
        <p className="text-heritage-gold font-semibold mb-2">{item.author}</p>
        <p className="text-medium-gray leading-relaxed mb-4 line-clamp-3">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-medium-gray">
              {getPageCount()} صفحة
            </span>
            <div className="flex gap-1">
              {pdfFileUrl && (
                <span
                  title="ملف PDF متوفر"
                  className="text-red-500 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pdfFileUrl) window.open(pdfFileUrl, "_blank");
                  }}
                >
                  📄
                </span>
              )}
              {coverImageUrl && (
                <span title="صورة الغلاف متوفرة" className="text-blue-500">
                  🖼️
                </span>
              )}
            </div>
          </div>
          <Link
            to={`${linkPrefix}/${item.id}`}
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
