import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/products/list`);
        // Giả sử backend trả về mảng sản phẩm, có thể thêm `isBestSeller` hoặc `soldCount`
        // Ở đây mình sắp xếp theo số lượng bán (giả định có trường `soldCount`)
        const sorted = response.data
          .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
          .slice(0, 8); // Lấy 8 sản phẩm bán chạy nhất
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
      alert(`${product.name} đã được thêm vào giỏ hàng!`);
    } catch (err) {
      const status = err.response?.status;
      let message = 'Có lỗi xảy ra khi thêm vào giỏ hàng!';
      if (status === 401) {
        message = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
        window.location.href = '/login';
      } else if (status === 404) {
        message = 'Sản phẩm không tồn tại.';
      }
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
            to="/products"
            className="inline-block bg-white hover:bg-gray-200 text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
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
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Khám phá những sản phẩm bán chạy nhất
          </h2>

          {loading ? (
            <p className="text-center text-gray-600">Đang tải sản phẩm...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-600">Hiện chưa có sản phẩm bán chạy nào.</p>
          ) : (
            <div className="flex overflow-x-auto space-x-6 pb-6 scrollbar-hide">
              {products.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-64">
                  <ProductCard
                    product={product}
                    user={user}
                    handleAddToCartClick={() => handleAddToCart(product)}
                  />
                </div>
              ))}
            </div>
          )}

         
        </div>
      </section>
    </div>
  );
};

export default Home;