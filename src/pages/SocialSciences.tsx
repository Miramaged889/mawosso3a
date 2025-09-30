import React, { useState, useMemo } from "react";
import {
  useEntriesPaginated,
  useSubcategoriesByCategorySlug,
} from "../hooks/useApi";
import { ContentEntry } from "../services/api";
import ItemCard from "../components/ItemCard";
import SearchBar from "../components/SearchBar";
import Breadcrumb from "../components/Breadcrumb";
import Pagination from "../components/Pagination";

const SocialSciences: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("الكل");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    number | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Fetch paginated entries for Social Sciences from API using category slug
  const {
    data: paginatedData,
    loading,
    error,
  } = useEntriesPaginated(
    {
      category: "3lom_Agtma3ya",
      subcategory: selectedSubcategoryId
        ? selectedSubcategoryId.toString()
        : undefined,
    },
    currentPage,
    itemsPerPage
  );

  // Fetch subcategories for Social Sciences
  const { data: subcategories, loading: subcategoriesLoading } =
    useSubcategoriesByCategorySlug("3lom_Agtma3ya");

  const items = paginatedData?.results || [];
  const totalItems = paginatedData?.count || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const filteredItems = useMemo(() => {
    let filtered = items;
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item: ContentEntry) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description_header?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [items, searchQuery]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSubcategoryFilter = (
    subcategory: string,
    subcategoryId?: number
  ) => {
    setSelectedSubcategory(subcategory);
    setSelectedSubcategoryId(subcategoryId || null);
    setCurrentPage(1); // Reset to first page when changing subcategory
  };

  const breadcrumbItems = [{ label: "العلوم الاجتماعية" }];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-amiri font-bold text-blue-gray mb-4">
            العلوم الاجتماعية
          </h1>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            onSearch={handleSearch}
            placeholder="ابحث في العلوم الاجتماعية..."
          />
        </div>

        {/* Subcategory Filter - Only show if subcategories are available */}
        {subcategories && subcategories.length > 0 && !subcategoriesLoading && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-center mb-3 text-olive-green">
              التصنيفات الفرعية
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                key="all-subcategories"
                onClick={() => handleSubcategoryFilter("الكل")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedSubcategory === "الكل"
                    ? "bg-olive-green text-white shadow-md"
                    : "bg-white text-olive-green border border-olive-green hover:bg-olive-green hover:text-white"
                }`}
              >
                الكل
              </button>

              {subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() =>
                    handleSubcategoryFilter(subcategory.name, subcategory.id)
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedSubcategory === subcategory.name
                      ? "bg-olive-green text-white shadow-md"
                      : "bg-white text-olive-green border border-olive-green hover:bg-olive-green hover:text-white"
                  }`}
                >
                  {subcategory.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="text-center mb-8">
            <p className="text-medium-gray">
              عدد النتائج:{" "}
              <span className="font-bold text-heritage-gold">
                {searchQuery ? filteredItems.length : totalItems}
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
              حدث خطأ أثناء تحميل العلوم الاجتماعية. يرجى المحاولة مرة أخرى.
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
              <div className="text-6xl mb-4">🏛️</div>
              <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                لا توجد نتائج
              </h3>
              <p className="text-medium-gray">
                لم نجد أي عناصر تطابق بحثك. جرب كلمات مفتاحية أخرى.
              </p>
            </div>
          )
        )}

        {/* Pagination Controls */}
        {!loading &&
          !error &&
          totalPages > 1 &&
          !searchQuery &&
          selectedSubcategory === "الكل" && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
      </div>
    </div>
  );
};

export default SocialSciences;
