import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- THAY ĐỔI 1: Import AuthProvider ---
import { AuthProvider } from './context/AuthContext';

// Import các component và page
import Header from './components/Header';
import Footer from './components/Footer';
import Product from './pages/Product';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Pay from './pages/Pay';

// Component trang chủ ví dụ
const HomePage = () => (
  <div className="text-center p-20">
    <h1 className="text-4xl font-bold">Chào mừng đến với Beauty Store</h1>
    <p className="text-xl mt-4">Nơi sắc đẹp thăng hoa.</p>
  </div>
);

const App = () => {
  return (
    // --- THAY ĐỔI 2: Bọc toàn bộ ứng dụng trong AuthProvider và Router ---
    // Router phải ở ngoài AuthProvider vì AuthProvider cần dùng useNavigate
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header /> 
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product" element={<Product/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/pay" element={<Pay />} />
              {/* Thêm các route khác nếu cần */}
              <Route path="*" element={<div className="text-center p-20">404 - Trang không tồn tại</div>} />
            </Routes>
          </main>
          <Footer/>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;