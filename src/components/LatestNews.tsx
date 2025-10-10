import { Link } from "react-router-dom";
import { useEntriesPaginated } from "../hooks/useApi";
import { useMemo } from "react";

const LatestNews = () => {
  // Fetch entries from the Scientific News category
  const { data: paginatedData, loading } = useEntriesPaginated(
    {
      category: "aلaخبaر-aلعلمية", // Scientific News category slug
    },
    1,
    3 // Fetch only 3 items
  );

  // Get the entries and format them for display
  const news = useMemo(() => {
    if (!paginatedData?.results) return [];

    // Sort by date (newest first) and take first 3
    const sortedEntries = [...paginatedData.results].sort((a, b) => {
      const dateA = new Date(a.date || a.created_at || "");
      const dateB = new Date(b.date || b.created_at || "");
      return dateB.getTime() - dateA.getTime();
    });

    return sortedEntries.slice(0, 3).map((entry) => ({
      id: entry.id,
      title: entry.title || "",
      excerpt:
        entry.description ||
        entry.full_description?.substring(0, 100) + "..." ||
        "",
      date: entry.date
        ? new Date(entry.date).toLocaleDateString("ar-SA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
      category:
        typeof entry.category === "object"
          ? entry.category.name
          : "الأخبار العلمية",
    }));
  }, [paginatedData]);

  return (
    <section
      className="py-16 bg-ivory islamic-pattern"
      style={{ minHeight: "600px" }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-louguiya font-bold text-blue-gray mb-4">
            الأخبار العلمية
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green"></div>
          </div>
        )}

        {/* News Grid */}
        {!loading && news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ minHeight: "250px" }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-heritage-gold-dark text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                      {item.category}
                    </span>
                    <span className="text-medium-gray text-sm">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-louguiya font-bold text-blue-gray mb-3 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-medium-gray leading-relaxed mb-4">
                    {item.excerpt}
                  </p>
                  <Link
                    to={`/scientific-news/${item.id}`}
                    className="text-olive-green font-semibold hover:text-heritage-gold transition-colors inline-block"
                  >
                    اقرأ المزيد ←
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-medium-gray text-lg">
              لا توجد أخبار متاحة حالياً
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/scientific-news"
            className="bg-olive-green text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
          >
            عرض جميع الأخبار
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
