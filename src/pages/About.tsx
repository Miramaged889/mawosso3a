

const About = () => {
  return (
    <>
      <main className="min-h-screen bg-ivory">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-louguiya font-bold text-blue-gray mb-4">
                من نحن
              </h1>
              <p className="text-lg text-medium-gray mb-8 leading-relaxed">
                نحن فريق متخصص في التراث الإسلامي والعلوم الشرعية، نعمل على جمع
                وحفظ ونشر التراث العلمي لعلماء وكتاب بلاد شنقيط (موريتانيا).
              </p>

              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-heritage-gold rounded-full flex items-center justify-center">
                    <span className="text-white font-louguiya font-bold text-3xl">
                      ش
                    </span>
                  </div>
                </div>
                <h2 className="text-2xl font-louguiya font-bold text-blue-gray">
                  رؤيتنا
                </h2>
                <p className="text-medium-gray leading-relaxed mt-4">
                  نسعى إلى أن نكون المصدر الأول والأشمل للتراث العلمي الشنقيطي،
                  ونعمل على توفير منصة رقمية متطورة تتيح للباحثين والدارسين
                  الوصول إلى هذا التراث الثمين بسهولة ويسر.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-louguiya font-bold text-blue-gray mb-4">
                    مهمتنا
                  </h3>
                  <ul className="text-medium-gray space-y-2">
                    <li>• جمع وحفظ المخطوطات والكتب التراثية</li>
                    <li>• تحقيق ونشر النصوص العلمية</li>
                    <li>• توفير منصة رقمية للباحثين</li>
                    <li>• الحفاظ على التراث العلمي الشنقيطي</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-louguiya font-bold text-blue-gray mb-4">
                    قيمنا
                  </h3>
                  <ul className="text-medium-gray space-y-2">
                    <li>• الدقة العلمية في التحقيق والنشر</li>
                    <li>• الشمولية في جمع التراث</li>
                    <li>• سهولة الوصول للجميع</li>
                    <li>• الحفاظ على الأصالة</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
