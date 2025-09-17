import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/all-entries?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="bg-gradient-to-br from-ivory to-hover-beige islamic-pattern py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-louguiya font-bold text-blue-gray mb-6">
            الموسوعة الشنقيطية
          </h1>
          <p className="text-xl md:text-2xl text-dark-gray mb-8 leading-relaxed">
            موقع يهتم بجمع التراث العلمي لعلماء وكتاب بلاد شنقيط (موريتانيا)،
            والدراسات التي كتبت عن تلك البلاد وأهلها
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="ابحث في الموسوعة..."
                  className="w-full py-4 px-6 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-green focus:border-transparent text-right text-lg shadow-lg"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg
                    className="h-6 w-6 text-gray-400"
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
              <button
                onClick={handleSearch}
                className="bg-olive-green text-white px-8 py-4 rounded-lg hover:bg-opacity-90 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                بحث
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/books-on-chinguitt"
              className="bg-olive-green text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              تصفح مؤلفات الشناقطة
            </Link>
            <Link
              to="/about-chinguit"
              className="bg-white text-heritage-gold border-2 border-heritage-gold px-8 py-3 rounded-lg text-lg font-semibold hover:bg-heritage-gold hover:text-white transition-all duration-300"
            >
              تصفح مؤلفات غير الشناقطة
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
