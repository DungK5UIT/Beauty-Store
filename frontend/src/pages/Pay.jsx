import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, CreditCard, Truck, Check, Shield, User, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://deploy-backend-production-e64e.up.railway.app';

const formatCurrency = (value) => {
  if (!value && value !== 0) return '';
  return Number(value).toLocaleString('vi-VN') + ' VNĐ';
};

const Pay = () => {
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
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage
  const getUserInfo = () => {
    try {
      const userString = localStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return null;
    }
  };
  const user = getUserInfo();

  // Lấy token từ localStorage (giả định token được lưu khi đăng nhập)
  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (!user || !user.id) {
        setError('Vui lòng đăng nhập để thanh toán');
        navigate('/login', { state: { from: '/pay' } });
        return;
      }

      try {
        const apiClient = axios.create({
          baseURL: API_BASE_URL,
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        });
        const response = await apiClient.get(`/api/cart/${user.id}`);
        setCartItems(response.data);

        // Tự động điền thông tin user nếu có
        setShippingInfo((prev) => ({
          ...prev,
          fullName: user.full_name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || ''
        }));
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải giỏ hàng');
        console.error('Fetch cart failed:', err.response || err);
      }
    };
    fetchCart();
  }, [navigate, user]);

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePlaceOrder = async () => {
    setError('');
    setIsLoading(true);

    // Validation
    if (!user || !user.id) {
      setError('Vui lòng đăng nhập để đặt hàng');
      navigate('/login', { state: { from: '/pay' } });
      setIsLoading(false);
      return;
    }
    if (cartItems.length === 0) {
      setError('Giỏ hàng của bạn đang trống');
      setIsLoading(false);
      return;
    }
    if (!paymentMethod) {
      setError('Vui lòng chọn phương thức thanh toán');
      setIsLoading(false);
      return;
    }
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || !shippingInfo.district) {
      setError('Vui lòng điền đầy đủ các trường thông tin giao hàng có dấu *');
      setIsLoading(false);
      return;
    }
    if (!validatePhone(shippingInfo.phone)) {
      setError('Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10 chữ số)');
      setIsLoading(false);
      return;
    }

    // Tạo dữ liệu đơn hàng
    const fullAddress = `${shippingInfo.address}, ${shippingInfo.district}, ${shippingInfo.city}`;
    const orderData = {
      userId: user.id,
      paymentMethod: paymentMethod.toUpperCase(),
      shippingAddress: fullAddress,
      note: shippingInfo.note || 'Không có ghi chú'
    };

    try {
      const apiClient = axios.create({
        baseURL: API_BASE_URL,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000 // Tăng timeout lên 15s
      });

      if (paymentMethod === 'vnpay') {
        console.log("Initiating VNPay payment with data:", orderData);
        const response = await apiClient.post('/api/orders/create', orderData);
        console.log("VNPay response:", response.data);

        if (response.data && response.data.paymentUrl) {
          // Lưu orderId vào localStorage để sử dụng trong callback
          localStorage.setItem('pendingOrderId', response.data.orderId);
          window.location.href = response.data.paymentUrl;
        } else {
          throw new Error('Không nhận được URL thanh toán từ máy chủ');
        }
      } else if (paymentMethod === 'cod') {
        const response = await apiClient.post('/api/orders/create', orderData);
        console.log("COD order response:", response.data);
        
        // Xóa giỏ hàng sau khi đặt hàng COD thành công
        await apiClient.delete(`/api/cart/clear/${user.id}`);
        alert('Đặt hàng thành công với phương thức thanh toán khi nhận hàng!');
        navigate('/order-success', { state: { orderId: response.data.id } });
      } else {
        throw new Error('Phương thức thanh toán không được hỗ trợ');
      }
    } catch (err) {
      console.error('Order placement failed:', err.response || err);
      const errorMessage = err.response?.data?.message?.includes('Invalid')
        ? 'Dữ liệu gửi sang VNPay không đúng định dạng. Vui lòng thử lại.'
        : err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại sau.';
      setError(errorMessage);
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
    { id: 'vnpay', label: 'Cổng thanh toán VNPAY', desc: 'Hỗ trợ Thẻ ATM, Visa, QR Pay', icon: <CreditCard className="w-5 h-5" />, color: 'bg-cyan-100 text-cyan-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại (VD: 0123456789)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập email (không bắt buộc)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    placeholder="VD: TP. Hồ Chí Minh"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện *</label>
                  <input
                    type="text"
                    name="district"
                    value={shippingInfo.district}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    placeholder="VD: Quận 1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ chi tiết *</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Số nhà, tên đường, phường/xã"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                  <textarea
                    name="note"
                    value={shippingInfo.note}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ghi chú cho người giao hàng (không bắt buộc)"
                    rows="3"
                  ></textarea>
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
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`${option.color} p-2 rounded-full`}>{option.icon}</div>
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
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Đơn hàng của bạn</h3>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{item.product.name}</h4>
                        <p className="text-gray-500 text-xs">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Giỏ hàng của bạn đang trống.</p>
                )}
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