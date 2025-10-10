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
                موقع الموسوعة الشنقيطية موقع علمي، يعمل على جمع ونشر التراث
                العلمي لعلماء وكتاب بلاد شنقيط (موريتانيا).
              </p>

              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-32 h-32 bg-heritage-gold rounded-full flex items-center justify-center">
                    <img
                      src="img/log.png"
                      alt="الموسوعة الشنقيطية"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-louguiya font-bold text-blue-gray">
                  رؤيتنا
                </h2>
                <p className="text-medium-gray leading-relaxed mt-4">
                  أن نكون المرجع الرقمي الأول والأشمل للتراث العلمي الشنقيطي،
                  ونقطة انطلاق لكل باحث ومهتم بتاريخ وعلوم بلاد شنقيط، مع الحفاظ
                  على هذا الإرث الثمين للأجيال القادمة.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-louguiya font-bold text-blue-gray mb-4">
                    ماذا ننشر
                  </h3>
                  <ul className="text-medium-gray space-y-2">
                    <li>• الكتب والأبحاث التي ليست عليها حقوق ملكية فكرية</li>
                    <li>
                      • الكتب والأبحاث المنشورة، ونبين المصدر الذي جلبت منه
                    </li>
                    <li>• الدراسات المنشورة عن بلاد شنقيط</li>
                    <li>• أهم الملفات العلمية الصوتية للشناقطة</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-louguiya font-bold text-blue-gray mb-4">
                    قيمنا
                  </h3>
                  <ul className="text-medium-gray space-y-2">
                    <li>• حفظ حقوق الملكية الفكرية للمؤلفين</li>
                    <li>• الشمولية في جمع التراث العلمي للشناقطة</li>
                    <li>• تيسير الوصول للتراث الشنقيطي</li>
                    <li>• مواكبة العصر لخدمة التراث الشنقيطي</li>
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
