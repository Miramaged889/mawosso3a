import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useApi";
import Breadcrumb from "../components/Breadcrumb";

const Admin: React.FC = () => {
  const { isAuthenticated, login, logout, loading, error } = useAuth();
  const [loginForm, setLoginForm] = React.useState({
    email: "",
    password: "",
  });
  const [showLogin, setShowLogin] = React.useState(!isAuthenticated);

  React.useEffect(() => {
    setShowLogin(!isAuthenticated);
  }, [isAuthenticated]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginForm.email, loginForm.password);
    if (success) {
      setShowLogin(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogin(true);
  };

  // Show login form if not authenticated
  if (showLogin) {
    return (
      <div className="min-h-screen bg-ivory">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-amiri font-bold text-2xl">
                    <img
                      src="log.png"
                      alt="logo"
                      className="w-24 h-24 rounded-full"
                    />
                  </span>
                </div>
                <h1 className="text-2xl font-amiri font-bold text-blue-gray mb-2">
                  تسجيل الدخول
                </h1>
                <p className="text-medium-gray">لوحة تحكم الموسوعة الشنقيطية</p>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-blue-gray mb-2"
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-blue-gray mb-2"
                  >
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-olive-green transition-colors text-right"
                    placeholder="أدخل كلمة المرور"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-olive-green text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </button>
              </form>

              {/* Temporary test button for development */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>خطأ:</strong> {error}
                  </p>
                </div>
              )}

              {/* Help text */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  💡 معلومات مهمة:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• تأكد من استخدام بيانات دخول صحيحة</li>
                  <li>• يجب أن يكون لديك حساب مدير صالح</li>
                  <li>• تحقق من اتصالك بالإنترنت</li>
                  <li>
                    • الخادم:{" "}
                    <span className="font-mono bg-blue-100 px-1 rounded">
                      chinguitipedia.alldev.org
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const adminSections = [
    {
      title: "إدارة المخطوطات",
      description: "إضافة وتعديل وحذف المخطوطات",
      icon: "📜",
      link: "/admin/manuscripts",
    },
    {
      title: "إدارة المؤلفات",
      description: "إضافة وتعديل وحذف المؤلفات",
      icon: "✍️",
      link: "/admin/authors",
    },
    {
      title: "إدارة التحقيقات",
      description: "إضافة وتعديل وحذف التحقيقات",
      icon: "🔍",
      link: "/admin/investigations",
    },
    {
      title: "عن شنقيط",
      description: "إضافة وتعديل وحذف مؤلفات عن شنقيط",
      icon: "🏛️",
      link: "/admin/about-chinguit",
    },
    {
      title: "إدارة المنشورات",
      description: "إضافة وتعديل ونشر المحتوى والمقالات والأخبار",
      icon: "📝",
      link: "/admin/posts",
    },
  ];

  const breadcrumbItems = [{ label: "لوحة التحكم" }];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-amiri font-bold text-blue-gray mb-4">
            لوحة التحكم
          </h1>
          <p className="text-lg text-medium-gray">
            إدارة محتوى الموسوعة الشنقيطية
          </p>
          <div className="mt-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {adminSections.map((section, index) => (
            <Link
              to={section.link}
              key={index}
              className="bg-white rounded-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {section.icon}
              </div>
              <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                {section.title}
              </h3>
              <p className="text-medium-gray mb-4 leading-relaxed">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
