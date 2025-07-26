import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="bg-ivory py-4">
      <div className="container mx-auto px-4">
        <ol className="flex items-center space-x-2 space-x-reverse text-sm">
          <li>
            <Link to="/" className="text-heritage-gold hover:text-olive-green transition-colors">
              الرئيسية
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center space-x-2 space-x-reverse">
              <svg className="w-4 h-4 text-medium-gray" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {item.path ? (
                <Link to={item.path} className="text-heritage-gold hover:text-olive-green transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-medium-gray">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;