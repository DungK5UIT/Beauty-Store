import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Hàm format giá tiền
const formatCurrency = (value) => {
  if (!value) return '';
  return Number(value).toLocaleString('vi-VN') + ' VNĐ';
};

// Hàm debounce đơn giản
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const [loadingItems, setLoadingItems] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchCart = async () => {
      if (!user || !user.id) {
        setError('Vui lòng đăng nhập để xem giỏ hàng');
        navigate('/login', { state: { from: '/cart' } });
        return;
      }

      try {
        const response = await axios.get(`deploy-backend-production-e64e.up.railway.app/api/cart/${user.id}`);
        setCartItems(response.data);
      } catch (err) {
        setError(err.response?.data || 'Không thể tải giỏ hàng');
        console.error('Fetch cart failed:', err.response || err);
      }
    };
    fetchCart();
  }, [navigate, user]);

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!user || !user.id) {
      setError('Vui lòng đăng nhập để chỉnh sửa giỏ hàng');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    if (newQuantity < 1) return;

    const originalItems = [...cartItems];
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
    setLoadingItems((prev) => ({ ...prev, [cartItemId]: true }));

    try {
      await axios.post(`deploy-backend-production-e64e.up.railway.app/api/cart/update/${user.id}`, {
        cartItemId,
        quantity: newQuantity,
      });
    } catch (err) {
      setError(err.response?.data || 'Không thể cập nhật số lượng');
      setCartItems(originalItems);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [cartItemId]: false }));
    }
  };

  const debouncedUpdateQuantity = debounce(updateQuantity, 500);

  const increaseQuantity = (cartItemId) => {
    const item = cartItems.find((item) => item.id === cartItemId);
    debouncedUpdateQuantity(cartItemId, item.quantity + 1);
  };

  const decreaseQuantity = (cartItemId) => {
    const item = cartItems.find((item) => item.id === cartItemId);
    if (item.quantity <= 1) return;
    debouncedUpdateQuantity(cartItemId, item.quantity - 1);
  };

  const removeItem = async (cartItemId) => {
    if (!user || !user.id) {
      setError('Vui lòng đăng nhập để xóa sản phẩm');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    const originalItems = [...cartItems];
    setCartItems(cartItems.filter((item) => item.id !== cartItemId));
    setLoadingItems((prev) => ({ ...prev, [cartItemId]: true }));

    try {
      await axios.delete(`deploy-backend-production-e64e.up.railway.app/api/cart/remove/${user.id}/${cartItemId}`);
    } catch (err) {
      setError(err.response?.data || 'Không thể xóa sản phẩm');
      setCartItems(originalItems);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [cartItemId]: false }));
    }
  };

  const handleCheckout = () => {
    if (!user || !user.id) {
      navigate('/login', { state: { from: '/pay' } });
    } else {
      navigate('/pay');
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-3 rounded-full">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
            <p className="text-gray-600">Quản lý sản phẩm của bạn</p>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h3>
            <p className="text-gray-500">Hãy thêm sản phẩm để bắt đầu mua sắm</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={item.product.image || '/placeholder-image.jpg'}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-xl bg-gray-100"
                        onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-gray-100 rounded-full p-1">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all duration-200 ${
                                item.quantity <= 1 || loadingItems[item.id] ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={item.quantity <= 1 || loadingItems[item.id]}
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="w-12 text-center font-semibold text-gray-900">
                              {loadingItems[item.id] ? '...' : item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQuantity(item.id)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all duration-200 ${
                                loadingItems[item.id] ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={loadingItems[item.id]}
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className={`w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors duration-200 ${
                              loadingItems[item.id] ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={loadingItems[item.id]}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8 w-full md:w-[360px]">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Số lượng sản phẩm</span>
                    <span className="font-semibold">{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Số mặt hàng</span>
                    <span className="font-semibold">{cartItems.length}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Tổng cộng</span>
                      <span className="text-blue-600">{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={Object.values(loadingItems).some((loading) => loading)}
                  >
                    Mua ngay
                  </button>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    🔒 Thanh toán an toàn & bảo mật
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
