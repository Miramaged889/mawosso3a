
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

const Hero = () => {
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
          <p className="text-lg text-medium-gray mb-12 max-w-2xl mx-auto">
            اكتشف كنوز التراث الإسلامي من خلال مجموعة نادرة من المخطوطات والكتب
            والبحوث الإسلامية المحققة والمدروسة بعناية فائقة
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar />
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
              to="/varieties"
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