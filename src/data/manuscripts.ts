export interface Manuscript {
  id: string;
  title: string;
  author: string;
  description: string;
  fullDescription: string;
  category: string;
  subcategory?: string;
  date: string;
  pages: number;
  language: string;
  coverImage?: string;
  pdfUrl?: string;
  relatedItems?: string[];
  createdAt?: string;
}

export const manuscripts: Manuscript[] = [
  {
    id: "1",
    title: "شرح مختصر خليل في الفقه المالكي",
    author: "الشيخ محمد المامي البركي",
    description: "شرح مفصل لمختصر خليل في الفقه المالكي، يتناول أبواب العبادات والمعاملات",
    fullDescription: "هذا الشرح المبارك لمختصر خليل في الفقه المالكي من تأليف العلامة الشيخ محمد المامي البركي، يعد من أهم الشروح التي تناولت هذا المتن المبارك. يتميز الشرح بوضوح العبارة وسهولة الفهم، مع التركيز على الأدلة الشرعية والقواعد الفقهية. يغطي الشرح جميع أبواب الفقه من العبادات إلى المعاملات والأحوال الشخصية.",
    category: "العلوم الشرعية",
    subcategory: "الفقه",
    date: "القرن الثالث عشر الهجري",
    pages: 450,
    language: "العربية",
    coverImage: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400",
    relatedItems: ["2", "3"],
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    title: "الدرر اللوامع في شرح جمع الجوامع",
    author: "الشيخ أحمد بن الأمين الشنقيطي",
    description: "شرح نفيس لجمع الجوامع في أصول الفقه، يبين قواعد الاستنباط والاجتهاد",
    fullDescription: "يعتبر هذا الشرح من أهم المؤلفات في علم أصول الفقه، حيث يتناول المؤلف شرح متن جمع الجوامع للسبكي بأسلوب واضح ومنهجي. يركز الشرح على بيان قواعد الاستنباط من النصوص الشرعية، وأحكام الأدلة، ومسائل الاجتهاد والتقليد. كما يتضمن مناقشات فقهية عميقة وأمثلة تطبيقية من الفقه المالكي.",
    category: "العلوم الشرعية",
    subcategory: "الأصول",
    date: "القرن الرابع عشر الهجري",
    pages: 380,
    language: "العربية",
    coverImage: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400",
    relatedItems: ["1", "4"],
    createdAt: "2024-01-12"
  },
  {
    id: "3",
    title: "نظم في النحو والصرف",
    author: "الشيخ محمد بن المختار الشنقيطي",
    description: "منظومة شعرية في قواعد النحو والصرف، سهلة الحفظ والفهم",
    fullDescription: "هذه المنظومة الشعرية الرائعة في علمي النحو والصرف من نظم العلامة الشيخ محمد بن المختار الشنقيطي. تتميز بسهولة الحفظ وجمال النظم، وتغطي أهم قواعد النحو والصرف بأسلوب شعري بديع. تعتبر من أفضل المتون التعليمية في هذين العلمين، وقد اعتمدها كثير من طلاب العلم في تعلم أساسيات اللغة العربية.",
    category: "العلوم اللغوية",
    subcategory: "النحو",
    date: "القرن الثالث عشر الهجري",
    pages: 120,
    language: "العربية",
    coverImage: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400",
    relatedItems: ["5", "6"],
    createdAt: "2024-01-10"
  },
  {
    id: "4",
    title: "تاريخ شنقيط وعلمائها",
    author: "الشيخ أحمد بن الأمين الشنقيطي",
    description: "تاريخ مفصل لمدينة شنقيط وأعلامها وعلمائها عبر العصور",
    fullDescription: "كتاب تاريخي مهم يؤرخ لمدينة شنقيط العريقة ودورها الحضاري والعلمي في المنطقة. يتناول الكتاب نشأة المدينة وتطورها، ويترجم لأهم علمائها وأدبائها عبر القرون. كما يصف الحياة الاجتماعية والثقافية في المدينة، ويبرز دور شنقيط كمركز علمي مهم في غرب أفريقيا. الكتاب مصدر مهم لدراسة التاريخ الإسلامي في المنطقة.",
    category: "العلوم الاجتماعية",
    subcategory: "التاريخ",
    date: "القرن الرابع عشر الهجري",
    pages: 520,
    language: "العربية",
    coverImage: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400",
    relatedItems: ["7", "8"],
    createdAt: "2024-01-08"
  },
  {
    id: "5",
    title: "ديوان الشعر الشنقيطي",
    author: "مجموعة من الشعراء الشناقطة",
    description: "مجموعة مختارة من أشعار الشعراء الشناقطة في مختلف الأغراض",
    fullDescription: "ديوان شعري يضم مختارات من أجمل ما نظمه الشعراء الشناقطة عبر العصور. يتنوع الديوان بين الشعر الديني والمدح النبوي والحكمة والوصف والغزل العفيف. يعكس الديوان ثراء الأدب الشنقيطي وعمق الثقافة الإسلامية في المنطقة. كل قصيدة مشروحة ومعرف بشاعرها وظروف نظمها، مما يجعله مرجعاً مهماً لدراسة الأدب الشنقيطي.",
    category: "العلوم اللغوية",
    subcategory: "الأدب",
    date: "مختلف العصور",
    pages: 300,
    language: "العربية",
    coverImage: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400",
    relatedItems: ["3", "9"],
    createdAt: "2024-01-05"
  },
  {
    id: "6",
    title: "رسالة في آداب طالب العلم",
    author: "الشيخ محمد الأمين الشنقيطي",
    description: "رسالة قيمة في آداب طالب العلم وأخلاقه وسلوكه",
    fullDescription: "رسالة تربوية قيمة تتناول آداب طالب العلم الشرعي وأخلاقه التي ينبغي أن يتحلى بها. تشمل الرسالة آداب التعلم والتعليم، وأخلاق التعامل مع الشيوخ والزملاء، وطرق المذاكرة والحفظ، وأهمية الإخلاص في طلب العلم. كما تتضمن نصائح عملية لتنظيم الوقت والاستفادة القصوى من الدروس والكتب. الرسالة مفيدة لكل طالب علم في أي مرحلة من مراحل تعلمه.",
    category: "المنوعات",
    subcategory: "المتفرقات",
    date: "القرن الرابع عشر الهجري",
    pages: 80,
    language: "العربية",
    coverImage: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400",
    relatedItems: ["1", "2"],
    createdAt: "2024-01-03"
  }
];

export const tahqiqat: Manuscript[] = [
  {
    id: "t1",
    title: "تحقيق كتاب الأجوبة الفاخرة",
    author: "المحقق: د. محمد الأمين ولد الشيخ",
    description: "تحقيق علمي لكتاب الأجوبة الفاخرة للشيخ محمد المامي",
    fullDescription: "تحقيق علمي دقيق لكتاب الأجوبة الفاخرة عن الأسئلة الفاجرة للعلامة الشيخ محمد المامي البركي. يتضمن التحقيق دراسة مفصلة عن المؤلف وعصره، وتخريج الأحاديث والآثار، وشرح المصطلحات الفقهية. الكتاب الأصلي يحتوي على فتاوى مهمة في مسائل فقهية معاصرة لعصر المؤلف، مما يجعله مرجعاً مهماً لفهم الفقه المالكي التطبيقي.",
    category: "تحقيقات",
    subcategory: "الفقه",
    date: "2020م",
    pages: 400,
    language: "العربية",
    coverImage: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400",
    relatedItems: ["t2", "1"],
    createdAt: "2024-01-20"
  },
  {
    id: "t2",
    title: "تحقيق ديوان الشيخ سيد عبد الله",
    author: "المحقق: د. أحمد ولد محمد المختار",
    description: "تحقيق وشرح ديوان الشيخ سيد عبد الله الشنقيطي",
    fullDescription: "تحقيق شامل لديوان الشاعر الفقيه الشيخ سيد عبد الله الشنقيطي، أحد أعلام الشعر الديني في شنقيط. يتضمن التحقيق جمع القصائد من مصادرها المختلفة، وشرح الألفاظ الغريبة، وبيان المناسبات التي قيلت فيها القصائد. الديوان يحتوي على قصائد في المدح النبوي والحكمة والوعظ والإرشاد، ويعكس عمق الثقافة الإسلامية والأدبية في المجتمع الشنقيطي.",
    category: "تحقيقات",
    subcategory: "الأدب",
    date: "2019م",
    pages: 350,
    language: "العربية",
    coverImage: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400",
    relatedItems: ["t3", "5"],
    createdAt: "2024-01-18"
  },
  {
    id: "t3",
    title: "تحقيق رسائل في الفقه المالكي",
    author: "المحقق: د. محمد الأمين ولد أحمد",
    description: "تحقيق مجموعة من الرسائل الفقهية للعلماء الشناقطة",
    fullDescription: "تحقيق علمي لمجموعة من الرسائل الفقهية المهمة للعلماء الشناقطة في مختلف أبواب الفقه المالكي. تشمل المجموعة رسائل في الطهارة والصلاة والزكاة والحج والمعاملات. كل رسالة محققة تحقيقاً علمياً دقيقاً مع دراسة عن مؤلفها ومنهجه الفقهي. التحقيق يتضمن أيضاً مقارنات مع آراء علماء المذهب المالكي الآخرين، مما يجعله مرجعاً مهماً للباحثين في الفقه المالكي.",
    category: "تحقيقات",
    subcategory: "الفقه",
    date: "2021م",
    pages: 480,
    language: "العربية",
    coverImage: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400",
    relatedItems: ["t1", "1"],
    createdAt: "2024-01-22"
  }
];

export const booksOnChinguitt: Manuscript[] = [
  {
    id: "b1",
    title: "شنقيط المنارة والرباط",
    author: "د. محمد المختار ولد اباه",
    description: "دراسة شاملة عن دور شنقيط الحضاري والعلمي في التاريخ الإسلامي",
    fullDescription: "كتاب أكاديمي شامل يتناول تاريخ مدينة شنقيط ودورها كمنارة علمية وحضارية في غرب أفريقيا. يغطي الكتاب نشأة المدينة وتطورها عبر القرون، ويسلط الضوء على دورها في نشر الإسلام والعلوم الشرعية في المنطقة. كما يتناول الحياة الاجتماعية والاقتصادية والثقافية في المدينة، ويبرز إسهامات علمائها في مختلف العلوم. الكتاب مدعم بالخرائط والصور التاريخية والوثائق النادرة.",
    category: "مؤلفات عن شنقيط",
    subcategory: "التاريخ",
    date: "2018م",
    pages: 600,
    language: "العربية",
    coverImage: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400",
    relatedItems: ["b2", "4"],
    createdAt: "2024-01-25"
  },
  {
    id: "b2",
    title: "المكتبات الخاصة في شنقيط",
    author: "د. أحمد ولد محمد سالم",
    description: "دراسة توثيقية للمكتبات الخاصة ومخطوطاتها في شنقيط",
    fullDescription: "دراسة توثيقية مهمة تتناول المكتبات الخاصة في مدينة شنقيط وما تحويه من مخطوطات نادرة. يقدم الكتاب فهرساً شاملاً لأهم المكتبات الخاصة وأصحابها، ويصف محتوياتها من المخطوطات في مختلف العلوم. كما يتناول طرق حفظ المخطوطات وتناقلها عبر الأجيال، ويسلط الضوء على جهود العلماء في جمع وحفظ التراث المكتوب. الكتاب مرجع مهم للباحثين في تاريخ المخطوطات والمكتبات الإسلامية.",
    category: "مؤلفات عن شنقيط",
    subcategory: "التاريخ",
    date: "2020م",
    pages: 450,
    language: "العربية",
    coverImage: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400",
    relatedItems: ["b3", "b1"],
    createdAt: "2024-01-23"
  },
  {
    id: "b3",
    title: "التعليم التقليدي في شنقيط",
    author: "د. محمد الأمين ولد الشيخ",
    description: "دراسة عن نظام التعليم التقليدي ومناهجه في شنقيط",
    fullDescription: "دراسة أكاديمية معمقة عن نظام التعليم التقليدي في مدينة شنقيط ومناهجه وطرق التدريس المتبعة. يتناول الكتاب تطور النظام التعليمي عبر القرون، ويصف المناهج الدراسية في مختلف العلوم الشرعية واللغوية. كما يسلط الضوء على دور المحاضر (المدارس التقليدية) في تكوين العلماء والأدباء، ويبرز خصائص الطريقة الشنقيطية في التعليم والتربية. الكتاب مفيد لفهم تاريخ التعليم الإسلامي في غرب أفريقيا.",
    category: "مؤلفات عن شنقيط",
    subcategory: "التاريخ",
    date: "2019م",
    pages: 380,
    language: "العربية",
    coverImage: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400",
    relatedItems: ["b1", "b2"],
    createdAt: "2024-01-21"
  }
];

export const allItems = [...manuscripts, ...tahqiqat, ...booksOnChinguitt];

export const getLatestItems = (limit: number = 6): Manuscript[] => {
  return allItems
    .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
    .slice(0, limit);
};

export function getItemById(id: string): Manuscript | undefined {
  return allItems.find(item => item.id === id);
}

export function searchItems(query: string): Manuscript[] {
  const lowercaseQuery = query.toLowerCase();
  return allItems.filter(item => 
    item.title.toLowerCase().includes(lowercaseQuery) ||
    item.author.toLowerCase().includes(lowercaseQuery) ||
    item.description.toLowerCase().includes(lowercaseQuery) ||
    item.category.toLowerCase().includes(lowercaseQuery)
  );
}