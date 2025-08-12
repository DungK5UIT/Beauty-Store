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

      if (Object.keys(queryParams).length === 0) {
        setStatus('error');
        setMessage('Không nhận được thông tin thanh toán từ VNPay. Vui lòng thử thanh toán lại.');
        console.warn('Empty query params in PaymentCallback');
        return;
      }

      // Log query params để debug
      console.log('VNPay callback query params:', queryParams);

      try {
        const apiClient = axios.create({
          baseURL: 'https://deploy-backend-production-e64e.up.railway.app',
          timeout: 10000, // Timeout 10s
        });

        // Gửi GET đến backend callback
        const response = await apiClient.get('/api/pay/vnpay/callback', { params: queryParams });
        console.log('Backend callback response:', response.data);

        if (response.data.status === 'SUCCESS') {
          setStatus('success');
          setMessage('Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.');
          setTimeout(() => navigate('/order-success'), 3000);
        } else {
          setStatus('error');
          const responseCode = queryParams.vnp_ResponseCode;
          switch (responseCode) {
            case '03':
              setMessage('Dữ liệu gửi sang VNPay không đúng định dạng (mã lỗi 03). Vui lòng kiểm tra giỏ hàng và thử lại.');
              break;
            case '01':
              setMessage('Giao dịch đã tồn tại. Vui lòng kiểm tra lịch sử đơn hàng.');
              break;
            case '02':
              setMessage('Thông tin merchant không hợp lệ. Vui lòng liên hệ hỗ trợ.');
              break;
            case '04':
              setMessage('Website đang bị tạm khóa. Vui lòng thử lại sau.');
              break;
            case '07':
              setMessage('Giao dịch bị nghi ngờ gian lận. Vui lòng liên hệ hỗ trợ.');
              break;
            case '08':
              setMessage('Hệ thống ngân hàng đang bảo trì. Vui lòng thử lại sau.');
              break;
            case '24':
              setMessage('Giao dịch đã bị hủy hoặc quá thời gian chờ thanh toán. Vui lòng thử lại.');
              break;
            case '79':
              setMessage('Xác thực sai quá số lần cho phép. Vui lòng kiểm tra thông tin thanh toán.');
              break;
            case '97':
              setMessage('Chữ ký không hợp lệ. Vui lòng liên hệ hỗ trợ.');
              break;
            case '99':
              setMessage('Lỗi hệ thống VNPay. Vui lòng thử lại sau.');
              break;
            default:
              setMessage(response.data.message || 'Giao dịch đã quá thời gian chờ thanh toán hoặc bị hủy. Vui lòng thử lại.');
          }
        }
      } catch (err) {
        console.error('Callback processing failed:', {
          error: err.message,
          response: err.response?.data,
          queryParams,
        });
        setStatus('error');
        setMessage(err.response?.data?.message || 'Giao dịch đã quá thời gian chờ thanh toán. Vui lòng thử lại.');
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