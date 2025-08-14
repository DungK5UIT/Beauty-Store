import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import mypham from '../assets/mypham.jpg';

// Constants
const API_BASE_URL = 'https://deploy-backend-production-e64e.up.railway.app';

// Utility function to format currency
const formatCurrency = (value) => {
  if (typeof value !== 'number') return '';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const Category = () => {
  const categories = [
    { id: 1, name: 'Chăm sóc da', bgColor: 'bg-gray-50', img: 'https://xfswcnmwovkwdwimszov.supabase.co/storage/v1/object/public/product-image/Kem_chong_nang_Biore_UV_Aqua-removebg-preview.png' },
    { id: 2, name: 'Trang điểm', bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50', img: 'https://xfswcnmwovkwdwimszov.supabase.co/storage/v1/object/public/product-image/Tinh_chat_SK-II_Facial_Treatment-removebg-preview.png' },
    { id: 3, name: 'Dưỡng tóc', bgColor: 'bg-gray-50', img: 'https://xfswcnmwovkwdwimszov.supabase.co/storage/v1/object/public/product-image/Tinh_dau_duong_tocMoroccanoil-removebg-preview.png' },
    { id: 4, name: 'Nước hoa', bgColor: 'bg-gray-50', img: 'https://xfswcnmwovkwdwimszov.supabase.co/storage/v1/object/public/product-image/Nuoc%20hoa%20Dior%20Sauvage%20Eau%20de%20Parfum.png' },
    { id: 5, name: 'Chăm sóc cơ thể', bgColor: 'bg-gray-50', img: 'https://xfswcnmwovkwdwimszov.supabase.co/storage/v1/object/public/product-image/Kem_duong_Clinique_Moisture_Surge-removebg-preview.png' },
  ];

  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const itemsPerPage = 3;
  const navigate = useNavigate();

  // Fetch best-selling and top-rated products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/products/list`);
        
        // Best-selling products (sorted by soldCount)
        const sortedBySold = response.data
          .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
          .slice(0, 9);
        setProducts(sortedBySold);

        // Top-rated products (sorted by rating)
        const sortedByRating = response.data
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 8);
        setTopRatedProducts(sortedByRating);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải sản phẩm');
        console.error('Lỗi khi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle adding product to cart
  const handleAddToCart = async (product) => {
    if (!user) {
      navigate('/login');
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
        navigate('/login');
      } else if (status === 404) {
        message = 'Sản phẩm không tồn tại.';
      }
      setToast({ show: true, message, type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
      console.error('Lỗi khi thêm vào giỏ hàng:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {toast.show && (
        <div
          className={`fixed top-20 right-4 px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out ${
            toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mt-10">
            Mua sắm theo danh mục
          </h1>
        </div>

        {/* Categories Grid */}
        <div className="w-full mx-auto grid grid-cols-5 gap-24 justify-items-center">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Circle Container */}
              <div
                className={`
                  w-55 h-55 rounded-full ${category.bgColor} 
                  flex items-center justify-center
                  transition-all duration-200 
                  group-hover:shadow-md
                  group-hover:scale-105
                  overflow-hidden
                `}
              >
                <img
                  src={category.img}
                  alt={category.name}
                  className="w-100% h-100% object-cover rounded-full"
                />
              </div>

              {/* Category Name */}
              <span className="mt-4 text-sm font-medium text-gray-700 text-center">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Product Showcase Section */}
      <div className="max-h-120 flex mt-20">
        <div
          className="flex-1 flex flex-col justify-center px-16 py-20 text-white relative"
          style={{ background: 'linear-gradient(to bottom right, #fefce8, #fefce8)' }}
        >
          <div className="relative z-10 max-w-lg text-left">
            <div
              className="text-sm uppercase tracking-widest mb-6 font-medium"
              style={{ color: '#3c3c5a', letterSpacing: '2px' }}
            >
              ƯU ĐÃI CÓ HẠN
            </div>
            <h1
              className="text-6xl font-bold leading-tight mb-6"
              style={{ color: '#3c3c5a' }}
            >
              Giảm 20% cho sản<br />
              phẩm bạn yêu thích
            </h1>
            <p
              className="text-base leading-relaxed mb-10 max-w-md"
              style={{ color: 'black' }}
            >
              Nhanh tay sở hữu các sản phẩm làm đẹp cao cấp với mức giá cực ưu đãi.
              Đừng bỏ lỡ — Ưu đãi sẽ kết thúc sớm!
            </p>
            <Link
              to="/product"
              className="bg-[#3c3c5a] text-white px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wide shadow-lg transition-all duration-300 hover:bg-white hover:text-[#3c3c5a] hover:-translate-y-1 hover:shadow-xl"
            >
              Mua Ngay
            </Link>
          </div>
        </div>
        <div
          className="flex-1 flex items-center justify-center p-16 relative overflow-hidden product-showcase"
          style={{
            backgroundImage: `url(${mypham})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>

      {/* Top Rated Products Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Sản phẩm yêu thích bạn cần
            </h2>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Đang tải sản phẩm...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : topRatedProducts.length === 0 ? (
            <p className="text-center text-gray-600">
              Hiện chưa có sản phẩm được đánh giá cao.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topRatedProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-full">
                  <ProductCard
                    product={product}
                    user={user}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-center">
            <Link
              to="/product"
              className="bg-transparent border border-gray-400 text-gray-700 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 hover:bg-gray-100"
            >
              Mua tất cả
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Category;