import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

// Pages
import Home from "./pages/Home";
import Manuscripts from "./pages/Manuscripts";
import ManuscriptDetail from "./pages/ManuscriptDetail";
import Tahqiq from "./pages/Tahqiq";
import TahqiqDetail from "./pages/TahqiqDetail";
import BooksOnChinguitt from "./pages/BooksOnChinguitt";
import BookDetail from "./pages/BookDetail";

import Search from "./pages/Search";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminManuscripts from "./pages/AdminManuscripts";
import AdminAddManuscript from "./pages/AdminAddManuscript";
import AdminBooks from "./pages/AdminBooks";
import AdminAddBook from "./pages/AdminAddBook";
import AdminPosts from "./pages/AdminPosts";
import AdminAddPost from "./pages/AdminAddPost";

// Category Pages
import ShariaSciences from "./pages/ShariaSciences";
import LinguisticSciences from "./pages/LinguisticSciences";
import SocialSciences from "./pages/SocialSciences";
import Varieties from "./pages/Varieties";
import Benefits from "./pages/Benefits";
import FormalEducationLibrary from "./pages/FormalEducationLibrary";
import ScientificNews from "./pages/ScientificNews";
import TestPage from "./pages/TestPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-ivory font-cairo">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manuscripts" element={<Manuscripts />} />
            <Route path="/manuscripts/:id" element={<ManuscriptDetail />} />
            <Route path="/tahqiq" element={<Tahqiq />} />
            <Route path="/tahqiq/:id" element={<TahqiqDetail />} />
            <Route path="/books-on-chinguitt" element={<BooksOnChinguitt />} />
            <Route path="/books-on-chinguitt/:id" element={<BookDetail />} />

            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />

            {/* Category Pages */}
            <Route path="/sharia-sciences" element={<ShariaSciences />} />
            <Route
              path="/linguistic-sciences"
              element={<LinguisticSciences />}
            />
            <Route path="/social-sciences" element={<SocialSciences />} />
            <Route path="/varieties" element={<Varieties />} />
            <Route path="/benefits" element={<Benefits />} />
            <Route
              path="/formal-education-library"
              element={<FormalEducationLibrary />}
            />
            <Route path="/scientific-news" element={<ScientificNews />} />
            <Route path="/test" element={<TestPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/manuscripts" element={<AdminManuscripts />} />
            <Route
              path="/admin/manuscripts/add"
              element={<AdminAddManuscript />}
            />
            <Route path="/admin/books" element={<AdminBooks />} />
            <Route path="/admin/books/add" element={<AdminAddBook />} />
            <Route path="/admin/posts" element={<AdminPosts />} />
            <Route path="/admin/posts/add" element={<AdminAddPost />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;
