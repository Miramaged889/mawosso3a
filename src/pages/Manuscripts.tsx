import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useEntriesPaginated, useSubcategories } from "../hooks/useApi";

import ItemCard from "../components/ItemCard";
import SearchBar from "../components/SearchBar";
import Breadcrumb from "../components/Breadcrumb";
import Pagination from "../components/Pagination";

const Manuscripts: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const subcategoryFromUrl = searchParams.get("subcategory");

  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl || "الكل"
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    subcategoryFromUrl || "الكل"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Fetch paginated manuscripts from API - filter by kind slug "lmkhtott" (مخطوط)
  const {
    data: paginatedData,
    loading,
    error,
    refetch,
  } = useEntriesPaginated(
    {
      kind: "lmkhtott",
    },
    currentPage,
    itemsPerPage
  );

  // Fetch subcategories
  const { data: subcategories, loading: subcategoriesLoading } =
    useSubcategories();

  const manuscripts = paginatedData?.results || [];
  const totalItems = paginatedData?.count || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get available subcategories for the selected category
  const availableSubcategories = useMemo(() => {
    if (!subcategories) return [];

    if (selectedCategory === "الكل") {
      return subcategories;
    }

    return subcategories.filter((sub) => {
      const category = manuscripts.find(
        (m) =>
          typeof m.category === "object" &&
          m.category?.name === selectedCategory
      )?.category;
      return typeof category === "object" && sub.category === category.id;
    });
  }, [subcategories, selectedCategory, manuscripts]);

  const filteredItems = useMemo(() => {
    let filtered = manuscripts;

    // Apply category filter
    if (selectedCategory !== "الكل") {
      filtered = filtered.filter(
        (item) =>
          typeof item.category === "object" &&
          item.category?.name === selectedCategory
      );
    }

    // Apply subcategory filter
    if (selectedSubcategory !== "الكل") {
      filtered = filtered.filter(
        (item) =>
          typeof item.subcategory === "object" &&
          item.subcategory?.name === selectedSubcategory
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description_header
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [manuscripts, selectedCategory, selectedSubcategory, searchQuery]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (categoryFromUrl) {
      handleCategoryFilter(categoryFromUrl);
    }

    if (subcategoryFromUrl) {
      handleSubcategoryFilter(subcategoryFromUrl);
    }
  }, [categoryFromUrl, subcategoryFromUrl]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    // Reset subcategory when category changes
    setSelectedSubcategory("الكل");
  };

  const handleSubcategoryFilter = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  const breadcrumbItems = [{ label: "المخطوطات" }];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-amiri font-bold text-blue-gray mb-4">
            مخطوطات
          </h1>
          <p className="text-lg text-medium-gray max-w-3xl mx-auto">
            استكشف المخطوطات التي ألفها الشناقطة
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            onSearch={handleSearch}
            placeholder="ابحث في المخطوطات..."
          />
        </div>

        {/* Subcategory Filter - Only show if subcategories are available and a category is selected */}
        {selectedCategory !== "الكل" &&
          availableSubcategories.length > 0 &&
          !subcategoriesLoading && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-center mb-3 text-blue-gray">
                التصنيفات الفرعية
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  key="all-subcategories"
                  onClick={() => handleSubcategoryFilter("الكل")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedSubcategory === "الكل"
                      ? "bg-blue-gray text-white shadow-md"
                      : "bg-white text-blue-gray border border-blue-gray hover:bg-blue-gray hover:text-white"
                  }`}
                >
                  الكل
                </button>

                {availableSubcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    onClick={() => handleSubcategoryFilter(subcategory.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedSubcategory === subcategory.name
                        ? "bg-blue-gray text-white shadow-md"
                        : "bg-white text-blue-gray border border-blue-gray hover:bg-blue-gray hover:text-white"
                    }`}
                  >
                    {subcategory.name}
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-medium-gray">
            عدد النتائج:{" "}
            <span className="font-bold text-heritage-gold">
              {searchQuery ? filteredItems.length : totalItems}
            </span>{" "}
            مخطوطة
          </p>

          {/* Data source indicator */}
          {error && (
            <div className="mt-2 text-xs text-orange-600">
              <button
                onClick={refetch}
                className="underline hover:text-orange-800"
              >
                إعادة المحاولة
              </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-8 mb-8 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-3xl mb-2">⚠️</div>
            <h3 className="text-xl font-amiri font-bold text-blue-gray mb-2">
              تعذر الاتصال بالخادم
            </h3>
            <p className="text-medium-gray mb-4">
              يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.
            </p>
            <button
              onClick={refetch}
              className="bg-heritage-gold text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Manuscripts Grid */}
        {!loading && !error && filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((manuscript) => (
              <ItemCard key={manuscript.id} item={manuscript} />
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📜</div>
              <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                لا توجد نتائج
              </h3>
              <p className="text-medium-gray">
                لم نجد أي مخطوطات تطابق بحثك. جرب كلمات مفتاحية أخرى.
              </p>
            </div>
          )
        )}

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && !searchQuery && (
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

export default Manuscripts;
