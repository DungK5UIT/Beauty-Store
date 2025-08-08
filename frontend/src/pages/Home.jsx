import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import unnamedImage from '../assets/unnamed.png';

// Định dạng tiền tệ
const formatCurrency = (value) => {
  if (typeof value !== 'number') return '';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// URL API
const API_BASE_URL = 'https://deploy-backend-production-e64e.up.railway.app';

const Home = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/products/list`);
        const sorted = response.data
          .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
          .slice(0, 9);
        setProducts(sorted);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải sản phẩm bán chạy');
        console.error('Lỗi khi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/cart/add/${user.id}`, {
        productId: product.id,
        quantity: 1,
      });
      setToast({ show: true, message: `${product.name} đã được thêm vào giỏ hàng!`, type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    } catch (err) {
      const status = err.response?.status;
      let message = err.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng!';
      if (status === 401) {
        message = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
        window.location.href = '/login';
      } else if (status === 404) {
        message = 'Sản phẩm không tồn tại.';
      }
      setToast({ show: true, message, type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
      console.error('Lỗi khi thêm vào giỏ hàng:', err);
    }
  };

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + itemsPerPage, products.length - itemsPerPage));
  };

  const displayedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {toast.show && (
        <div
          className={`fixed top-20 right-4 px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out ${
            toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-[50vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080')`,
          }}
        ></div>

        <div className="relative z-10 flex flex-col items-start justify-center h-full w-[40%] text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 drop-shadow-lg">
            Khám Phá Vẻ Đẹp Tự Nhiên
          </h1>
          <p className="text-sm sm:text-base lg:text-lg mb-4 max-w-xs drop-shadow-md">
            Nâng niu làn da của bạn với các sản phẩm mỹ phẩm cao cấp
          </p>
          <Link
            to="/product"
            className="inline-block bg-white hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Mua sắm ngay
          </Link>
        </div>
      </div>

      {/* Banner Thông Điệp */}
      <div className="bg-[#EEF4D5] flex items-center justify-between px-20 h-[10vh] w-full text-lg font-semibold text-gray-700 tracking-wider">
        <span>✦ AN TOÀN & LÀNH TÍNH</span>
        <span>✦ BAO BÌ THÂN THIỆN MÔI TRƯỜNG</span>
        <span>✦ CÔNG THỨC ĐỘC QUYỀN</span>
        <span>✦ NGUYÊN LIỆU CAO CẤP</span>
      </div>

      {/* Best Sellers Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Khám phá những sản phẩm bán chạy nhất</h2>
            <div className="flex space-x-4">
              <button
                onClick={handlePrev}
                disabled={startIndex === 0}
                className={`w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg border-2 border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all`}
                aria-label="Sản phẩm trước"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                disabled={startIndex >= products.length - itemsPerPage}
                className={`w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg border-2 border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all`}
                aria-label="Sản phẩm tiếp theo"
              >
                →
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Đang tải sản phẩm...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-600">Hiện chưa có sản phẩm bán chạy nào.</p>
          ) : (
            <div className="flex space-x-6 justify-center">
              {displayedProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-64">
                  <ProductCard
                    product={product}
                    user={user}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Showcase Section */}
      <div className="min-h-screen flex">
        <div
          className="flex-1 flex items-center justify-center p-16 relative overflow-hidden product-showcase"
          style={{
            backgroundImage: `url(${unnamedImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>

        <div
          className="flex-1 flex flex-col justify-center px-16 py-20 text-white relative"
          style={{ background: '#3c3c5a' }}
        >
          <div className="relative z-10 max-w-md ml-10">
            <div
              className="text-xs uppercase tracking-widest mb-8 font-medium"
              style={{ color: '#b8a082', letterSpacing: '2px' }}
            >
              Quà Tặng Được Chọn Lọc Kỹ Càng
            </div>
            <h1
              className="text-5xl font-light leading-tight mb-10"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e8d5c4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Món Quà Làm Đẹp,<br />
              Cử Chỉ Tình Yêu
            </h1>
            <p className="text-lg leading-relaxed mb-12 max-w-96" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Làm hài lòng những người thân yêu với những món quà làm đẹp vượt thời gian mà họ sẽ yêu thích.
              Ăn mừng những khoảnh khắc trong cuộc sống với những sản phẩm làm đẹp cao cấp,
              được gói ghém hoàn hảo và sẵn sàng làm vui lòng những người thân yêu của bạn.
            </p>
            <Link
              to="/product"
              className="bg-white text-purple-800 px-10 py-5 rounded-full text-sm font-semibold uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-gray-100"
              style={{ color: '#2d2d4a' }}
            >
              Mua Quà Tặng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;