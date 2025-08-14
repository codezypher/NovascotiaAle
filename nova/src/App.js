import React from 'react';
import About from './pages/about';
import Offers from './pages/offers';
import Blogs from './pages/blog';
import Contact from './pages/contact';
import Index from './pages';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/about' element={<About />} />
        <Route path='/offers' element={<Offers />} />
        <Route path='/blog' element={<Blogs />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
      <Footer />
    </BrowserRouter>
    </div>
 
  );
}

export default App;