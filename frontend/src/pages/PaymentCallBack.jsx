import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const PaymentCallback = () => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processCallback = async () => {
      // Lấy query params từ URL (từ VNPay redirect về)
      const params = new URLSearchParams(location.search);
      const queryParams = {};
      params.forEach((value, key) => {
        queryParams[key] = value;
      });

      if (Object.keys(queryParams).length === 0) {
        setStatus('error');
        setMessage('Không có thông tin thanh toán.');
        return;
      }

      try {
        const apiClient = axios.create({
          baseURL: 'https://deploy-backend-production-e64e.up.railway.app'
        });

        // Gửi GET đến backend callback với params
        const response = await apiClient.get('/api/pay/vnpay/callback', { params: queryParams });

        if (response.data.status === 'SUCCESS') {
          setStatus('success');
          setMessage('Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.');
          // Cập nhật trạng thái order ở backend đã làm, frontend chỉ hiển thị
          setTimeout(() => navigate('/order-success'), 3000); // Chuyển đến trang thành công sau 3s
        } else {
          setStatus('error');
          setMessage('Thanh toán thất bại. Vui lòng thử lại.');
        }
      } catch (err) {
        console.error('Callback processing failed:', err);
        setStatus('error');
        setMessage(err.response?.data?.message || 'Lỗi khi xử lý kết quả thanh toán.');
      }
    };

    processCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">{message}</h2>
            <p className="text-gray-600">Vui lòng chờ trong giây lát.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">{message}</h2>
            <p className="text-gray-600">Bạn sẽ được chuyển hướng đến trang đơn hàng.</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">{message}</h2>
            <p className="text-gray-600">Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ.</p>
            <button
              onClick={() => navigate('/pay')}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              Thử lại
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;