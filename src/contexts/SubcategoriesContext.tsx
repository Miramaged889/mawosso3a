import React, { createContext, useContext, useState, useEffect } from 'react';

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  category?: number;
}

interface SubcategoriesContextType {
  subcategories: Subcategory[];
  isLoading: boolean;
}

const SubcategoriesContext = createContext<SubcategoriesContextType>({
  subcategories: [],
  isLoading: true,
});

const CACHE_KEY = 'subcategories_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const SubcategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        // Check localStorage cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          
          if (age < CACHE_DURATION) {
            setSubcategories(data);
            setIsLoading(false);
            return;
          }
        }

        // Fetch all subcategories
        let allSubcategories: Subcategory[] = [];
        let nextUrl = '/api/subcategories/?limit=100';

        while (nextUrl) {
          const response = await fetch(nextUrl);
          const data = await response.json();
          allSubcategories = [...allSubcategories, ...(data.results || [])];
          nextUrl = data.next ? data.next.replace(/^https?:\/\/[^\/]+/, '') : null;
        }

        // Cache the results
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: allSubcategories,
            timestamp: Date.now(),
          })
        );

        setSubcategories(allSubcategories);
      } catch (err) {
        console.error('Error fetching subcategories:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  return (
    <SubcategoriesContext.Provider value={{ subcategories, isLoading }}>
      {children}
    </SubcategoriesContext.Provider>
  );
};

export const useSubcategories = () => {
  const context = useContext(SubcategoriesContext);
  if (!context) {
    throw new Error('useSubcategories must be used within SubcategoriesProvider');
  }
  return context;
};

