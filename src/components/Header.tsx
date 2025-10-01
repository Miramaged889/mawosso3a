import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-1 space-x-reverse">
            <Link
              to="/"
              className="flex items-center space-x-0 space-x-reverse"
            >
              <img
                src="img/log.png"
                alt="Chinguitipedia Logo"
                className="w-20 h-20"
              />
              <h1 className="text-xl font-louguiya font-bold text-blue-gray">
                الموسوعة الشنقيطية
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link
              to="/"
              className={`transition-colors ${
                isActive("/")
                  ? "text-heritage-gold font-semibold"
                  : "text-dark-gray hover:text-heritage-gold"
              }`}
            >
              الرئيسية
            </Link>
            <Link
              to="/books-on-chinguitt"
              className={`transition-colors ${
                isActive("/books-on-chinguitt")
                  ? "text-heritage-gold font-semibold"
                  : "text-dark-gray hover:text-heritage-gold"
              }`}
            >
              مؤلفات
            </Link>
            <Link
              to="/tahqiq"
              className={`transition-colors ${
                isActive("/tahqiq")
                  ? "text-heritage-gold font-semibold"
                  : "text-dark-gray hover:text-heritage-gold"
              }`}
            >
              تحقيقات
            </Link>
            <Link
              to="/manuscripts"
              className={`transition-colors ${
                isActive("/manuscripts")
                  ? "text-heritage-gold font-semibold"
                  : "text-dark-gray hover:text-heritage-gold"
              }`}
            >
              مخطوطات
            </Link>

            <Link
              to="/about-chinguit"
              className={`transition-colors ${
                isActive("/about-chinguit")
                  ? "text-heritage-gold font-semibold"
                  : "text-dark-gray hover:text-heritage-gold"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              عن شنقيط
            </Link>
            <Link
              to="/all-entries"
              className={`transition-colors ${
                isActive("/all-entries")
                  ? "text-heritage-gold font-semibold"
                  : "text-dark-gray hover:text-heritage-gold"
              }`}
            >
              الكل
            </Link>

            <Link
              to="/about"
              className={`transition-colors ${
                isActive("/about")
                  ? "text-heritage-gold font-semibold"
                  : "text-dark-gray hover:text-heritage-gold"
              }`}
            >
              من نحن
            </Link>
            <Link
              to="/contact"
              className={`transition-colors ${
                isActive("/contact")
                  ? "text-heritage-gold font-semibold"
                  : "text-dark-gray hover:text-heritage-gold"
              }`}
            >
              اتصل بنا
            </Link>
          </nav>

          {/* WhatsApp Button */}
          <div className="hidden md:block">
            <a
              href="https://wa.me/22241803272"
              className="bg-olive-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center space-x-2 space-x-reverse"
            >
              <span>واتساب</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-dark-gray"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`transition-colors ${
                  isActive("/")
                    ? "text-heritage-gold font-semibold"
                    : "text-dark-gray hover:text-heritage-gold"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link
                to="/books-on-chinguitt"
                className={`transition-colors ${
                  isActive("/books-on-chinguitt")
                    ? "text-heritage-gold font-semibold"
                    : "text-dark-gray hover:text-heritage-gold"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                مؤلفات
              </Link>
              <Link
                to="/tahqiq"
                className={`transition-colors ${
                  isActive("/tahqiq")
                    ? "text-heritage-gold font-semibold"
                    : "text-dark-gray hover:text-heritage-gold"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                تحقيقات
              </Link>
              <Link
                to="/manuscripts"
                className={`transition-colors ${
                  isActive("/manuscripts")
                    ? "text-heritage-gold font-semibold"
                    : "text-dark-gray hover:text-heritage-gold"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                مخطوطات
              </Link>
              <Link
                to="/all-entries"
                className={`transition-colors ${
                  isActive("/all-entries")
                    ? "text-heritage-gold font-semibold"
                    : "text-dark-gray hover:text-heritage-gold"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                الكل
              </Link>
              <Link
                to="/about-chinguit"
                className={`transition-colors ${
                  isActive("/about-chinguit")
                    ? "text-heritage-gold font-semibold"
                    : "text-dark-gray hover:text-heritage-gold"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                عن شنقيط
              </Link>
              <Link
                to="/about"
                className={`transition-colors ${
                  isActive("/about")
                    ? "text-heritage-gold font-semibold"
                    : "text-dark-gray hover:text-heritage-gold"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                من نحن
              </Link>
              <Link
                to="/contact"
                className={`transition-colors ${
                  isActive("/contact")
                    ? "text-heritage-gold font-semibold"
                    : "text-dark-gray hover:text-heritage-gold"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                اتصل بنا
              </Link>
              <a
                href="https://wa.me/22241803272"
                className="bg-olive-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300 inline-flex items-center justify-center space-x-2 space-x-reverse w-fit"
              >
                <span>واتساب</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
