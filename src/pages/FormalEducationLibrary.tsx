import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useEntries } from "../hooks/useApi";
import { ContentEntry } from "../services/api";
import ItemCard from "../components/ItemCard";
import SearchBar from "../components/SearchBar";
import Breadcrumb from "../components/Breadcrumb";

const FormalEducationLibrary: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl || "الكل"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch entries for Formal Education Library from API using category ID
  const {
    data: entriesData,
    loading,
    error,
  } = useEntries({
    category: "6",
  });

  const items = (entriesData as ContentEntry[]) || [];

  const filteredItems = useMemo(() => {
    let filtered = items;
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item: ContentEntry) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [items, searchQuery]);

  React.useEffect(() => {
    if (categoryFromUrl) {
      handleCategoryFilter(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const breadcrumbItems = [{ label: "مكتبة التعليم النظامي" }];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-amiri font-bold text-blue-gray mb-4">
            مكتبة التعليم النظامي
          </h1>
          <p className="text-lg text-medium-gray max-w-3xl mx-auto leading-relaxed">
            اكتشف مجموعتنا الشاملة من مواد التعليم النظامي والمناهج الأكاديمية
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            onSearch={handleSearch}
            placeholder="ابحث في مكتبة التعليم النظامي..."
          />
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="text-center mb-8">
            <p className="text-medium-gray">
              عدد النتائج:{" "}
              <span className="font-bold text-heritage-gold">
                {filteredItems.length}
              </span>{" "}
              عنصر
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
              خطأ في تحميل البيانات
            </h3>
            <p className="text-medium-gray">
              حدث خطأ أثناء تحميل مكتبة التعليم النظامي. يرجى المحاولة مرة أخرى.
            </p>
          </div>
        )}

        {/* Items Grid */}
        {!loading && !error && filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item: ContentEntry) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎓</div>
              <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                لا توجد نتائج
              </h3>
              <p className="text-medium-gray">
                لم نجد أي عناصر تطابق بحثك. جرب كلمات مفتاحية أخرى.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FormalEducationLibrary;
