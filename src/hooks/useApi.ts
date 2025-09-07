import { useState, useEffect } from "react";
import {
  apiClient,
  ContentEntry,
  Category,
  Subcategory,
  Kind,
} from "../services/api";
import { categories as localCategories } from "../data/categories";
import {
  manuscripts,
  tahqiqat,
  booksOnChinguitt,
  allItems,
  getLatestItems,
  getItemById,
  searchItems,
} from "../data/manuscripts";

// Helper function to convert local data to API format
const convertManuscriptToContentEntry = (manuscript: any): ContentEntry => ({
  id: parseInt(manuscript.id.replace(/[^\d]/g, "") || "1"),
  title: manuscript.title,
  author: manuscript.author,
  description: manuscript.description,
  full_description: manuscript.fullDescription,
  category: {
    id: 1,
    name: manuscript.category,
    slug: manuscript.category.toLowerCase().replace(/\s+/g, "-"),
  },
  subcategory: manuscript.subcategory
    ? {
        id: 1,
        name: manuscript.subcategory,
        slug: manuscript.subcategory.toLowerCase().replace(/\s+/g, "-"),
        category: 1,
      }
    : undefined,
  date: manuscript.date,
  pages: manuscript.pages,
  language: manuscript.language,
  cover_image_link: manuscript.coverImage,
  pdf_file_link: manuscript.pdfUrl,
  created_at: manuscript.createdAt || new Date().toISOString(),
  updated_at: manuscript.createdAt || new Date().toISOString(),
  entry_type:
    manuscript.category === "تحقيقات"
      ? ("investigation" as const)
      : manuscript.category === "مؤلفات عن شنقيط"
      ? ("book" as const)
      : ("manuscript" as const),
});

// Fallback categories based on API response
const fallbackCategories: Category[] = [
  { id: 1, name: "Uncategorized", slug: "uncategorized" },
  { id: 32, name: "مقالات", slug: "مقaلaت" },
  { id: 33, name: "فوائد", slug: "فوaئd" },
  { id: 34, name: "الكل", slug: "aلكل" },
  { id: 67, name: "خطب و دروس", slug: "خطب-و-دروس" },
  { id: 99, name: "الأخبار العلمية", slug: "aلaخبaر-aلعلمية" },
  { id: 100, name: "العلوم الشرعية", slug: "aلعلوم-aلشرعية" },
  { id: 109, name: "العلوم اللغوية", slug: "aلعلوم-aللغوية" },
  { id: 118, name: "علوم أخرى", slug: "علوم-aخرى" },
  { id: 122, name: "مكتبة التعليم النظامي", slug: "مكتبة-aلتعليم-aلنظaمي" },
  { id: 127, name: "المنوعات", slug: "aلمنوعaت" },
];

// Custom hook for API data fetching with loading and error states
export const useApiData = <T>(
  fetchFunction: () => Promise<T>,
  fallbackFunction?: () => T,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add timeout to API calls
      const timeoutPromise = new Promise(
        (_, reject) =>
          setTimeout(() => reject(new Error("API request timeout")), 15000) // Increased timeout for CORS issues
      );

      const result = (await Promise.race([
        fetchFunction(),
        timeoutPromise,
      ])) as T;

      setData(result);
    } catch (err) {
      console.warn("API call failed, attempting fallback:", err);
      
      if (fallbackFunction) {
        try {
          const fallbackData = fallbackFunction();
          setData(fallbackData);
          setError(null); // Clear error when using fallback
          console.log("Successfully used fallback data");
        } catch (fallbackErr) {
          console.error("Fallback also failed:", fallbackErr);
          setError("Failed to load data from both API and fallback");
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        console.error("No fallback available, error:", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// Hook for categories
export const useCategories = () => {
  return useApiData(
    () => apiClient.getCategories(),
    () => fallbackCategories
  );
};

// Hook for subcategories
export const useSubcategories = () => {
  return useApiData(
    () => apiClient.getSubcategories(),
    () => {
      const subcategories: Subcategory[] = [];
      localCategories.forEach((category) => {
        if (category.subcategories) {
          category.subcategories.forEach((sub) => {
            subcategories.push({
              id: parseInt(
                sub.id.replace(/[^\d]/g, "") || Math.random().toString()
              ),
              name: sub.name,
              slug: sub.slug,
              category: parseInt(
                category.id.replace(/[^\d]/g, "") || Math.random().toString()
              ),
            });
          });
        }
      });
      return subcategories;
    }
  );
};

// Hook for kinds
export const useKinds = () => {
  return useApiData(
    () => apiClient.getKinds(),
    () => {
      // Fallback kinds data
      const fallbackKinds: Kind[] = [
        { id: 1, name: "كتاب", slug: "book" },
        { id: 14, name: "منشور", slug: "mnshor" },
        { id: 15, name: "المولفات", slug: "lmolft" },
        { id: 16, name: "المخطوطات", slug: "lmkhtott" },
        { id: 17, name: "التحقيقات", slug: "lthkykt" },
        { id: 18, name: "عن الشنقيط", slug: "aan-lshnkyt" },
      ];
      return fallbackKinds;
    }
  );
};

// Hook for paginated entries (used by AllEntries page)
export const useEntriesPaginated = (page: number = 1, limit: number = 20) => {
  return useApiData(
    async () => {
      // Get paginated entries
      const data = await apiClient.getEntriesPaginated(page, limit);
      return data;
    },
    () => {
      // Fallback to local data when API fails
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = allItems.slice(startIndex, endIndex);

      return {
        results: paginatedItems.map(convertManuscriptToContentEntry),
        count: allItems.length,
        next: endIndex < allItems.length ? `page=${page + 1}` : null,
        previous: page > 1 ? `page=${page - 1}` : null,
      };
    },
    [page, limit]
  );
};

// Hook for content entries with filtering
export const useEntries = (params?: {
  category?: string;
  subcategory?: string;
  entry_type?: string;
}) => {
  return useApiData(
    async () => {
      // First try to get all entries, then filter client-side
      const allData = await apiClient.getEntries(); // Get all without filters

      if (!allData || !Array.isArray(allData)) {
        return [];
      }

      let filteredData = allData;

      // Apply client-side filtering
      if (params?.category) {
        const categoryId = parseInt(params.category);
        filteredData = filteredData.filter(
          (item: any) =>
            item.category === categoryId || item.category === params.category
        );
      }

      if (params?.subcategory) {
        filteredData = filteredData.filter(
          (item: any) =>
            item.subcategory === params.subcategory ||
            (typeof item.subcategory === "object" &&
              item.subcategory?.name === params.subcategory)
        );
      }

      // For entry_type, map to categories or use tags
      if (params?.entry_type) {
        if (params.entry_type === "manuscript") {
          // Manuscripts might be in category 10 or have "المخطوطات" in tags
          filteredData = filteredData.filter(
            (item: any) =>
              item.category === 10 ||
              (item.tags && item.tags.includes("المخطوطات"))
          );
        } else if (params.entry_type === "book") {
          // Books might have "كتاب" in tags
          filteredData = filteredData.filter(
            (item: any) => item.tags && item.tags.includes("كتاب")
          );
        } else if (params.entry_type === "investigation") {
          // Investigations might be in a specific category
          filteredData = filteredData.filter(
            (item: any) => item.category === 8 // Assuming investigations are in category 8
          );
        }
      }

      return filteredData;
    },
    () => {
      // Fallback to local data when API fails
      let filteredItems = [...allItems];

      if (params?.entry_type) {
        if (params.entry_type === "investigation") {
          filteredItems = tahqiqat;
        } else if (params.entry_type === "book") {
          filteredItems = booksOnChinguitt;
        } else if (params.entry_type === "manuscript") {
          filteredItems = manuscripts;
        }
      }

      // For category filtering, match both numeric IDs and text names
      if (params?.category) {
        const categoryParam = params.category;
        filteredItems = filteredItems.filter((item) => {
          // Check if category matches by ID or name
          const categoryMatches =
            item.category === categoryParam || // Direct match
            item.category.toString() === categoryParam || // String comparison
            item.category.toLowerCase().includes(categoryParam.toLowerCase()); // Text match

          return categoryMatches;
        });
      }

      if (params?.subcategory) {
        filteredItems = filteredItems.filter((item) =>
          item.subcategory
            ?.toLowerCase()
            .includes(params.subcategory!.toLowerCase())
        );
      }

      return filteredItems.map(convertManuscriptToContentEntry);
    },
    [params?.category, params?.subcategory, params?.entry_type]
  );
};

// Hook for single entry
export const useEntry = (id: number | null) => {
  return useApiData(
    () => (id ? apiClient.getEntry(id) : Promise.resolve(null)),
    () => {
      if (!id) return null;
      const item = getItemById(id.toString());
      return item ? convertManuscriptToContentEntry(item) : null;
    },
    [id]
  );
};

// Hook for latest projects
export const useLatestProjects = () => {
  return useApiData(
    () => apiClient.getEntries({ limit: 3 }),
    () => {
      const latestItems = getLatestItems(3);
      return latestItems.map(convertManuscriptToContentEntry);
    }
  );
};

// Hook for search
export const useSearch = (query: string) => {
  return useApiData(
    () => (query ? apiClient.searchEntries(query) : Promise.resolve([])),
    () => {
      if (!query) return [];
      const results = searchItems(query);
      return results.map(convertManuscriptToContentEntry);
    },
    [query]
  );
};

// Hook for all entries without pagination
export const useAllEntries = () => {
  return useApiData(
    () => apiClient.getEntries(),
    () => allItems.map(convertManuscriptToContentEntry)
  );
};

// Hook for AdminBooks with pagination (like AllEntries)
export const useAllEntriesPaginated = (
  page: number = 1,
  limit: number = 2000
) => {
  return useApiData(
    async () => {
      const data = await apiClient.getAllEntriesPaginated(page, limit);
      return data;
    },
    () => {
      // Fallback to local data when API fails
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = allItems.slice(startIndex, endIndex);

      return {
        results: paginatedItems.map(convertManuscriptToContentEntry),
        count: allItems.length,
        next: endIndex < allItems.length ? `page=${page + 1}` : null,
        previous: page > 1 ? `page=${page - 1}` : null,
      };
    },
    [page, limit]
  );
};
// Authentication hook
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    // Clean up any test tokens
    if (token === "test_token") {
      localStorage.removeItem("auth_token");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(!!token);
    }

    setInitialized(true);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Add timeout for login as well
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(new Error("انتهت مهلة الاتصال. تحقق من الاتصال بالإنترنت.")),
          10000
        )
      );

      await Promise.race([apiClient.login(email, password), timeoutPromise]);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "فشل تسجيل الدخول";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      apiClient.logout();
    } catch (err) {
      // Logout API call failed, clearing local storage anyway
    }
    setIsAuthenticated(false);
  };

  // إضافة دالة للتحقق من صلاحية الرمز المميز
  const validateToken = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setIsAuthenticated(false);
        return false;
      }

      // محاولة استدعاء API بسيط للتحقق من صلاحية الرمز المميز
      await apiClient.getCategories();
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      setIsAuthenticated(false);
      return false;
    }
  };

  return {
    isAuthenticated,
    login,
    logout,
    loading,
    error,
    initialized,
    validateToken,
  };
};
