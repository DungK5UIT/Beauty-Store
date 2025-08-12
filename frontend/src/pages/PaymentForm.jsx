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

    // Validate dữ liệu
    if (!orderId || !amount || !orderInfo) {
      setError('Vui lòng điền đầy đủ thông tin.');
      setIsLoading(false);
      return;
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Số tiền phải là số dương.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://deploy-backend-production-e64e.up.railway.app/api/pay/vnpay/initiate',
        {
          orderId,
          amount: numericAmount, // đảm bảo là số
          orderInfo
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data;
      console.log('VNPay response:', data);

      if (response.status === 200 && data.paymentUrl) {
        window.location.href = data.paymentUrl; // Chuyển hướng đến VNPay
      } else {
        setError(data.message || 'Không thể khởi tạo thanh toán.');
      }
    } catch (err) {
      console.error('Thanh toán lỗi:', err);
      setError(err.response?.data?.message || 'Lỗi hệ thống, vui lòng thử lại.');
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
            className="mt-1 p-2 w-full border rounded-md"
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
            className="mt-1 p-2 w-full border rounded-md"
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
            className="mt-1 p-2 w-full border rounded-md"
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
