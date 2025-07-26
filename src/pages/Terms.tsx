import React from 'react';
import Breadcrumb from '../components/Breadcrumb';

const Terms: React.FC = () => {
  const breadcrumbItems = [
    { label: 'الشروط والأحكام' }
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-amiri font-bold text-blue-gray mb-4">
              الشروط والأحكام
            </h1>
            <p className="text-lg text-medium-gray">
              شروط استخدام موقع الموسوعة الشنقيطية
            </p>
          </div>

          {/* Terms Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                1. قبول الشروط
              </h2>
              <p className="text-medium-gray leading-relaxed mb-6">
                باستخدامك لموقع الموسوعة الشنقيطية، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع.
              </p>

              <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                2. استخدام المحتوى
              </h2>
              <p className="text-medium-gray leading-relaxed mb-4">
                المحتوى المتاح في الموسوعة الشنقيطية مخصص للاستخدام العلمي والبحثي والتعليمي. يحق لك:
              </p>
              <ul className="text-medium-gray leading-relaxed mb-6 space-y-2">
                <li>• قراءة وتصفح المحتوى للأغراض الشخصية والعلمية</li>
                <li>• الاقتباس من المحتوى مع ذكر المصدر</li>
                <li>• تحميل المواد المتاحة للتحميل للاستخدام الشخصي</li>
                <li>• مشاركة روابط المحتوى مع الآخرين</li>
              </ul>

              <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                3. القيود على الاستخدام
              </h2>
              <p className="text-medium-gray leading-relaxed mb-4">
                يُمنع عليك القيام بما يلي:
              </p>
              <ul className="text-medium-gray leading-relaxed mb-6 space-y-2">
                <li>• نسخ أو إعادة نشر المحتوى دون إذن مسبق</li>
                <li>• استخدام المحتوى لأغراض تجارية دون موافقة</li>
                <li>• تعديل أو تحريف المحتوى الأصلي</li>
                <li>• استخدام أدوات آلية لاستخراج المحتوى بكميات كبيرة</li>
                <li>• انتهاك حقوق الطبع والنشر للمؤلفين والمحققين</li>
              </ul>

              <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                4. حقوق الملكية الفكرية
              </h2>
              <p className="text-medium-gray leading-relaxed mb-6">
                جميع المواد المنشورة في الموسوعة محمية بحقوق الطبع والنشر. المخطوطات والتحقيقات والمؤلفات المعاصرة تخضع لحقوق مؤلفيها ومحققيها. تصميم الموقع ونظام التصنيف والبرمجة من حقوق الموسوعة الشنقيطية.
              </p>

              <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                5. دقة المعلومات
              </h2>
              <p className="text-medium-gray leading-relaxed mb-6">
                نبذل قصارى جهدنا لضمان دقة المعلومات المنشورة، لكننا لا نضمن خلو المحتوى من الأخطاء. ننصح الباحثين بالتحقق من المصادر الأصلية والرجوع إلى المتخصصين عند الحاجة.
              </p>

              <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                6. الخصوصية
              </h2>
              <p className="text-medium-gray leading-relaxed mb-6">
                نحترم خصوصية المستخدمين ولا نجمع معلومات شخصية إلا بموافقتهم. المعلومات المجمعة تُستخدم فقط لتحسين الخدمة والتواصل مع المستخدمين عند الضرورة.
              </p>

              <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                7. التحديثات والتعديلات
              </h2>
              <p className="text-medium-gray leading-relaxed mb-6">
                نحتفظ بالحق في تحديث هذه الشروط والأحكام في أي وقت. التحديثات ستُنشر على هذه الصفحة، وننصح بمراجعتها دورياً. استمرارك في استخدام الموقع يعني موافقتك على الشروط المحدثة.
              </p>

              <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                8. إخلاء المسؤولية
              </h2>
              <p className="text-medium-gray leading-relaxed mb-6">
                الموسوعة الشنقيطية غير مسؤولة عن أي أضرار مباشرة أو غير مباشرة قد تنتج عن استخدام الموقع أو المحتوى. المستخدم يتحمل مسؤولية استخدام المعلومات المتاحة.
              </p>

              <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                9. التواصل
              </h2>
              <p className="text-medium-gray leading-relaxed mb-6">
                لأي استفسارات حول هذه الشروط والأحكام، يمكنكم التواصل معنا عبر صفحة "اتصل بنا" أو عبر الواتساب المتاح في الموقع.
              </p>

              <div className="bg-ivory p-6 rounded-lg mt-8">
                <p className="text-medium-gray text-center">
                  <strong>تاريخ آخر تحديث:</strong> يناير 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;