import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const API_BASE_URL = 'https://deploy-backend-production-e64e.up.railway.app';

const Product = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    console.log('User in Product:', user); // Debug user
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/products/list`);
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Dữ liệu sản phẩm không hợp lệ');
        }
        setProducts(response.data);
      } catch (err) {
        const message = err.response?.data?.message || 'Không thể tải dữ liệu sản phẩm';
        setError(message);
        console.error('Lỗi khi lấy sản phẩm:', err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addProductToCart = async (product) => {
    console.log('Adding product to cart:', product?.id, 'User:', user); // Debug product.id và user
    if (!user || !user.id) {
      setToast({
        show: true,
        message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!',
        type: 'error',
      });
      navigate('/login');
      return;
    }

    if (!product || !product.id) {
      setToast({
        show: true,
        message: 'Sản phẩm không hợp lệ!',
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setToast({
          show: true,
          message: 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại!',
          type: 'error',
        });
        navigate('/login');
        return;
      }

      await axios.post(
        `${API_BASE_URL}/api/cart/add/${user.id}`,
        {
          productId: product.id,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setToast({
        show: true,
        message: `${product.name} đã được thêm vào giỏ hàng!`,
        type: 'success',
      });
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
      console.error('Lỗi khi thêm vào giỏ hàng:', err.response || err);
    }
  };

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

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {toast.show && (
        <div
          className={`fixed top-20 right-4 px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out ${
            toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
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
                  <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-600">Hiện có {filteredProducts.length} sản phẩm</p>
                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin/add-product"
                        className="text-sm text-white bg-pink-600 hover:bg-pink-700 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Thêm sản phẩm
                      </Link>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        user={user}
                        handleAddToCartClick={() => addProductToCart(product)} // Sửa tên hàm
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-600 col-span-full mt-10">
                      Không có sản phẩm nào phù hợp.
                    </p>
                  )}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2 mt-6">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === index + 1
                            ? 'bg-pink-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } transition-colors`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Product;