import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient.js';
import Sidebar from '../components/Sidebar.jsx';
import ProductCard from '../components/ProductCard.jsx';

const Product = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Hàm chuyển đổi giá từ chuỗi (VD: '350.000 VND') hoặc số sang số
  const parsePrice = (price) => {
    if (!price) return 0;
    if (typeof price === 'number') return price;
    return parseFloat(price.replace(/[^\d]/g, '')) || 0;
  };

  // Hàm thêm sản phẩm vào giỏ hàng
  const addProductToCart = (product) => {
    try {
      const savedCart = localStorage.getItem('cart');
      let cartItems = savedCart ? JSON.parse(savedCart) : [];
      
      const existingProduct = cartItems.find((item) => item.id === product.id);
      if (existingProduct) {
        cartItems = cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        cartItems.push({ ...product, quantity: 1 });
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
      // Dispatch a custom event to notify Cart component of the update
      window.dispatchEvent(new Event('cartUpdated'));
      // Show success toast
      setToast({ show: true, message: `${product.name} đã được thêm vào giỏ hàng!` });
      // Hide toast after 3 seconds
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    } catch (err) {
      console.error('Lỗi khi thêm vào giỏ hàng:', err);
      setToast({ show: true, message: 'Có lỗi xảy ra khi thêm vào giỏ hàng!' });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    }
  };

  // Lấy dữ liệu từ Supabase khi component được mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*');

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

  // Lọc sản phẩm dựa trên category và priceRange
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const price = parsePrice(product.price);
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
      {/* Toast Notification */}
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