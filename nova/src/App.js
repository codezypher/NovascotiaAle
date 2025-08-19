// App.jsx
import React from "react";
import About from "./pages/about";
import Offers from "./pages/offers";
import Blogs from "./pages/blog";
import Contact from "./pages/contact";
import Index from "./pages";
import Explore from "./pages/Explore";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      {/* add top padding so content starts *below* the header */}
      <main style={{ paddingTop: "115px" }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/blog" element={<Blogs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/explore/:kind" element={<Explore />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
