import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [orderInfo, setOrderInfo] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!orderId || !amount || !orderInfo) {
      setError('Vui lòng điền đầy đủ các trường');
      setIsLoading(false);
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      setError('Số tiền phải là số dương');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/pay/vnpay/initiate',
        {
          orderId,
          amount,
          orderInfo,
          ipAddr: '127.0.0.1', // Giả định localhost, thực tế lấy từ client
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // Nếu cần JWT, thêm: 'Authorization': 'Bearer your-token-here'
          },
        }
      );

      const data = response.data;
      if (response.status === 200 && data.paymentUrl) {
        window.location.href = data.paymentUrl; // Chuyển hướng đến VNPay
      } else {
        setError(data.message || 'Không thể khởi tạo thanh toán');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi hệ thống, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Thanh toán VNPay</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mã đơn hàng</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Nhập mã đơn hàng"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Số tiền (VND)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Nhập số tiền"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Thông tin đơn hàng</label>
          <input
            type="text"
            value={orderInfo}
            onChange={(e) => setOrderInfo(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Nhập thông tin đơn hàng"
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Đang xử lý...' : 'Thanh toán'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;