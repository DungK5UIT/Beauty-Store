import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Phone, Mail, CreditCard,
  Truck, Check, QrCode, Shield, User, Loader2
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Hàm format giá tiền từ Cart
const formatCurrency = (value) => {
  if (!value && value !== 0) return '';
  return Number(value).toLocaleString('vi-VN') + ' VNĐ';
};

const Pay = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    note: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showMomoQR, setShowMomoQR] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  // Lấy totalAmount từ state của Cart.js (nếu có)
  const totalAmount = location.state?.totalAmount || 0;

  useEffect(() => {
    const fetchCart = async () => {
      if (!user || !user.id) {
        setError('Vui lòng đăng nhập để thanh toán');
        setToast({ show: true, message: 'Vui lòng đăng nhập để thanh toán', type: 'error' });
        setTimeout(() => navigate('/login', { state: { from: '/pay' } }), 2000);
        return;
      }

      try {
        const apiClient = axios.create({
          baseURL: 'https://deploy-backend-production-e64e.up.railway.app',
          timeout: 10000,
        });
        const response = await apiClient.get(`/api/cart/${user.id}`);
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
      }
    };
    fetchCart();
  }, [navigate, user, logout]);

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setShowMomoQR(method === 'momo');
  };

  const handlePlaceOrder = async () => {
    setError('');
    setIsLoading(true);

    // --- VALIDATION ---
    if (!user || !user.id) {
      setError('Vui lòng đăng nhập để đặt hàng');
      setToast({ show: true, message: 'Vui lòng đăng nhập để đặt hàng', type: 'error' });
      setTimeout(() => navigate('/login', { state: { from: '/pay' } }), 2000);
      setIsLoading(false);
      return;
    }
    if (cartItems.length === 0) {
      setError('Giỏ hàng của bạn đang trống.');
      setToast({ show: true, message: 'Giỏ hàng của bạn đang trống.', type: 'error' });
      setIsLoading(false);
      return;
    }
    if (!paymentMethod) {
      setError('Vui lòng chọn phương thức thanh toán');
      setToast({ show: true, message: 'Vui lòng chọn phương thức thanh toán', type: 'error' });
      setIsLoading(false);
      return;
    }
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || !shippingInfo.district) {
      setError('Vui lòng điền đầy đủ các trường thông tin giao hàng có dấu *');
      setToast({ show: true, message: 'Vui lòng điền đầy đủ các trường thông tin giao hàng có dấu *', type: 'error' });
      setIsLoading(false);
      return;
    }

    // --- TẠO DỮ LIỆU ĐƠN HÀNG ---
    const fullAddress = `${shippingInfo.address}, ${shippingInfo.district}, ${shippingInfo.city}`;
    const orderData = {
      userId: user.id,
      paymentMethod: paymentMethod.toUpperCase(),
      shippingAddress: fullAddress,
      note: shippingInfo.note || 'Không có ghi chú',
      totalAmount: totalAmount, // Thêm totalAmount
    };

    try {
      const apiClient = axios.create({
        baseURL: 'https://deploy-backend-production-e64e.up.railway.app',
        timeout: 10000,
      });

      if (paymentMethod === 'vnpay') {
        console.log('Initiating VNPay payment with data:', orderData);
        const response = await apiClient.post('/api/orders/create', orderData);
        console.log('VNPay response:', response.data);

        if (response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl; // Redirect đến VNPay
        } else {
          throw new Error('Không nhận được URL thanh toán từ máy chủ.');
        }
      } else if (paymentMethod === 'cod') {
        const response = await apiClient.post('/api/orders/create', orderData);
        console.log('COD order response:', response.data);
        setToast({ show: true, message: 'Đặt hàng thành công với phương thức thanh toán khi nhận hàng!', type: 'success' });
        setTimeout(() => navigate('/order-success'), 2000);
      } else if (paymentMethod === 'momo') {
        setError('Phương thức thanh toán MoMo chưa được triển khai.');
        setToast({ show: true, message: 'Phương thức thanh toán MoMo chưa được triển khai.', type: 'error' });
      } else {
        throw new Error('Phương thức thanh toán không được hỗ trợ.');
      }
    } catch (err) {
      console.error('Order placement failed:', err.response || err);
      const status = err.response?.status;
      let message = err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.';
      if (status === 401) {
        message = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
        logout();
        navigate('/login');
      } else if (err.response?.data?.message?.includes('Invalid')) {
        message = 'Dữ liệu gửi sang VNPay không đúng định dạng. Vui lòng kiểm tra giỏ hàng và thử lại.';
      }
      setError(message);
      setToast({ show: true, message, type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const paymentOptions = [
    { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Thanh toán bằng tiền mặt khi nhận hàng', icon: <Truck className="w-5 h-5" />, color: 'bg-orange-100 text-orange-600' },
    { id: 'vnpay', label: 'Cổng thanh toán VNPAY', desc: 'Hỗ trợ Thẻ ATM, Visa, QR Pay', icon: <QrCode className="w-5 h-5" />, color: 'bg-cyan-100 text-cyan-600' },
    { id: 'momo', label: 'Ví MoMo', desc: 'Thanh toán qua ví điện tử MoMo', icon: <div className="w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center"><span className="text-white font-bold text-xs">M</span></div>, color: 'bg-pink-100 text-pink-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {toast.show && (
        <div className={`fixed top-20 right-4 px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/cart')} className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
            <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">{error}</div>}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-full">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Thông tin giao hàng</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Họ và tên *
                  </label>
                  <input type="text" name="fullName" value={shippingInfo.fullName} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nhập họ và tên" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Số điện thoại *
                  </label>
                  <input type="tel" name="phone" value={shippingInfo.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nhập số điện thoại" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input type="email" name="email" value={shippingInfo.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nhập email (không bắt buộc)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố *</label>
                  <input type="text" name="city" value={shippingInfo.city} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="VD: TP. Hồ Chí Minh" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện *</label>
                  <input type="text" name="district" value={shippingInfo.district} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="VD: Quận 1" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ chi tiết *
                  </label>
                  <input type="text" name="address" value={shippingInfo.address} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Số nhà, tên đường, phường/xã" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea name="note" value={shippingInfo.note} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ghi chú cho người giao hàng (không bắt buộc)" rows="3"></textarea>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2 rounded-full">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Phương thức thanh toán</h2>
              </div>

              <div className="space-y-4">
                {paymentOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handlePaymentMethodChange(option.id)}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`${option.color} p-2 rounded-full`}>
                          {option.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{option.label}</h3>
                          <p className="text-sm text-gray-500">{option.desc}</p>
                        </div>
                      </div>
                      {paymentMethod === option.id && (
                        <div className="bg-blue-500 rounded-full p-1">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {showMomoQR && (
                <div className="mt-6 p-6 bg-pink-50 rounded-xl border border-pink-200">
                  <div className="text-center">
                    <img src="https://placehold.co/200x200/FFFFFF/E91E63?text=QR+MoMo" alt="QR MoMo" className="w-full h-auto max-w-[200px] mx-auto rounded-xl shadow-md" />
                    <h3 className="font-semibold text-gray-900 my-2">Quét mã QR để thanh toán</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Số tiền: <span className="font-bold text-pink-600">{formatCurrency(total)}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Đơn hàng của bạn</h3>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cartItems.length > 0 ? cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.product.name}</h4>
                      <p className="text-gray-500 text-xs">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                )) : <p className="text-gray-500 text-sm">Giỏ hàng của bạn đang trống.</p>}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-3">
                  <span>Tổng cộng</span>
                  <span className="text-[#483C54]">{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isLoading || cartItems.length === 0}
                className="w-full bg-[#483C54] hover:bg-[#5a4d68] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Đặt hàng ngay'
                )}
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pay;