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
      // Lấy query params từ URL
      const params = new URLSearchParams(location.search);
      const queryParams = {};
      params.forEach((value, key) => {
        queryParams[key] = value;
      });

      // Validate các tham số cần thiết
      if (!queryParams.vnp_TxnRef || !queryParams.vnp_ResponseCode || !queryParams.vnp_SecureHash) {
        setStatus('error');
        setMessage('Thiếu thông tin thanh toán từ VNPay. Vui lòng thử thanh toán lại.');
        console.warn('Missing required VNPay params:', queryParams);
        return;
      }

      // Log query params để debug
      console.log('VNPay callback query params:', queryParams);

      try {
        const apiClient = axios.create({
          baseURL: 'https://deploy-backend-production-e64e.up.railway.app',
          timeout: 10000,
        });

        // Gửi GET đến backend callback
        const response = await apiClient.get('/api/pay/vnpay/callback', { params: queryParams });
        console.log('Backend callback response:', response.data);

        if (response.data.status === 'SUCCESS') {
          setStatus('success');
          setMessage('Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.');
        } else {
          setStatus('error');
          const responseCode = queryParams.vnp_ResponseCode;
          const errorMessages = {
            '00': 'Thanh toán thành công!',
            '01': 'Giao dịch đã tồn tại. Vui lòng kiểm tra lịch sử đơn hàng.',
            '02': 'Thông tin merchant không hợp lệ. Vui lòng liên hệ hỗ trợ.',
            '03': 'Dữ liệu gửi sang VNPay không đúng định dạng. Vui lòng kiểm tra giỏ hàng và thử lại.',
            '04': 'Website đang bị tạm khóa. Vui lòng thử lại sau.',
            '07': 'Giao dịch bị nghi ngờ gian lận. Vui lòng liên hệ hỗ trợ.',
            '08': 'Hệ thống ngân hàng đang bảo trì. Vui lòng thử lại sau.',
            '24': 'Giao dịch đã bị hủy hoặc quá thời gian chờ thanh toán. Vui lòng thử lại.',
            '79': 'Xác thực sai quá số lần cho phép. Vui lòng kiểm tra thông tin thanh toán.',
            '97': 'Chữ ký không hợp lệ. Vui lòng liên hệ hỗ trợ.',
            '99': 'Lỗi hệ thống VNPay. Vui lòng thử lại sau.',
          };
          setMessage(errorMessages[responseCode] || response.data.message || 'Giao dịch thất bại. Vui lòng thử lại.');
        }
      } catch (err) {
        console.error('Callback processing failed:', {
          error: err.message,
          response: err.response?.data,
          queryParams,
        });
        setStatus('error');
        setMessage(err.response?.data?.message || 'Lỗi hệ thống khi xử lý thanh toán. Vui lòng thử lại.');
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
            <p className="text-gray-600">Cảm ơn bạn đã mua sắm!</p>
            <button
              onClick={() => navigate('/order-success')}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Xem đơn hàng
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">{message}</h2>
            <p className="text-gray-600">Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ.</p>
            <button
              onClick={() => navigate('/pay')}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
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