import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../hooks/useApi';
import { ContentEntry } from '../services/api';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import Breadcrumb from '../components/Breadcrumb';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Use search hook
  const { data: results, loading, error } = useSearch(debouncedQuery);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    setDebouncedQuery(q);
  }, [searchParams]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  const getLinkPrefix = (item: ContentEntry) => {
    if (item.entry_type === 'investigation') return '/tahqiq';
    if (item.entry_type === 'book') return '/books-on-chinguitt';
    return '/manuscripts';
  };

  const breadcrumbItems = [
    { label: 'البحث' }
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-amiri font-bold text-blue-gray mb-4">
            البحث في الموسوعة
          </h1>
          <p className="text-lg text-medium-gray max-w-3xl mx-auto leading-relaxed">
            ابحث في مجموعتنا الشاملة من المخطوطات والتحقيقات والمؤلفات
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Search Results */}
        {query && (
          <>
            {!loading && (
              <div className="text-center mb-8">
                <p className="text-medium-gray">
                  نتائج البحث عن: <span className="font-bold text-heritage-gold">"{query}"</span>
                </p>
                <p className="text-medium-gray mt-2">
                  عدد النتائج: <span className="font-bold text-heritage-gold">{results?.length || 0}</span>
                </p>
              </div>
            )}


            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                  خطأ في البحث
                </h3>
                <p className="text-medium-gray">
                  حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.
                </p>
              </div>
            )}

            {!loading && !error && results && results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    linkPrefix={getLinkPrefix(item)}
                  />
                ))}
              </div>
            ) : !loading && !error && query && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                  لا توجد نتائج
                </h3>
                <p className="text-medium-gray">
                  لم نجد أي محتوى يطابق بحثك. جرب كلمات مفتاحية أخرى.
                </p>
              </div>
            )}
          </>
        )}

        {/* Search Tips */}
        {!query && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-amiri font-bold text-blue-gray mb-6 text-center">
                نصائح للبحث
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-heritage-gold mb-3">
                    يمكنك البحث عن:
                  </h3>
                  <ul className="space-y-2 text-medium-gray">
                    <li>• عنوان المخطوطة أو الكتاب</li>
                    <li>• اسم المؤلف أو المحقق</li>
                    <li>• موضوع أو تخصص معين</li>
                    <li>• كلمات من الوصف</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-heritage-gold mb-3">
                    أمثلة على البحث:
                  </h3>
                  <ul className="space-y-2 text-medium-gray">
                    <li>• "الفقه المالكي"</li>
                    <li>• "محمد المامي"</li>
                    <li>• "شنقيط"</li>
                    <li>• "النحو والصرف"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;