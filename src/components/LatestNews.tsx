
import { Link } from 'react-router-dom';


const LatestNews = () => {
  const news = [
    {
      title: 'إضافة مجموعة جديدة من مخطوطات الفقه المالكي',
      excerpt: 'تم إضافة 25 مخطوطة نادرة في الفقه المالكي من مكتبة شنقيط التراثية...',
      date: '15 يناير 2024',
      category: 'العلوم الشرعية'
    },
    {
      title: 'تحقيق جديد لكتاب "الدرر اللوامع" للشيخ محمد المامي',
      excerpt: 'صدر التحقيق الجديد لكتاب الدرر اللوامع في شرح جمع الجوامع...',
      date: '12 يناير 2024',
      category: 'تحقيقات'
    },
    {
      title: 'ندوة علمية حول التراث الشنقيطي',
      excerpt: 'تنظم الموسوعة ندوة علمية حول أهمية التراث الشنقيطي في الحضارة الإسلامية...',
      date: '10 يناير 2024',
      category: 'أخبار'
    }
  ];

  return (
    <section className="py-16 bg-ivory islamic-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-amiri font-bold text-blue-gray mb-4">
            آخر الأخبار العلمية
          </h2>
          <p className="text-lg text-medium-gray max-w-2xl mx-auto">
            تابع أحدث الإضافات والتحقيقات والأخبار العلمية في عالم التراث
            الإسلامي
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <article
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-heritage-gold text-white px-3 py-1 rounded-full text-sm">
                    {item.category}
                  </span>
                  <span className="text-medium-gray text-sm">{item.date}</span>
                </div>
                <h3 className="text-xl font-amiri font-bold text-blue-gray mb-3 leading-tight">
                  {item.title}
                </h3>
                <p className="text-medium-gray leading-relaxed mb-4">
                  {item.excerpt}
                </p>
                <button className="text-olive-green font-semibold hover:text-heritage-gold transition-colors">
                  اقرأ المزيد ←
                </button>
              </div>
            </article>
          ))}
        </div>

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