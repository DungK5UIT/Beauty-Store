import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const handleCartUpdate = () => {
      const savedCart = localStorage.getItem('cart');
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const parsePrice = (price) => {
    if (typeof price === 'string') {
      return parseInt(price.replace(/\./g, ''), 10);
    }
    return price;
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems
    .reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0)
    .toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

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
                        src={item.image || '/placeholder-image.jpg'}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl bg-gray-100"
                        onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-blue-600">
                          {parsePrice(item.price).toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-gray-100 rounded-full p-1">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all duration-200"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="w-12 text-center font-semibold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQuantity(item.id)}
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all duration-200"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors duration-200"
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
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
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
                      <span className="text-blue-600">{total}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl">
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
