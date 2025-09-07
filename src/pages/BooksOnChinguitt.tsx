import React, { useState, useMemo } from "react";
import { useEntries } from "../hooks/useApi";
import { ContentEntry } from "../services/api";
import ItemCard from "../components/ItemCard";
import SearchBar from "../components/SearchBar";
import Breadcrumb from "../components/Breadcrumb";

const BooksOnChinguitt: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all entries from API
  const { data: entriesData, loading, error } = useEntries();

  // Filter entries by kind 1 (كتاب) - only show books
  const booksOnChinguitt = useMemo(() => {
    const results = entriesData || [];
    const allEntries = Array.isArray(results)
      ? (results as ContentEntry[])
      : [];

    return allEntries.filter((entry: ContentEntry) => {
      // Only show books with kind 1 (كتاب)
      return entry.kind === 1;
    });
  }, [entriesData]);

  const filteredItems = useMemo(() => {
    let filtered = booksOnChinguitt;
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
  }, [booksOnChinguitt, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const breadcrumbItems = [{ label: "مؤلفات عن شنقيط" }];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-amiri font-bold text-blue-gray mb-4">
            مؤلفات عن شنقيط
          </h1>
          <p className="text-lg text-medium-gray max-w-3xl mx-auto leading-relaxed">
            مجموعة مختارة من الكتب والدراسات التي تناولت تاريخ وثقافة وحضارة
            مدينة شنقيط العريقة
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            onSearch={handleSearch}
            placeholder="ابحث في المؤلفات والكتاب..."
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
              كتاب
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
              حدث خطأ أثناء تحميل الكتب. يرجى المحاولة مرة أخرى.
            </p>
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((book: ContentEntry) => (
              <ItemCard key={book.id} item={book} />
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                لا توجد نتائج
              </h3>
              <p className="text-medium-gray">
                لم نجد أي كتب تطابق بحثك. جرب كلمات مفتاحية أخرى.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BooksOnChinguitt;
