import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient.js';
import Sidebar from '../components/Sidebar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import axios from 'axios';

const Product = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      setIsLoggedIn(true);
    }
  }, []);

  // Add product to cart
  const addProductToCart = async (product) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      setToast({ show: true, message: 'Vui lòng đăng nhập để thêm vào giỏ hàng!' });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
      navigate('/login', { state: { from: '/product' } });
      return;
    }

    try {
      const response = await axios.post(`https://deploy-backend-production-e64e.up.railway.app/api/cart/add/${user.id}`, {
        productId: product.id,
        quantity: 1,
      });
      setToast({ show: true, message: `${product.name} đã được thêm vào giỏ hàng!` });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    } catch (err) {
      console.error('Lỗi khi thêm vào giỏ hàng:', {
        message: err.message,
        response: err.response ? {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers,
        } : null,
        request: err.request ? err.request : null,
      });
      setToast({ show: true, message: err.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng!' });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    }
  };

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async (page = 1, pageSize = 10) => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .range((page - 1) * pageSize, page * pageSize - 1);

        if (error) {
          throw error;
        }

        setProducts(data);
      } catch (err) {
        setError('Không thể tải dữ liệu sản phẩm');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products
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
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-out">
          {toast.message}
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <Sidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedPriceRange={selectedPriceRange}
            onPriceRangeChange={setSelectedPriceRange}
          />
          <main className="flex-1">
            {loading ? (
              <p className="text-center text-gray-600">Đang tải sản phẩm...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Sản phẩm mỹ phẩm mới nhất</h2>
                  <p className="text-sm text-gray-600">Hiện có {filteredProducts.length} sản phẩm</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={() => addProductToCart(product)}
                        isLoggedIn={isLoggedIn}
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-600">Không có sản phẩm nào phù hợp với bộ lọc.</p>
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