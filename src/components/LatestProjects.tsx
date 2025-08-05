import React from "react";
import { Link } from "react-router-dom";
import { useLatestProjects } from "../hooks/useApi";
import { ContentEntry } from "../services/api";
import ItemCard from "./ItemCard";

const LatestProjects = () => {
  const { data: latestItems, loading, error } = useLatestProjects();

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-louguiya font-bold text-blue-gray mb-4">
              آخر المنشورات
            </h2>
            <p className="text-lg text-medium-gray max-w-2xl mx-auto">
              أحدث الإضافات من المخطوطات والتحقيقات والمؤلفات في الموسوعة
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-louguiya font-bold text-blue-gray mb-4">
              آخر المنشورات
            </h2>
            <p className="text-lg text-medium-gray max-w-2xl mx-auto">
              أحدث الإضافات من المخطوطات والتحقيقات والمؤلفات في الموسوعة
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-red-500">حدث خطأ في تحميل البيانات</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-louguiya font-bold text-blue-gray mb-4">
            آخر المنشورات
          </h2>
          <p className="text-lg text-medium-gray max-w-2xl mx-auto">
            أحدث الإضافات من المخطوطات والتحقيقات والمؤلفات في الموسوعة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {(latestItems || []).slice(0, 3).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/search"
            className="bg-olive-green text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
          >
            استكشف المزيد
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestProjects;
