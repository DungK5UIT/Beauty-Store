import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Product from './pages/Product';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Pay from './pages/Pay';
import Home from './pages/Home';
import ChatBox from './components/ChatBox';
import Catagory from './pages/Catagory';
const App = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header /> 
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} /> {/* Thêm route cho trang chủ */}
            <Route path="/product" element={<Product />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/pay" element={<Pay />} />
            <Route path="*" element={<div className="text-center p-20">404 - Trang không tồn tại</div>} />
            <Route path="/catagory" element={<Catagory />} />
          </Routes>
          <ChatBox/>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;