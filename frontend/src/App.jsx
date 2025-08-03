import Header from './components/Header';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Product from './pages/Product';
import Footer from './components/Footer';
import Cart from './pages/Cart';
import Pay from './pages/Pay';
const App = () => {
  return (
    <>
      <Header /> 
      <Routes>
        <Route path="/product" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/pay" element={<Pay />} />

      </Routes>
      <Footer/>
    </>
  );
};

export default App;
