import React, { useState, useMemo } from "react";
import { useEntries, useCategories } from "../hooks/useApi";
import { ContentEntry } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";
import ItemCard from "../components/ItemCard";

const AllEntries: React.FC = () => {
  const { data: entriesData, loading, error } = useEntries();
  const { data: categoriesData } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedKind, setSelectedKind] = useState("");

  // Get unique categories from API
  const categories = useMemo(() => {
    if (!categoriesData) return [];
    const categoryNames = categoriesData.map((cat) => cat.name).sort();
    return categoryNames;
  }, [categoriesData]);

  const kinds = useMemo(() => {
    if (!entriesData) return [];
    const uniqueKinds = new Set<string>();
    entriesData.forEach((entry: ContentEntry) => {
      if (entry.kind) {
        const kindNames: { [key: number]: string } = {
          5: "كتاب",
          6: "محتوي",
          7: "بوست",
          8: "مخطوطه",
        };
        const kindName = kindNames[entry.kind] || entry.kind.toString();
        uniqueKinds.add(kindName);
      }
    });
    return Array.from(uniqueKinds).sort();
  }, [entriesData]);

  // Filter entries based on search term and selected filters
  const filteredEntries = useMemo(() => {
    if (!entriesData) return [];

    const filtered = entriesData.filter((entry: ContentEntry) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "" ||
        (() => {
          if (typeof entry.category === "object" && entry.category?.name) {
            const matches = entry.category.name === selectedCategory;

            return matches;
          } else if (typeof entry.category === "number") {
            // Find category by ID from categoriesData
            const categoryObj = categoriesData?.find(
              (cat) => cat.id === entry.category
            );
            const matches = categoryObj?.name === selectedCategory;
            return matches;
          }
          return false;
        })();

      // Kind filter
      const matchesKind =
        selectedKind === "" ||
        (() => {
          const kindNames: { [key: number]: string } = {
            5: "كتاب",
            6: "محتوي",
            7: "بوست",
            8: "مخطوطه",
          };
          return entry.kind && kindNames[entry.kind] === selectedKind;
        })();

      return matchesSearch && matchesCategory && matchesKind;
    });


    return filtered;
  }, [entriesData, categoriesData, searchTerm, selectedCategory, selectedKind]);

  const breadcrumbItems = [
    { label: "الرئيسية", path: "/" },
    { label: "جميع المواد" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory">
        <Breadcrumb items={breadcrumbItems} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green mx-auto mb-4"></div>
            <p className="text-medium-gray">جاري تحميل المواد...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ivory">
        <Breadcrumb items={breadcrumbItems} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
              خطأ في تحميل البيانات
            </h2>
            <p className="text-medium-gray">
              عذراً، حدث خطأ أثناء تحميل المواد. يرجى المحاولة مرة أخرى.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-amiri font-bold text-blue-gray mb-4">
            جميع المواد
          </h1>
          <p className="text-lg text-medium-gray max-w-3xl mx-auto">
            استكشف جميع المواد المتاحة في موسوعة شنقيط، بما في ذلك المخطوطات
            والتحقيقات والمؤلفات والأخبار العلمية
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search Bar */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-blue-gray mb-3">
                البحث
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث في العناوين والمؤلفين والمحتوى..."
                  className="w-full py-3 pr-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-green focus:border-transparent text-right"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-blue-gray mb-3">
                التصنيف
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-green focus:border-transparent text-right"
              >
                <option value="">جميع التصنيفات</option>
                {categories.map((category: string) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Kind Filter */}
            <div>
              <label className="block text-sm font-semibold text-blue-gray mb-3">
                النوع
              </label>
              <select
                value={selectedKind}
                onChange={(e) => setSelectedKind(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-green focus:border-transparent text-right"
              >
                <option value="">جميع الأنواع</option>
                {kinds.map((kind: string) => (
                  <option key={kind} value={kind}>
                    {kind}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count and Reset Button */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-medium-gray">
              تم العثور على{" "}
              <span className="font-semibold text-olive-green text-lg">
                {filteredEntries.length}
              </span>{" "}
              مادة
              {selectedCategory && ` في تصنيف "${selectedCategory}"`}
              {selectedKind && ` من نوع "${selectedKind}"`}
              {searchTerm && ` تحتوي على "${searchTerm}"`}
            </p>
            {(searchTerm || selectedCategory || selectedKind) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSelectedKind("");
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
              >
                إعادة تعيين الفلاتر
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {filteredEntries.length > 0 ? (
          <div className="space-y-8">
            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEntries.map((entry) => (
                <ItemCard key={entry.id} item={entry} />
              ))}
            </div>

            {/* Pagination Info */}
            <div className="text-center py-8 border-t border-gray-100">
              <p className="text-medium-gray">
                عرض{" "}
                <span className="font-semibold text-olive-green">
                  {filteredEntries.length}
                </span>{" "}
                من أصل{" "}
                <span className="font-semibold text-blue-gray">
                  {entriesData?.length || 0}
                </span>{" "}
                مادة
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-amiri font-bold text-blue-gray mb-4">
              لا توجد نتائج
            </h3>
            <p className="text-medium-gray mb-8 max-w-md mx-auto">
              لم نتمكن من العثور على مواد تطابق معايير البحث المحددة. جرب تغيير
              الفلاتر أو البحث بكلمات مختلفة.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSelectedKind("");
                }}
                className="bg-olive-green text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 font-semibold"
              >
                إعادة تعيين الفلاتر
              </button>
              <button
                onClick={() => setSearchTerm("")}
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold"
              >
                مسح البحث
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEntries;
