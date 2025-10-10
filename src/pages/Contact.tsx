import React, { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // محاكاة إرسال النموذج
    setTimeout(() => {
      setSubmitMessage("تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.");
      setIsSubmitting(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  const handleWhatsApp = () => {
    const message = `السلام عليكم، أريد الاستفسار عن الموسوعة الشنقيطية`;
    const url = `https://wa.me/22241803272?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const breadcrumbItems = [{ label: "اتصل بنا" }];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-amiri font-bold text-blue-gray mb-4">
              اتصل بنا
            </h1>
            <p className="text-lg text-medium-gray">
              نرحب بتواصلكم واستفساراتكم ومقترحاتكم
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-6">
                أرسل لنا رسالة
              </h2>

              {submitMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-blue-gray mb-2"
                  >
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-blue-gray mb-2"
                  >
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-blue-gray mb-2"
                  >
                    موضوع الرسالة *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right"
                  >
                    <option value="">اختر موضوع الرسالة</option>
                    <option value="استفسار عام">استفسار عام</option>
                    <option value="طلب مخطوطة">طلب مخطوطة معينة</option>
                    <option value="اقتراح تحقيق">اقتراح تحقيق</option>
                    <option value="تصحيح معلومة">تصحيح معلومة</option>
                    <option value="تعاون علمي">تعاون علمي</option>
                    <option value="مشكلة تقنية">مشكلة تقنية</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-blue-gray mb-2"
                  >
                    نص الرسالة *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right resize-vertical"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-olive-green text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* WhatsApp Contact */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-6">
                  تواصل سريع
                </h2>
                <div className="space-y-4">
                  <button
                    onClick={handleWhatsApp}
                    className="w-full bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center space-x-3 space-x-reverse"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    <span className="text-lg font-semibold">
                      تواصل عبر واتساب
                    </span>
                  </button>
                  <p className="text-medium-gray text-center text-sm">
                    للاستفسارات السريعة والدعم الفوري
                  </p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-6">
                  معلومات التواصل
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-10 h-10 bg-heritage-gold rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-gray">
                        البريد الإلكتروني
                      </p>
                      <p className="text-medium-gray">
                        chinguitipedia.@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-10 h-10 bg-heritage-gold rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-gray">واتساب</p>
                      <p className="text-medium-gray">+22241803272</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-10 h-10 bg-heritage-gold rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-gray">تيليجرام</p>
                      <a
                        href="https://t.me/chinguitipedianet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-heritage-gold hover:underline"
                      >
                        @chinguitipedianet
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-10 h-10 bg-heritage-gold rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-gray">فيسبوك</p>
                      <a
                        href="https://www.facebook.com/chinguitpedia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-heritage-gold hover:underline"
                      >
                        Chinguitipedia
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-6">
                  أسئلة شائعة
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-heritage-gold mb-2">
                      كيف يمكنني تحميل ملف من الموقع؟
                    </h3>
                    <p className="text-medium-gray text-sm">
                      اضغط على العنوان، ثم على (تحميل الملف)، وسيتاح لك تحميله
                      إلى جهازك الخاص.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-heritage-gold mb-2">
                      هل يمكنني نشر بحثي أو تأليفي على الموقع؟
                    </h3>
                    <p className="text-medium-gray text-sm">
                      نعم، إذا كان داخلا في اختصاص الموقع، تواصل معنا وسنقوم
                      بنشره إن شاء الله.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
