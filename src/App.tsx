import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { SubcategoriesProvider } from "./contexts/SubcategoriesContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
const Manuscripts = lazy(() => import("./pages/Manuscripts"));
const ManuscriptDetail = lazy(() => import("./pages/ManuscriptDetail"));
const Tahqiq = lazy(() => import("./pages/Tahqiq"));
const TahqiqDetail = lazy(() => import("./pages/TahqiqDetail"));
const BooksOnChinguitt = lazy(() => import("./pages/BooksOnChinguitt"));
const AboutChinguit = lazy(() => import("./pages/AboutChinguit"));

const Search = lazy(() => import("./pages/Search"));
const AllEntries = lazy(() => import("./pages/AllEntries"));
const About = lazy(() => import("./pages/About"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminManuscripts = lazy(() => import("./pages/AdminManuscripts"));
const AdminAddManuscript = lazy(() => import("./pages/AdminAddManuscript"));
const AdminEditManuscript = lazy(() => import("./pages/AdminEditManuscript"));
const AdminPosts = lazy(() => import("./pages/AdminPosts"));
const AdminAddPost = lazy(() => import("./pages/AdminAddPost"));
const AdminEditPost = lazy(() => import("./pages/AdminEditPost"));
const AdminAuthors = lazy(() => import("./pages/AdminAuthors"));
const AdminInvestigations = lazy(() => import("./pages/AdminInvestigations"));
const AdminAboutChinguit = lazy(() => import("./pages/AdminAboutChinguit"));
const AdminAddAuthor = lazy(() => import("./pages/AdminAddAuthor"));
const AdminEditAuthor = lazy(() => import("./pages/AdminEditAuthor"));
const AdminAddInvestigation = lazy(
  () => import("./pages/AdminAddInvestigation")
);
const AdminEditInvestigation = lazy(
  () => import("./pages/AdminEditInvestigation")
);
const AdminAddAboutChinguit = lazy(
  () => import("./pages/AdminAddAboutChinguit")
);
const AdminEditAboutChinguit = lazy(
  () => import("./pages/AdminEditAboutChinguit")
);

// Category Pages
const ShariaSciences = lazy(() => import("./pages/ShariaSciences"));
const LinguisticSciences = lazy(() => import("./pages/LinguisticSciences"));
const SocialSciences = lazy(() => import("./pages/SocialSciences"));
const Varieties = lazy(() => import("./pages/Varieties"));
const Benefits = lazy(() => import("./pages/Benefits"));
const FormalEducationLibrary = lazy(
  () => import("./pages/FormalEducationLibrary")
);
const ScientificNews = lazy(() => import("./pages/ScientificNews"));

// Detail Pages
const BenefitsDetail = lazy(() => import("./pages/BenefitsDetail"));
const BooksOnChinguittDetail = lazy(
  () => import("./pages/BooksOnChinguittDetail")
);
const FormalEducationLibraryDetail = lazy(
  () => import("./pages/FormalEducationLibraryDetail")
);
const LinguisticSciencesDetail = lazy(
  () => import("./pages/LinguisticSciencesDetail")
);
const ScientificNewsDetail = lazy(() => import("./pages/ScientificNewsDetail"));
const ShariaSciencesDetail = lazy(() => import("./pages/ShariaSciencesDetail"));
const SocialSciencesDetail = lazy(() => import("./pages/SocialSciencesDetail"));
const VarietiesDetail = lazy(() => import("./pages/VarietiesDetail"));
const AboutChinguitDetail = lazy(() => import("./pages/AboutChinguitDetail"));

function App() {
  return (
    <Router>
      <SubcategoriesProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-ivory font-cairo">
          <Header />
          <main>
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="loading-skeleton w-20 h-20 rounded-full"></div>
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Home />} />
              <Route path="/manuscripts" element={<Manuscripts />} />
              <Route path="/manuscripts/:id" element={<ManuscriptDetail />} />
              <Route path="/tahqiq" element={<Tahqiq />} />
              <Route path="/tahqiq/:id" element={<TahqiqDetail />} />
              <Route
                path="/books-on-chinguitt"
                element={<BooksOnChinguitt />}
              />
              <Route
                path="/books-on-chinguitt/:id"
                element={<BooksOnChinguittDetail />}
              />
              <Route path="/about-chinguit" element={<AboutChinguit />} />
              <Route
                path="/about-chinguit/:id"
                element={<AboutChinguitDetail />}
              />

              <Route path="/search" element={<Search />} />
              <Route path="/all-entries" element={<AllEntries />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />

              {/* Category Pages */}
              <Route path="/sharia-sciences" element={<ShariaSciences />} />
              <Route
                path="/sharia-sciences/:id"
                element={<ShariaSciencesDetail />}
              />
              <Route
                path="/linguistic-sciences"
                element={<LinguisticSciences />}
              />
              <Route
                path="/linguistic-sciences/:id"
                element={<LinguisticSciencesDetail />}
              />
              <Route path="/social-sciences" element={<SocialSciences />} />
              <Route
                path="/social-sciences/:id"
                element={<SocialSciencesDetail />}
              />
              <Route path="/varieties" element={<Varieties />} />
              <Route path="/varieties/:id" element={<VarietiesDetail />} />
              <Route path="/benefits" element={<Benefits />} />
              <Route path="/benefits/:id" element={<BenefitsDetail />} />
              <Route
                path="/formal-education-library"
                element={<FormalEducationLibrary />}
              />
              <Route
                path="/formal-education-library/:id"
                element={<FormalEducationLibraryDetail />}
              />
              <Route path="/scientific-news" element={<ScientificNews />} />
              <Route
                path="/scientific-news/:id"
                element={<ScientificNewsDetail />}
              />

              {/* Admin Routes */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/manuscripts" element={<AdminManuscripts />} />
              <Route
                path="/admin/manuscripts/add"
                element={<AdminAddManuscript />}
              />
              <Route
                path="/admin/manuscripts/edit/:id"
                element={<AdminEditManuscript />}
              />
              <Route path="/admin/posts" element={<AdminPosts />} />
              <Route path="/admin/posts/add" element={<AdminAddPost />} />
              <Route path="/admin/posts/edit/:id" element={<AdminEditPost />} />
              <Route path="/admin/authors" element={<AdminAuthors />} />
              <Route
                path="/admin/investigations"
                element={<AdminInvestigations />}
              />
              <Route
                path="/admin/about-chinguit"
                element={<AdminAboutChinguit />}
              />
              <Route path="/admin/authors/add" element={<AdminAddAuthor />} />
              <Route
                path="/admin/authors/edit/:id"
                element={<AdminEditAuthor />}
              />
              <Route
                path="/admin/investigations/add"
                element={<AdminAddInvestigation />}
              />
              <Route
                path="/admin/investigations/edit/:id"
                element={<AdminEditInvestigation />}
              />
              <Route
                path="/admin/about-chinguit/add"
                element={<AdminAddAboutChinguit />}
              />
              <Route
                path="/admin/about-chinguit/edit/:id"
                element={<AdminEditAboutChinguit />}
              />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
      </SubcategoriesProvider>
    </Router>
  );
}

export default App;
