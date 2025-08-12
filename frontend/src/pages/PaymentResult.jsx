import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentResult = () => {
  const [result, setResult] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const message = params.get('message');
    const orderId = params.get('orderId');
    const transactionNo = params.get('transactionNo');
    const amount = params.get('amount');

    if (status && message) {
      setResult({ status, message, orderId, transactionNo, amount });
    } else {
      setResult({
        status: 'error',
        message: 'Không tìm thấy thông tin thanh toán',
      });
    }
  }, [location]);

  if (!result) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <p className="text-gray-500 text-center">Đang tải kết quả...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        Kết quả thanh toán
      </h2>
      <div className="space-y-4">
        <p
          className={`text-lg font-semibold ${
            result.status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          Trạng thái: {result.status === 'success' ? 'Thành công' : 'Thất bại'}
        </p>
        <p className="text-gray-700">Thông báo: {result.message}</p>
        {result.orderId && (
          <p className="text-gray-700">Mã đơn hàng: {result.orderId}</p>
        )}
        {result.transactionNo && (
          <p className="text-gray-700">
            Mã giao dịch: {result.transactionNo}
          </p>
        )}
        {result.amount && (
          <p className="text-gray-700">
            Số tiền: {Number(result.amount) / 100} VND
          </p>
        )}
        <a
          href="/"
          className="block w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 mt-4"
        >
          Quay lại
        </a>
      </div>
    </div>
  );
};

export default PaymentResult;