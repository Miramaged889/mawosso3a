// Category ID mapping based on API data structure
// This helps maintain consistency between API calls and page categories

export const CATEGORY_IDS = {
  SHARIA_SCIENCES: "1", // العلوم الشرعية
  LINGUISTIC_SCIENCES: "2", // العلوم اللغوية
  SOCIAL_SCIENCES: "3", // العلوم الاجتماعية
  SCIENTIFIC_NEWS: "4", // الأخبار العلمية
  FORMAL_EDUCATION: "5", // مكتبة التعليم النظامي
  BENEFITS: "6", // فوائد
  BOOKS_ON_CHINGUITT: "7", // مؤلفات عن شنقيط
  TAHQIQ: "8", // تحقيقات الشناقطة
  VARIETIES: "9", // المنوعات
  MANUSCRIPTS: "10", // المخطوطات
} as const;

export const CATEGORY_NAMES = {
  [CATEGORY_IDS.SHARIA_SCIENCES]: "العلوم الشرعية",
  [CATEGORY_IDS.LINGUISTIC_SCIENCES]: "العلوم اللغوية",
  [CATEGORY_IDS.SOCIAL_SCIENCES]: "العلوم الاجتماعية",
  [CATEGORY_IDS.SCIENTIFIC_NEWS]: "الأخبار العلمية",
  [CATEGORY_IDS.FORMAL_EDUCATION]: "مكتبة التعليم النظامي",
  [CATEGORY_IDS.BENEFITS]: "فوائد",
  [CATEGORY_IDS.BOOKS_ON_CHINGUITT]: "مؤلفات عن شنقيط",
  [CATEGORY_IDS.TAHQIQ]: "تحقيقات الشناقطة",
  [CATEGORY_IDS.VARIETIES]: "المنوعات",
  [CATEGORY_IDS.MANUSCRIPTS]: "المخطوطات",
} as const;

export type CategoryId = (typeof CATEGORY_IDS)[keyof typeof CATEGORY_IDS];
