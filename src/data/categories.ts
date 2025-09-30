export interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export const categories: Category[] = [
  {
    id: "sharia-sciences",
    name: "العلوم الشرعية",
    slug: "sharia-sciences",
    subcategories: [
      { id: "quran", name: "المصاحف", slug: "quran" },
      { id: "quran-sciences", name: "علوم القرآن", slug: "quran-sciences" },
      { id: "hadith-sciences", name: "علوم الحديث", slug: "hadith-sciences" },
      { id: "aqeedah", name: "العقيدة", slug: "aqeedah" },
      { id: "fiqh", name: "الفقه", slug: "fiqh" },
      { id: "raqaiq", name: "الرقائق", slug: "raqaiq" },
      { id: "seerah", name: "السيرة", slug: "seerah" },
      { id: "qawaid", name: "القواعد", slug: "qawaid" },
      { id: "usool", name: "الأصول", slug: "usool" },
    ],
  },
  {
    id: "linguistic-sciences",
    name: "العلوم اللغوية",
    slug: "linguistic-sciences",
    subcategories: [
      { id: "grammar", name: "النحو", slug: "grammar" },
      { id: "spelling", name: "الإملاء", slug: "spelling" },
      { id: "literature", name: "الأدب", slug: "literature" },
      { id: "language", name: "اللغة", slug: "language" },
      { id: "rhetoric", name: "البلاغة", slug: "rhetoric" },
      { id: "morphology", name: "الصرف", slug: "morphology" },
    ],
  },
  {
    id: "social-sciences",
    name: "العلوم الاجتماعية",
    slug: "social-sciences",
    subcategories: [
      { id: "politics", name: "السياسة", slug: "politics" },
      { id: "geography", name: "الجغرافيا", slug: "geography" },
      { id: "history", name: "التاريخ", slug: "history" },
      { id: "economics", name: "الاقتصاد", slug: "economics" },
    ],
  },
  {
    id: "general",
    name: "المنوعات",
    slug: "general",
    subcategories: [
      { id: "memoirs", name: "المذكرات", slug: "memoirs" },
      { id: "biographies", name: "التراجم", slug: "biographies" },
      { id: "speeches", name: "الخطب", slug: "speeches" },
      { id: "magazines", name: "المجلات", slug: "magazines" },
      { id: "whatsappiyat", name: "واتسابيات", slug: "whatsappiyat" },
      { id: "miscellaneous", name: "المتفرقات", slug: "miscellaneous" },
    ],
  },
  {
    id: "benefits",
    name: "فوائد",
    slug: "benefits",
  },
  {
    id: "formal-education",
    name: "مكتبة التعليم النظامي",
    slug: "formal-education",
    subcategories: [
      {
        id: "basic-education",
        name: "مكتبة التعليم الأساسي",
        slug: "basic-education",
      },
      {
        id: "secondary-education",
        name: "مكتبة التعليم الثانوي",
        slug: "secondary-education",
      },
      {
        id: "university-education",
        name: "مكتبة التعليم الجامعي",
        slug: "university-education",
      },
    ],
  },
  {
    id: "scientific-news",
    name: "الأخبار العلمية",
    slug: "scientific-news",
  },
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find((cat) => cat.slug === slug);
};

export const getSubcategoryBySlug = (
  categorySlug: string,
  subcategorySlug: string
): Subcategory | undefined => {
  const category = getCategoryBySlug(categorySlug);
  return category?.subcategories?.find((sub) => sub.slug === subcategorySlug);
};
