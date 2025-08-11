import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Phone, Mail, CreditCard,
  Truck, Check, QrCode, Shield, User, Banknote, Loader2
} from 'lucide-react';
import axios from 'axios';

// Hàm format giá tiền
const formatCurrency = (value) => {
  if (!value) return '';
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
    district: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showMomoQR, setShowMomoQR] = useState(false);
  const [error, setError] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchCart = async () => {
      if (!user || !user.id) {
        setError('Vui lòng đăng nhập để thanh toán');
        navigate('/login', { state: { from: '/pay' } });
        return;
      }

      try {
        const response = await axios.get(`https://deploy-backend-production-e64e.up.railway.app/api/cart/${user.id}`);
        setCartItems(response.data);
        
        // Pre-fill user info if available
        if (user) {
          setShippingInfo(prev => ({
            ...prev,
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || ''
          }));
        }
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
    setShowMomoQR(method === 'momo');
  };

  const validateForm = () => {
    if (!shippingInfo.fullName) {
      setError('Vui lòng nhập họ và tên');
      return false;
    }
    if (!shippingInfo.phone) {
      setError('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!/^\d{10,11}$/.test(shippingInfo.phone)) {
      setError('Số điện thoại không hợp lệ');
      return false;
    }
    if (!shippingInfo.address) {
      setError('Vui lòng nhập địa chỉ giao hàng');
      return false;
    }
    if (!shippingInfo.city) {
      setError('Vui lòng chọn thành phố');
      return false;
    }
    if (!shippingInfo.district) {
      setError('Vui lòng chọn quận/huyện');
      return false;
    }
    if (!paymentMethod) {
      setError('Vui lòng chọn phương thức thanh toán');
      return false;
    }
    return true;
  };

  const createOrder = async () => {
    try {
      const orderData = {
        userId: user.id,
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingInfo,
        paymentMethod,
        totalAmount: total
      };

      const response = await axios.post(
        'https://deploy-backend-production-e64e.up.railway.app/api/orders',
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      return response.data;
    } catch (err) {
      console.error('Error creating order:', err);
      throw err;
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessingPayment(true);
    setError('');

    try {
      const newOrder = await createOrder();
      setOrderId(newOrder.id);

      if (paymentMethod === 'vnpay') {
        // Initiate VNPay payment
        const vnpayResponse = await axios.post(
          'https://deploy-backend-production-e64e.up.railway.app/api/pay/vnpay/initiate',
          { orderId: newOrder.id },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        // Redirect to VNPay payment page
        window.location.href = vnpayResponse.data.paymentUrl;
      } else if (paymentMethod === 'momo') {
        // For demo purposes - in real app you would call Momo API
        alert('Vui lòng quét mã QR MoMo để thanh toán');
      } else {
        // COD or other methods
        navigate('/order-success', { 
          state: { 
            orderId: newOrder.id,
            paymentMethod
          } 
        });
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/cart')} 
            className="p-2 hover:bg-white rounded-full transition-colors"
            disabled={isProcessingPayment}
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
            <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

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
                    disabled={isProcessingPayment}
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
                    placeholder="Nhập số điện thoại"
                    disabled={isProcessingPayment}
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
                    placeholder="Nhập email"
                    disabled={isProcessingPayment}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ chi tiết *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Số nhà, tên đường"
                    disabled={isProcessingPayment}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố *</label>
                  <select
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    disabled={isProcessingPayment}
                  >
                    <option value="">Chọn thành phố</option>
                    <option value="hanoi">Hà Nội</option>
                    <option value="hcm">TP. Hồ Chí Minh</option>
                    <option value="danang">Đà Nẵng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện *</label>
                  <select
                    name="district"
                    value={shippingInfo.district}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    disabled={isProcessingPayment}
                  >
                    <option value="">Chọn quận/huyện</option>
                    <option value="district1">Quận 1</option>
                    <option value="district2">Quận 2</option>
                    <option value="district3">Quận 3</option>
                  </select>
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
                {['cod', 'card', 'momo', 'vnpay'].map((method) => {
                  const label =
                    method === 'cod'
                      ? 'Thanh toán khi nhận hàng (COD)'
                      : method === 'card'
                      ? 'Thẻ tín dụng/Ghi nợ'
                      : method === 'momo'
                      ? 'Ví MoMo'
                      : 'Thanh toán VNPay';
                  const desc =
                    method === 'cod'
                      ? 'Thanh toán bằng tiền mặt khi nhận hàng'
                      : method === 'card'
                      ? 'Visa, MasterCard, JCB'
                      : method === 'momo'
                      ? 'Thanh toán qua ví điện tử MoMo'
                      : 'Thanh toán qua cổng VNPay';
                  const bg =
                    method === 'cod'
                      ? 'bg-orange-100 text-orange-600'
                      : method === 'card'
                      ? 'bg-blue-100 text-blue-600'
                      : method === 'momo'
                      ? 'bg-pink-100 text-pink-600'
                      : 'bg-purple-100 text-purple-600';
                  const selected =
                    paymentMethod === method
                      ? method === 'momo'
                        ? 'border-pink-500 bg-pink-50'
                        : method === 'vnpay'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300';

                  return (
                    <div
                      key={method}
                      onClick={() => !isProcessingPayment && handlePaymentMethodChange(method)}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selected} ${
                        isProcessingPayment ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`${bg} p-2 rounded-full`}>
                            {method === 'momo' ? (
                              <div className="w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xs">M</span>
                              </div>
                            ) : method === 'card' ? (
                              <CreditCard className="w-5 h-5" />
                            ) : method === 'vnpay' ? (
                              <Banknote className="w-5 h-5" />
                            ) : (
                              <Truck className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{label}</h3>
                            <p className="text-sm text-gray-500">{desc}</p>
                          </div>
                        </div>
                        {paymentMethod === method && (
                          <div className={`rounded-full p-1 ${
                            method === 'momo' ? 'bg-pink-500' : 
                            method === 'vnpay' ? 'bg-purple-500' : 'bg-blue-500'
                          }`}>
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {showMomoQR && (
                <div className="mt-6 p-6 bg-pink-50 rounded-xl border border-pink-200">
                  <div className="text-center">
                    <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
                      <img
                        src="https://xfswcnmwovkwdwimszov.supabase.co/storage/v1/object/sign/qrmomo/QRMOMO.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMzlmZTVhZi1mMGRhLTQwM2MtYmUxMy1iMTAxNWMxY2ZmNzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJxcm1vbW8vUVJNT01PLmpwZyIsImlhdCI6MTc1NDIwNDkyNCwiZXhwIjoxNzg1NzQwOTI0fQ.Pcyi_cUgy_ExsQ-Vl0RKLTDoprdvOSeYYbCikaWCY-Q"
                        alt="QR MoMo"
                        className="w-full h-auto max-w-xs mx-auto rounded-xl"
                      />
                      <div className="text-xs text-gray-500 mt-2 pb-2">QR Code MoMo</div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Quét mã QR để thanh toán</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Số tiền: <span className="font-bold text-pink-600">{formatCurrency(total)}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Mở ứng dụng MoMo và quét mã QR để thanh toán
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

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.product.name}</h4>
                      <p className="text-gray-500 text-xs">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
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

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessingPayment}
                className={`w-full bg-[#483C54] hover:bg-[#5a4d68] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 ease-in-out ${
                  isProcessingPayment ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
                } shadow-md hover:shadow-lg flex items-center justify-center gap-2`}
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Đặt hàng ngay'
                )}
              </button>

              {/* Security Notice */}
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