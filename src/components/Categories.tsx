import React from "react";
import { Link } from "react-router-dom";
import { categories as localCategories } from "../data/categories";

const Categories = () => {
  // Static categories with icons and descriptions
  const staticCategoryData = {
    "العلوم الشرعية": {
      description: "مخطوطات وكتب في الفقه والحديث والتفسير والعقيدة",
      icon: "📖",
      count: "245 مخطوطة",
      link: "/sharia-sciences",
    },
    "العلوم اللغوية": {
      description: "النحو والصرف والبلاغة واللغة العربية وآدابها",
      icon: "✍️",
      count: "156 مخطوطة",
      link: "/linguistic-sciences",
    },
    "العلوم الاجتماعية": {
      description: "التاريخ والجغرافيا والسير والتراجم",
      icon: "🏛️",
      count: "89 مخطوطة",
      link: "/social-sciences",
    },
    المنوعات: {
      description: "الطب والفلك والرياضيات وغيرها من العلوم",
      icon: "🔬",
      count: "67 مخطوطة",
      link: "/varieties",
    },
    فوائد: {
      description: "مجموعة من الفوائد والنكت العلمية المتنوعة",
      icon: "💎",
      count: "150 فائدة",
      link: "/benefits",
    },
    "مكتبة التعليم النظامي": {
      description: "مواد تعليمية للمراحل الأساسية والثانوية والجامعية",
      icon: "🎓",
      count: "300 مادة",
      link: "/formal-education-library",
    },
  };

  // Create categories from local data
  const categories = React.useMemo(() => {
    return localCategories
      .filter(
        (cat) => staticCategoryData[cat.name as keyof typeof staticCategoryData]
      )
      .map((cat) => {
        const staticData =
          staticCategoryData[cat.name as keyof typeof staticCategoryData];
        return {
          title: cat.name,
          description: staticData.description,
          icon: staticData.icon,
          count: staticData.count,
          link: staticData.link,
        };
      });
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-amiri font-bold text-blue-gray mb-4">
            تصنيفات الموسوعة
          </h2>
          <p className="text-lg text-medium-gray max-w-2xl mx-auto">
            استكشف مجموعتنا الشاملة من المخطوطات والكتب الإسلامية التراثية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              to={category.link}
              key={index}
              className="bg-ivory rounded-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group hover:bg-hover-beige"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="text-xl font-amiri font-bold text-blue-gray mb-3">
                {category.title}
              </h3>
              <p className="text-medium-gray mb-4 leading-relaxed">
                {category.description}
              </p>
              <div className="text-olive-green font-semibold">
                {category.count}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
