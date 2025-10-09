import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ContentEntry, Subcategory } from "../services/api";

interface ItemCardProps {
  item: ContentEntry;
}

// Cache for subcategories to avoid multiple API calls
let subcategoriesCache: Subcategory[] | null = null;
let subcategoriesPromise: Promise<Subcategory[]> | null = null;

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  // Fetch subcategories on component mount with caching
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (subcategoriesCache) {
        setSubcategories(subcategoriesCache);
        return;
      }
      if (subcategoriesPromise) {
        try {
          const data = await subcategoriesPromise;
          setSubcategories(data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
        return;
      }
      subcategoriesPromise = (async () => {
        try {
          let allSubcategories: Subcategory[] = [];
          let nextUrl = "api/subcategories/?limit=100";
          while (nextUrl) {
            const response = await fetch(nextUrl);
            const data = await response.json();
            allSubcategories = [...allSubcategories, ...(data.results || [])];
            nextUrl = data.next
              ? data.next.replace(/^https?:\/\/[^\/]+/, "")
              : null;
          }
          subcategoriesCache = allSubcategories;
          setSubcategories(allSubcategories);
          return allSubcategories;
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          throw error;
        }
      })();
      try {
        await subcategoriesPromise;
      } catch {}
    };
    fetchSubcategories();
  }, []);

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
    if (!item.kind) return null;
    const kindNames: { [key: number]: string } = {
      1: "كتاب",
      14: "أخبار",
      15: "المؤلفات",
      16: "مخطوط",
      17: "التحقيقات",
      18: "عن الشنقيط",
    };
    return kindNames[item.kind] || null;
  };

  // Get subcategory name safely
  const getSubcategoryName = () => {
    if (typeof item.subcategory === "object" && item.subcategory?.name) {
      return item.subcategory.name;
    } else if (typeof item.subcategory === "number" && subcategories) {
      // Find subcategory by ID from fetched subcategories
      const subcategory = subcategories.find(
        (sub) => sub.id === item.subcategory
      );
      return subcategory?.name || null;
    }
    return null;
  };

  // Get page count safely
  const getPageCount = () => {
    return item.pages || item.page_count || 0;
  };



  // Check if author should be displayed (hide if "Unknown Author")
  const shouldShowAuthor = () => {
    return (
      item.author &&
      item.author.trim() !== "" &&
      item.author !== "Unknown Author"
    );
  };

  // Get category slug safely
  const getCategorySlug = () => {
    if (typeof item.category === "object" && item.category?.slug) {
      return item.category.slug;
    } else if (typeof item.category === "number") {
      // Map category IDs to slugs based on API response
      const categorySlugs: { [key: number]: string } = {
        1: "uncategorized",
        32: "مقaلaت",
        33: "فوaئd",
        34: "aلكل",
        67: "خطب-و-دروس",
        99: "aلaخبaر-aلعلمية",
        100: "aلعلوم-aلشرعية",
        109: "aلعلوم-aللغوية",
        118: "3lom_Agtma3ya",
        122: "مكتبة-aلتعليم-aلنظaمي",
        127: "aلمنوعaت",
      };
      return categorySlugs[item.category] || "uncategorized";
    }
    return "uncategorized";
  };

  // Determine the correct route based on kind and category
  const getDetailRoute = () => {
    // Get category slug first to check for special category routing
    let categorySlug = null;
    if (typeof item.category === "object" && item.category?.slug) {
      categorySlug = item.category.slug;
    } else if (typeof item.category === "number") {
      categorySlug = getCategorySlug();
    }

    // Route based on category slug first (for specific category routing)
    if (categorySlug === "aلمنوعaت") {
      // المنوعات - always route to varieties regardless of kind
      return `/varieties/${item.id}`;
    }
    if (categorySlug === "فوaئd") {
      // فوائد - always route to benefits regardless of kind
      return `/benefits/${item.id}`;
    }
    if (categorySlug === "aلعلوم-aللغوية") {
      // العلوم اللغوية - always route to linguistic sciences regardless of kind
      return `/linguistic-sciences/${item.id}`;
    }
    if (categorySlug === "sharia-sciences") {
      // العلوم الشرعية - always route to sharia sciences regardless of kind
      return `/sharia-sciences/${item.id}`;
    }
    if (categorySlug === "3lom_Agtma3ya") {
      // علوم أخرى - always route to social sciences regardless of kind
      return `/social-sciences/${item.id}`;
    }
    if (categorySlug === "مقaلaت") {
      // مقالات
      return `/varieties/${item.id}`;
    }

    if (categorySlug === "مكتبة-aلتعليم-aلنظaمي") {
      // مكتبة التعليم النظامي
      return `/formal-education-library/${item.id}`;
    }

    // Route based on kind slug for other categories
    const getKindSlug = () => {
      // Map kind IDs to slugs
      const kindSlugs: { [key: number]: string } = {
        1: "book",
        14: "mnshor",
        15: "lmolft",
        16: "lmkhtott",
        17: "lthkykt",
        18: "aan-lshnkyt",
      };
      return kindSlugs[item.kind || 0] || null;
    };

    const kindSlug = getKindSlug();

    if (kindSlug === "book") {
      // كتاب
      return `/books-on-chinguitt/${item.id}`;
    }
    if (kindSlug === "mnshor") {
      // أخبار
      return `/scientific-news/${item.id}`;
    }
    if (kindSlug === "lmolft") {
      // المولفات
      return `/books-on-chinguitt/${item.id}`;
    }
    if (kindSlug === "lmkhtott") {
      // مخطوط
      return `/manuscripts/${item.id}`;
    }
    if (kindSlug === "lthkykt") {
      // التحقيقات
      return `/tahqiq/${item.id}`;
    }
    if (kindSlug === "aan-lshnkyt") {
      // عن الشنقيط
      return `/about-chinguit/${item.id}`;
    }

    // Default to books if no specific category is found
    return `/books-on-chinguitt/${item.id}`;
  };

    const coverImageUrl = item.cover_image_link || null;
    const detailRoute = getDetailRoute();

    useEffect(() => {
      if (coverImageUrl) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = coverImageUrl;
        link.fetchPriority = "high";
        document.head.appendChild(link);
        return () => {
          document.head.removeChild(link);
        };
      }
    }, [coverImageUrl]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {coverImageUrl ? (
        <div className="h-48 overflow-hidden relative group">
          <Link to={detailRoute}>
            <img
              src={coverImageUrl}
              alt={item.title}
              fetchPriority="high"
              width="800"
              height="600"
              decoding="async"
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
            {/* Kind Badge - only show for books (kind 1) */}
            {getKindName() && (
              <span className="bg-olive-green text-white px-3 py-1 rounded-full text-sm font-semibold">
                {getKindName()}
              </span>
            )}
            {/* Category Badge */}
            <span className="bg-heritage-gold-dark text-white px-3 py-1 rounded-full text-sm font-semibold">
              {getCategoryName()}
            </span>

            {/* Subcategory Badge */}
            {getSubcategoryName() && (
              <span className="bg-blue-gray text-white px-3 py-1 rounded-full text-sm font-semibold">
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
        {shouldShowAuthor() && (
          <p className="text-heritage-gold font-semibold mb-2">{item.author}</p>
        )}
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
