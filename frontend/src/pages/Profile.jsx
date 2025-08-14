import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Phone, Mail, MapPin, Package, 
  Clock, CheckCircle, XCircle, Truck, Eye, 
  CreditCard, Calendar, Loader2, RefreshCw,
  ShoppingBag, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Hàm format giá tiền
const formatCurrency = (value) => {
  if (!value && value !== 0) return '';
  return Number(value).toLocaleString('vi-VN') + ' VNĐ';
};

// Hàm format ngày tháng
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  useEffect(() => {
    if (!user || !user.id) {
      navigate('/login');
      return;
    }
    fetchUserData();
    fetchOrders();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      const apiClient = axios.create({
        baseURL: 'https://deploy-backend-production-e64e.up.railway.app',
        timeout: 10000,
      });
      const response = await apiClient.get(`/api/users/${user.id}`);
      setUserInfo(response.data);
    } catch (err) {
      console.error('Fetch user data failed:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const apiClient = axios.create({
        baseURL: 'https://deploy-backend-production-e64e.up.railway.app',
        timeout: 10000,
      });
      const response = await apiClient.get(`/api/orders/user/${user.id}`);
      setOrders(response.data);
    } catch (err) {
      const status = err.response?.status;
      let message = err.response?.data?.message || 'Không thể tải danh sách đơn hàng';
      if (status === 401) {
        message = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
        logout();
        navigate('/login');
      }
      setError(message);
      setToast({ show: true, message, type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'PENDING': { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
      'PAID': { label: 'Đã thanh toán', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
      'FAILED': { label: 'Thất bại', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
      'SHIPPED': { label: 'Đang giao', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Truck },
      'DELIVERED': { label: 'Đã giao', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      'CANCELLED': { label: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    };
    return statusMap[status] || statusMap['PENDING'];
  };

  const getPaymentMethodLabel = (method) => {
    const methodMap = {
      'CASH_ON_DELIVERY': 'Thanh toán khi nhận hàng',
      'VNPAY': 'VNPay',
      'MOMO': 'Ví MoMo',
      'OTHER': 'Khác'
    };
    return methodMap[method] || method;
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.status === 'PENDING';
    if (activeTab === 'paid') return order.status === 'PAID';
    if (activeTab === 'failed') return order.status === 'FAILED';
    if (activeTab === 'shipped') return order.status === 'SHIPPED';
    if (activeTab === 'delivered') return order.status === 'DELIVERED';
    if (activeTab === 'cancelled') return order.status === 'CANCELLED';
    return true;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    paid: orders.filter(o => o.status === 'PAID').length,
    failed: orders.filter(o => o.status === 'FAILED').length,
    shipped: orders.filter(o => o.status === 'SHIPPED').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length,
  };

  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng #{order.id}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Thông tin đơn hàng */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đặt</label>
                <p className="text-gray-900">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <div className="flex items-center gap-2">
                  {React.createElement(getStatusInfo(order.status).icon, { className: "w-4 h-4" })}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusInfo(order.status).color}`}>
                    {getStatusInfo(order.status).label}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức thanh toán</label>
                <p className="text-gray-900">{getPaymentMethodLabel(order.paymentMethod)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tổng tiền</label>
                <p className="text-lg font-bold text-[#483C54]">{formatCurrency(order.totalAmount)}</p>
              </div>
            </div>

            {/* Địa chỉ giao hàng */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</label>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <p className="text-gray-900">{order.shippingAddress || 'Không có thông tin'}</p>
                </div>
              </div>
            </div>

            {/* Ghi chú */}
            {order.note && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-900">{order.note}</p>
                </div>
              </div>
            )}

            {/* Sản phẩm trong đơn hàng */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Sản phẩm đã đặt</label>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.productName || `Sản phẩm ${index + 1}`}</h4>
                      <p className="text-sm text-gray-500">Số lượng: {item.quantity || 1}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(item.price || 0)}</p>
                      <p className="text-sm text-gray-500">
                        Thành tiền: {formatCurrency((item.price || 0) * (item.quantity || 1))}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-4">Không có thông tin sản phẩm</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trang cá nhân</h1>
            <p className="text-gray-600">Quản lý thông tin và đơn hàng của bạn</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="bg-[#483C54] p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{userInfo?.full_name || user?.full_name || 'Người dùng'}</h2>
                <p className="text-gray-500">{userInfo?.email || user?.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{userInfo?.phone || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{userInfo?.address || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{userInfo?.email || user?.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Tham gia: {userInfo?.createdAt ? formatDate(userInfo.createdAt) : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#483C54]">{orderStats.total}</div>
                    <div className="text-xs text-gray-500">Tổng đơn hàng</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{orderStats.delivered}</div>
                    <div className="text-xs text-gray-500">Đã hoàn thành</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Right Column - Orders */}
          <div className="lg:col-span-3">
            {/* Order Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <div 
                onClick={() => setActiveTab('all')}
                className={`bg-white rounded-xl p-4 cursor-pointer transition-all ${activeTab === 'all' ? 'ring-2 ring-[#483C54] bg-[#483C54] text-white' : 'hover:shadow-md'}`}
              >
                <div className="text-center">
                  <ShoppingBag className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-lg font-bold">{orderStats.total}</div>
                  <div className="text-xs opacity-70">Tất cả</div>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('pending')}
                className={`bg-white rounded-xl p-4 cursor-pointer transition-all ${activeTab === 'pending' ? 'ring-2 ring-yellow-500 bg-yellow-50' : 'hover:shadow-md'}`}
              >
                <div className="text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                  <div className="text-lg font-bold text-yellow-600">{orderStats.pending}</div>
                  <div className="text-xs text-yellow-600">Chờ xử lý</div>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('paid')}
                className={`bg-white rounded-xl p-4 cursor-pointer transition-all ${activeTab === 'paid' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
              >
                <div className="text-center">
                  <CreditCard className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-lg font-bold text-blue-600">{orderStats.paid}</div>
                  <div className="text-xs text-blue-600">Đã thanh toán</div>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('shipped')}
                className={`bg-white rounded-xl p-4 cursor-pointer transition-all ${activeTab === 'shipped' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'}`}
              >
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-lg font-bold text-purple-600">{orderStats.shipped}</div>
                  <div className="text-xs text-purple-600">Đang giao</div>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('delivered')}
                className={`bg-white rounded-xl p-4 cursor-pointer transition-all ${activeTab === 'delivered' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'}`}
              >
                <div className="text-center">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <div className="text-lg font-bold text-green-600">{orderStats.delivered}</div>
                  <div className="text-xs text-green-600">Đã giao</div>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('cancelled')}
                className={`bg-white rounded-xl p-4 cursor-pointer transition-all ${activeTab === 'cancelled' ? 'ring-2 ring-red-500 bg-red-50' : 'hover:shadow-md'}`}
              >
                <div className="text-center">
                  <XCircle className="w-6 h-6 mx-auto mb-2 text-red-600" />
                  <div className="text-lg font-bold text-red-600">{orderStats.cancelled + orderStats.failed}</div>
                  <div className="text-xs text-red-600">Đã hủy/Thất bại</div>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    Danh sách đơn hàng 
                    {activeTab !== 'all' && (
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        ({getStatusInfo(activeTab.toUpperCase()).label})
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Làm mới
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#483C54]" />
                    <span className="ml-2 text-gray-600">Đang tải...</span>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      {activeTab === 'all' ? 'Bạn chưa có đơn hàng nào' : `Không có đơn hàng ${getStatusInfo(activeTab.toUpperCase()).label.toLowerCase()}`}
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    return (
                      <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">Đơn hàng #{order.id}</h4>
                            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {React.createElement(statusInfo.icon, { className: "w-4 h-4" })}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Phương thức thanh toán</p>
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{getPaymentMethodLabel(order.paymentMethod)}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Địa chỉ giao hàng</p>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700 truncate">{order.shippingAddress || 'Không có thông tin'}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Tổng tiền</p>
                            <p className="text-lg font-bold text-[#483C54]">{formatCurrency(order.totalAmount)}</p>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#483C54] hover:bg-[#5a4d68] text-white rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
};

export default Profile;