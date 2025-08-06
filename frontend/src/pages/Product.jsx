import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Giả sử các component này đã được tạo
import Sidebar from '../components/Sidebar.jsx';
import ProductCard from '../components/ProductCard.jsx';
// --- THAY ĐỔI 1: Sử dụng context ---
import { useAuth } from '../context/AuthContext'; 

// URL của backend, nên được định nghĩa ở một nơi tập trung
const API_BASE_URL = 'https://deploy-backend-production-e64e.up.railway.app';

const Product = () => {
  // --- THAY ĐỔI 2: Lấy user từ context, bỏ state isLoggedIn ---
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  // --- THAY ĐỔI 3: Cập nhật hàm thêm vào giỏ hàng ---
  const addProductToCart = async (product) => {
    // Logic kiểm tra user và điều hướng đã được chuyển vào trong ProductCard
    // Hàm này giờ chỉ tập trung vào việc gọi API
    if (!user) {
        // Mặc dù ProductCard đã xử lý, để đây như một lớp bảo vệ cuối cùng
        navigate('/login');
        return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/cart/add/${user.id}`, {
        productId: product.id,
        quantity: 1,
      });
      setToast({ show: true, message: `${product.name} đã được thêm vào giỏ hàng!` });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    } catch (err) {
      console.error('Lỗi khi thêm vào giỏ hàng:', err.response || err);
      setToast({ show: true, message: err.response?.data?.message || 'Có lỗi xảy ra!' });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    }
  };

  // --- THAY ĐỔI 4: Lấy sản phẩm từ backend của bạn thay vì Supabase ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Giả sử bạn có một endpoint /api/products để lấy tất cả sản phẩm
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        setProducts(response.data);
      } catch (err) {
        setError('Không thể tải dữ liệu sản phẩm');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Logic lọc sản phẩm (giữ nguyên)
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const price = product.price;
    let matchesPrice = true;

    if (selectedPriceRange !== 'all') {
      if (selectedPriceRange === 'under500k') {
        matchesPrice = price < 500000;
      } else if (selectedPriceRange === '500k-1m') {
        matchesPrice = price >= 500000 && price <= 1000000;
      } else if (selectedPriceRange === 'over1m') {
        matchesPrice = price > 1000000;
      }
    }

    return matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {toast.show && (
        <div className="fixed top-20 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {toast.message}
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Sidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedPriceRange={selectedPriceRange}
            onPriceRangeChange={setSelectedPriceRange}
          />
          <main className="flex-1">
            {loading ? (
              <p className="text-center text-gray-600 mt-10">Đang tải sản phẩm...</p>
            ) : error ? (
              <p className="text-center text-red-500 mt-10">{error}</p>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Tất cả sản phẩm</h2>
                  <p className="text-sm text-gray-600">Hiện có {filteredProducts.length} sản phẩm</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        // --- THAY ĐỔI 5: Bỏ prop isLoggedIn ---
                        onAddToCart={() => addProductToCart(product)}
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-600 col-span-full mt-10">Không có sản phẩm nào phù hợp.</p>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Product;
