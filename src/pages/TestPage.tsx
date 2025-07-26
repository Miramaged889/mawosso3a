import React, { useState } from "react";
import { useEntries, useCategories, useAuth } from "../hooks/useApi";
import { apiClient } from "../services/api";
import { CATEGORY_IDS } from "../data/categoryMapping";

const TestPage: React.FC = () => {
  const [testResult, setTestResult] = useState<string>("");
  const [isTestingAPI, setIsTestingAPI] = useState(false);

  // Test different category fetches
  const allEntriesResult = useEntries();
  const manuscriptsResult = useEntries({ category: CATEGORY_IDS.MANUSCRIPTS });
  const socialSciencesResult = useEntries({
    category: CATEGORY_IDS.SOCIAL_SCIENCES,
  });
  const linguisticSciencesResult = useEntries({
    category: CATEGORY_IDS.LINGUISTIC_SCIENCES,
  });

  // Test categories and auth
  const { data: categories } = useCategories();
  const { isAuthenticated } = useAuth();

  const testAPIConnection = async () => {
    setIsTestingAPI(true);
    setTestResult("بدء اختبار الاتصال بـ API...\n");

    try {
      // Test 1: Basic API connection
      setTestResult((prev) => prev + "اختبار 1: اتصال أساسي بـ API...\n");
      const response = await fetch(
        "https://chinguitipedia.alldev.org/api/entries/"
      );
      if (response.ok) {
        const data = await response.json();
        setTestResult(
          (prev) =>
            prev +
            `✅ اتصال أساسي ناجح - وجدت ${
              data.length || data.value?.length || 0
            } عنصر\n`
        );
      } else {
        setTestResult(
          (prev) => prev + `❌ فشل الاتصال الأساسي - ${response.status}\n`
        );
      }

      // Test 2: Categories
      setTestResult((prev) => prev + "اختبار 2: جلب التصنيفات...\n");
      const categoriesResponse = await apiClient.getCategories();
      setTestResult(
        (prev) => prev + `✅ تم جلب ${categoriesResponse.length} تصنيف\n`
      );

      // Test 3: Test entry creation (without files)
      if (isAuthenticated) {
        setTestResult((prev) => prev + "اختبار 3: إنشاء منشور تجريبي...\n");

        const testEntry = {
          title: "منشور تجريبي - " + new Date().getTime(),
          author: "مختبر",
          category: 1, // العلوم الشرعية
          description: "وصف تجريبي",
          content: "محتوى تجريبي",
          language: "العربية",
          tags: "اختبار",
          page_count: 10,
          date: new Date().toISOString().split("T")[0],
          published: true,
        };

        try {
          const createdEntry = await apiClient.createEntry(testEntry);
          setTestResult(
            (prev) =>
              prev +
              `✅ تم إنشاء المنشور التجريبي بنجاح - ID: ${createdEntry.id}\n`
          );

          // Clean up - delete the test entry
          await apiClient.deleteEntry(createdEntry.id);
          setTestResult((prev) => prev + `✅ تم حذف المنشور التجريبي\n`);
        } catch (createError) {
          setTestResult(
            (prev) =>
              prev + `❌ فشل في إنشاء المنشور التجريبي: ${createError}\n`
          );
        }
      } else {
        setTestResult(
          (prev) =>
            prev + "⚠️ لم يتم تسجيل الدخول - تخطي اختبار إنشاء المنشور\n"
        );
      }

      setTestResult((prev) => prev + "\n🎉 انتهاء الاختبارات!\n");
    } catch (error) {
      setTestResult((prev) => prev + `❌ خطأ في الاختبار: ${error}\n`);
    } finally {
      setIsTestingAPI(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Debug Page</h1>

      {/* API Connection Test */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">اختبار الاتصال بـ API</h2>
        <button
          onClick={testAPIConnection}
          disabled={isTestingAPI}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isTestingAPI ? "جاري الاختبار..." : "اختبار API"}
        </button>

        {testResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">نتائج الاختبار:</h3>
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </div>

      {/* Authentication Status */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">حالة المصادقة</h2>
        <div className="text-sm">
          <p>مسجل الدخول: {isAuthenticated ? "✅ نعم" : "❌ لا"}</p>
          <p>
            Token:{" "}
            {localStorage.getItem("auth_token") ? "✅ موجود" : "❌ غير موجود"}
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">التصنيفات</h2>
        <div className="text-sm">
          <p>عدد التصنيفات: {categories?.length || 0}</p>
          {categories && categories.length > 0 && (
            <div className="mt-2">
              <h3 className="font-semibold">التصنيفات المتاحة:</h3>
              <ul className="list-disc list-inside">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    {cat.id}: {cat.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* All Entries */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">All Entries</h2>
          <div className="text-sm">
            <p>Loading: {allEntriesResult.loading ? "Yes" : "No"}</p>
            <p>Error: {allEntriesResult.error || "None"}</p>
            <p>Data Count: {allEntriesResult.data?.length || 0}</p>
            {allEntriesResult.data && allEntriesResult.data.length > 0 && (
              <div className="mt-2">
                <h3 className="font-semibold">Sample Data:</h3>
                <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(allEntriesResult.data[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Manuscripts */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">
            Manuscripts (Category {CATEGORY_IDS.MANUSCRIPTS})
          </h2>
          <div className="text-sm">
            <p>Loading: {manuscriptsResult.loading ? "Yes" : "No"}</p>
            <p>Error: {manuscriptsResult.error || "None"}</p>
            <p>Data Count: {manuscriptsResult.data?.length || 0}</p>
            {manuscriptsResult.data && manuscriptsResult.data.length > 0 && (
              <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(manuscriptsResult.data[0], null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* Social Sciences */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">
            Social Sciences (Category {CATEGORY_IDS.SOCIAL_SCIENCES})
          </h2>
          <div className="text-sm">
            <p>Loading: {socialSciencesResult.loading ? "Yes" : "No"}</p>
            <p>Error: {socialSciencesResult.error || "None"}</p>
            <p>Data Count: {socialSciencesResult.data?.length || 0}</p>
            {socialSciencesResult.data &&
              socialSciencesResult.data.length > 0 && (
                <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(socialSciencesResult.data[0], null, 2)}
                </pre>
              )}
          </div>
        </div>

        {/* Linguistic Sciences */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">
            Linguistic Sciences (Category {CATEGORY_IDS.LINGUISTIC_SCIENCES})
          </h2>
          <div className="text-sm">
            <p>Loading: {linguisticSciencesResult.loading ? "Yes" : "No"}</p>
            <p>Error: {linguisticSciencesResult.error || "None"}</p>
            <p>Data Count: {linguisticSciencesResult.data?.length || 0}</p>
            {linguisticSciencesResult.data &&
              linguisticSciencesResult.data.length > 0 && (
                <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(linguisticSciencesResult.data[0], null, 2)}
                </pre>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
