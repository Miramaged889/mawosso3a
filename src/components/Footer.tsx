import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-gray text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-4 space-x-reverse mb-4">
              <img
                src="log.png"
                alt="الموسوعة الشنقيطية"
                className="w-20 h-20 rounded-full object-cover bg-white p-1"
              />
              <h3 className="text-2xl font-amiri font-bold">
                الموسوعة الشنقيطية
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              موقع يهتم بجمع التراث العلمي لعلماء وكتاب بلاد شنقيط (موريتانيا)،
              والدراسات التي كتبت عن تلك البلاد وأهلها
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a
                href="https://chat.whatsapp.com/GSOaMw8XauwDEuXJ7kIDYH"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-heritage-gold transition-colors"
                aria-label="انضم إلى مجموعة الواتساب - Join WhatsApp Group"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </a>
              <a
                href="https://t.me/chinguitipedianet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-heritage-gold transition-colors"
                aria-label="تابعنا على تيليجرام - Follow us on Telegram"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/chinguitpedia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-heritage-gold transition-colors"
                aria-label="تابعنا على فيسبوك - Follow us on Facebook"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-amiri font-bold mb-4 text-center">روابط سريعة</h4>
            <ul className="space-y-2 text-center">
              <li>
                <Link
                  to="/manuscripts"
                  className="text-gray-300 hover:text-heritage-gold transition-colors"
                >
                  المخطوطات
                </Link>
              </li>
              <li>
                <Link
                  to="/tahqiq"
                  className="text-gray-300 hover:text-heritage-gold transition-colors"
                >
                  تحقيقات
                </Link>
              </li>
              <li>
                <Link
                  to="/books-on-chinguitt"
                  className="text-gray-300 hover:text-heritage-gold transition-colors"
                >
                  مؤلفات
                </Link>
              </li>
              <li>
                <Link
                  to="/about-chinguit"
                  className="text-gray-300 hover:text-heritage-gold transition-colors"
                >
                  عن شنقيط
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="text-lg font-amiri font-bold mb-4 text-center">من نحن</h4>
            <ul className="space-y-2 text-center">
              <li>
                <Link
                  to="/about-chinguit"
                  className="text-gray-300 hover:text-heritage-gold transition-colors"
                >
                  الكل
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-heritage-gold transition-colors"
                >
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-heritage-gold transition-colors"
                >
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-amiri font-bold mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center  space-x-2 space-x-reverse">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+22241803272</span>
              </li>
              <li className="flex items-center space-x-2 space-x-reverse">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>chinguitipedia@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 mb-4 md:mb-0">
              © 2024 الموسوعة الشنقيطية. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-6 space-x-reverse">
              <Link
                to="/terms"
                className="text-gray-300 hover:text-heritage-gold transition-colors"
              >
                الشروط والأحكام
              </Link>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-heritage-gold transition-colors"
              >
                سياسة الخصوصية
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
