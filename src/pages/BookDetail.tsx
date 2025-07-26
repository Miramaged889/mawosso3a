import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItemById, booksOnChinguitt } from '../data/manuscripts';
import Breadcrumb from '../components/Breadcrumb';
import ItemCard from '../components/ItemCard';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const book = id ? getItemById(id) : null;

  if (!book) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-3xl font-amiri font-bold text-blue-gray mb-4">
            الكتاب غير موجود
          </h2>
          <p className="text-medium-gray mb-8">
            عذراً، لم نتمكن من العثور على الكتاب المطلوب.
          </p>
          <Link
            to="/books-on-chinguitt"
            className="bg-olive-green text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
          >
            العودة إلى المؤلفات
          </Link>
        </div>
      </div>
    );
  }

  const relatedItems = book.relatedItems
    ? booksOnChinguitt.filter(item => book.relatedItems?.includes(item.id))
    : [];

  const breadcrumbItems = [
    { label: 'مؤلفات عن شنقيط', path: '/books-on-chinguitt' },
    { label: book.title }
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            {book.coverImage && (
              <div className="h-64 md:h-80 overflow-hidden">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-8">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between mb-6">
                <span className="bg-heritage-gold text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {book.category}
                </span>
                <span className="text-medium-gray">
                  {book.date}
                </span>
              </div>

              {/* Title and Author */}
              <h1 className="text-3xl md:text-4xl font-amiri font-bold text-blue-gray mb-4 leading-tight">
                {book.title}
              </h1>
              <h2 className="text-xl text-heritage-gold font-semibold mb-6">
                {book.author}
              </h2>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-ivory rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-olive-green">{book.pages}</div>
                  <div className="text-medium-gray">صفحة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-olive-green">{book.language}</div>
                  <div className="text-medium-gray">اللغة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-olive-green">دراسة أكاديمية</div>
                  <div className="text-medium-gray">النوع</div>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-4">
                  وصف الكتاب
                </h3>
                <p className="text-medium-gray leading-relaxed mb-6">
                  {book.fullDescription}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                {book.pdfUrl && (
                  <a
                    href={book.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-olive-green text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center space-x-2 space-x-reverse"
                  >
                    <span>تحميل PDF</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </a>
                )}
                <button className="bg-heritage-gold text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center space-x-2 space-x-reverse">
                  <span>مشاركة</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Related Items */}
          {relatedItems.length > 0 && (
            <div>
              <h3 className="text-2xl font-amiri font-bold text-blue-gray mb-8 text-center">
                كتب ذات صلة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    linkPrefix="/books-on-chinguitt"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;