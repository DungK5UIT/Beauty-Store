import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'https://deploy-backend-niu0.onrender.com';

const formatCurrency = (value) => {
  if (value == null) return '';
  return Number(value).toLocaleString('vi-VN') + ' VNĐ';
};

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const Cart = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cart/${user.id}`);
        setCartItems(response.data);
      } catch (err) {
        const status = err.response?.status;
        let message = err.response?.data?.message || 'Không thể tải giỏ hàng';
        if (status === 401) {
          message = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
          logout();
          navigate('/login');
        }
        setError(message);
        setToast({ show: true, message, type: 'error' });
        setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
        console.error('Fetch cart failed:', err.response || err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user, logout, navigate]);

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!user || newQuantity < 1) return;

    const originalItems = [...cartItems];
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
    setLoadingItems((prev) => ({ ...prev, [cartItemId]: true }));

    try {
      await axios.post(`${API_BASE_URL}/api/cart/update/${user.id}`, {
        cartItemId,
        quantity: newQuantity,
      });
      setToast({ show: true, message: 'Cập nhật số lượng thành công', type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    } catch (err) {
      const status = err.response?.status;
      let message = err.response?.data?.message || 'Không thể cập nhật số lượng';
      if (status === 401) {
        message = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
        logout();
        navigate('/login');
      }
      setError(message);
      setCartItems(originalItems);
      setToast({ show: true, message, type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [cartItemId]: false }));
    }
  };

  const debouncedUpdateQuantity = useCallback(debounce(updateQuantity, 500), [user]);

  const increaseQuantity = (cartItemId) => {
    const item = cartItems.find((item) => item.id === cartItemId);
    if (item) {
      debouncedUpdateQuantity(cartItemId, item.quantity + 1);
    }
  };

  const decreaseQuantity = (cartItemId) => {
    const item = cartItems.find((item) => item.id === cartItemId);
    if (item && item.quantity > 1) {
      debouncedUpdateQuantity(cartItemId, item.quantity - 1);
    }
  };

  const removeItem = async (cartItemId) => {
    if (!user) return;

    const originalItems = [...cartItems];
    setCartItems(cartItems.filter((item) => item.id !== cartItemId));
    setLoadingItems((prev) => ({ ...prev, [cartItemId]: true }));

    try {
      await axios.delete(`${API_BASE_URL}/api/cart/remove/${user.id}/${cartItemId}`);
      setToast({ show: true, message: 'Xóa sản phẩm thành công', type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    } catch (err) {
      const status = err.response?.status;
      let message = err.response?.data?.message || 'Không thể xóa sản phẩm';
      if (status === 401) {
        message = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
        logout();
        navigate('/login');
      }
      setError(message);
      setCartItems(originalItems);
      setToast({ show: true, message, type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [cartItemId]: false }));
    }
  };

  const handleCheckout = () => {
  navigate('/pay', { state: { totalAmount } });
};

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang tải giỏ hàng...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Giỏ hàng của bạn</h3>
          <p className="text-gray-500 mb-4">Vui lòng đăng nhập để xem sản phẩm trong giỏ hàng.</p>
          <button onClick={() => navigate('/login')} className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {toast.show && (
        <div className={`fixed top-20 right-4 px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#483C54] p-3 rounded-full">
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
                    <img
                      src={item.product.image || '/placeholder-image.jpg'}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-xl bg-gray-100"
                      onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold [#483C54]">
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
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
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
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Tổng cộng</span>
                      <span className="text-[#483C54]">{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
            className="w-full bg-[#483C54] hover:bg-[#5a4d68] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                  disabled={Object.values(loadingItems).some((loading) => loading) || cartItems.length === 0}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;