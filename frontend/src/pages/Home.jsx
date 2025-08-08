import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[600px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>

        {/* Text Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
            Khám Phá Vẻ Đẹp Tự Nhiên
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-6 max-w-2xl mx-auto drop-shadow-md">
            Nâng niu làn da của bạn với các sản phẩm mỹ phẩm cao cấp, an toàn và thân thiện với môi trường.
          </p>
          <Link
            to="/products"
            className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Mua Sắm Ngay
          </Link>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Vì Sao Chọn Chúng Tôi?</h2>
          <p className="text-gray-600 mt-2">
            Sản phẩm chất lượng cao, nguồn gốc tự nhiên, mang lại vẻ đẹp bền vững.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Thành Phần Tự Nhiên</h3>
            <p className="text-gray-600">100% chiết xuất từ thiên nhiên, không chứa hóa chất độc hại.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Thân Thiện Môi Trường</h3>
            <p className="text-gray-600">Bao bì tái chế, sản xuất bền vững vì một hành tinh xanh.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Phù Hợp Mọi Loại Da</h3>
            <p className="text-gray-600">Công thức dịu nhẹ, an toàn cho cả làn da nhạy cảm nhất.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
