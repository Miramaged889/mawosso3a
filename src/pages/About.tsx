import React from 'react';
import Breadcrumb from '../components/Breadcrumb';

const About: React.FC = () => {
  const breadcrumbItems = [
    { label: 'من نحن' }
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-amiri font-bold text-blue-gray mb-4">
              من نحن
            </h1>
            <p className="text-lg text-medium-gray">
              تعرف على رسالة وأهداف الموسوعة الشنقيطية
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-heritage-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-amiri font-bold text-3xl">ش</span>
              </div>
              <h2 className="text-2xl font-amiri font-bold text-blue-gray">
                الموسوعة الشنقيطية
              </h2>
            </div>

            {/* Vision and Mission */}
            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                رؤيتنا
              </h3>
              <p className="text-medium-gray leading-relaxed mb-6">
                أن نكون المرجع الأول والأشمل للتراث الإسلامي الشنقيطي، ونساهم في حفظ ونشر هذا التراث العريق للأجيال القادمة، مع تسهيل الوصول إليه للباحثين والدارسين في جميع أنحاء العالم.
              </p>

              <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                رسالتنا
              </h3>
              <p className="text-medium-gray leading-relaxed mb-6">
                نعمل على جمع وتحقيق ونشر المخطوطات والكتب والبحوث الإسلامية من التراث الشنقيطي، مع توفير منصة رقمية متطورة تسهل البحث والاطلاع على هذا التراث الثري. نسعى لخدمة الباحثين وطلاب العلم والمهتمين بالتراث الإسلامي من خلال توفير محتوى علمي محقق ومدروس بعناية فائقة.
              </p>

              <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                أهدافنا
              </h3>
              <ul className="text-medium-gray leading-relaxed mb-6 space-y-2">
                <li>• حفظ التراث الإسلامي الشنقيطي من الضياع والاندثار</li>
                <li>• تحقيق المخطوطات النادرة وإخراجها بصورة علمية دقيقة</li>
                <li>• توفير مكتبة رقمية شاملة للتراث الشنقيطي</li>
                <li>• تسهيل البحث العلمي في التراث الإسلامي</li>
                <li>• نشر الوعي بأهمية التراث الشنقيطي وإسهاماته الحضارية</li>
                <li>• ربط الباحثين والمهتمين بالتراث الإسلامي</li>
              </ul>

              <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                ما نقدمه
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-ivory p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-heritage-gold mb-3">المخطوطات</h4>
                  <p className="text-medium-gray">مجموعة نادرة من المخطوطات الإسلامية في مختلف العلوم الشرعية واللغوية والاجتماعية</p>
                </div>
                <div className="bg-ivory p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-heritage-gold mb-3">التحقيقات</h4>
                  <p className="text-medium-gray">تحقيقات علمية متميزة للتراث الشنقيطي على أيدي باحثين متخصصين</p>
                </div>
                <div className="bg-ivory p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-heritage-gold mb-3">المؤلفات</h4>
                  <p className="text-medium-gray">كتب ودراسات معاصرة تتناول تاريخ وثقافة وحضارة شنقيط</p>
                </div>
                <div className="bg-ivory p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-heritage-gold mb-3">البحث المتقدم</h4>
                  <p className="text-medium-gray">أدوات بحث متطورة تسهل الوصول للمحتوى المطلوب بسرعة ودقة</p>
                </div>
              </div>

              <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                فريق العمل
              </h3>
              <p className="text-medium-gray leading-relaxed mb-6">
                يضم فريق الموسوعة الشنقيطية نخبة من الباحثين والمحققين المتخصصين في التراث الإسلامي، بالإضافة إلى خبراء في التقنية والتصميم الرقمي. نعمل جميعاً بروح الفريق الواحد لتحقيق أهداف الموسوعة وخدمة التراث الإسلامي العريق.
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
              تواصل معنا
            </h3>
            <p className="text-medium-gray mb-6">
              نرحب بتواصلكم واستفساراتكم ومقترحاتكم لتطوير الموسوعة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-olive-green text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
              >
                صفحة التواصل
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse"
              >
                <span>واتساب</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;