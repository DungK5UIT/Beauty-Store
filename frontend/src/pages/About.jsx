import React from 'react';
import { Link } from 'react-router-dom';
import about from '../assets/about.jpg'
import ceo from '../assets/ceo.jpg'
const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
     <div className="relative h-[50vh] w-full">
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: `url(${about})`,
      filter: 'blur(2px)', // Thêm hiệu ứng làm mờ nhẹ
    }}
  ></div>
  <div className="absolute inset-0  bg-opacity-30"></div> {/* Lớp phủ bán trong suốt */}
  <div className="relative z-10 flex flex-col items-center justify-center h-full text-[#F5F5DC] px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg text-center">
      Câu Chuyện Của Chúng Tôi
    </h1>
    <p className="text-lg sm:text-xl lg:text-2xl mb-6 max-w-2.1xl text-center drop-shadow-md">
      Hành trình mang đến vẻ đẹp tự nhiên và an toàn cho mọi người
    </p>
  </div>
</div>

      {/* Banner Section */}
      <div className="bg-[#EEF4D5] flex items-center justify-between px-20 h-[10vh] w-full text-lg font-semibold text-gray-700 tracking-wider">
        <span>✦ THÀNH LẬP NĂM 2020</span>
        <span>✦ HƠN 50.000 KHÁCH HÀNG TIN TƯỞNG</span>
        <span>✦ 100+ SẢN PHẨM CHẤT LƯỢNG</span>
        <span>✦ GIAO HÀNG TOÀN QUỐC</span>
      </div>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Khởi Nguồn Từ Tình Yêu Làm Đẹp
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                Được thành lập vào năm 2020 với sứ mệnh mang đến những sản phẩm mỹ phẩm 
                an toàn và hiệu quả, chúng tôi bắt đầu hành trình từ một cửa hàng nhỏ với 
                niềm đam mê về vẻ đẹp tự nhiên.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                Chúng tôi tin rằng mỗi người đều xứng đáng có được những sản phẩm chăm sóc 
                da tốt nhất, được làm từ những nguyên liệu thiên nhiên và công nghệ tiên tiến.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Từ những ngày đầu khiêm tốn, chúng tôi đã không ngừng phát triển và hiện 
                tại phục vụ hàng chục nghìn khách hàng trên toàn quốc.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087"
                alt="Câu chuyện thương hiệu"
                className="rounded-lg shadow-lg w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Những nguyên tắc định hướng mọi quyết định và hành động của chúng tôi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-emerald-600">🌿</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Tự Nhiên
              </h3>
              <p className="text-gray-600">
                Sử dụng nguyên liệu thiên nhiên, an toàn và lành tính cho mọi loại da
              </p>
            </div>

            <div className="text-center bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-blue-600">🔬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Khoa Học
              </h3>
              <p className="text-gray-600">
                Nghiên cứu và phát triển dựa trên nền tảng khoa học hiện đại
              </p>
            </div>

            <div className="text-center bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-purple-600">💎</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Chất Lượng
              </h3>
              <p className="text-gray-600">
                Cam kết mang đến sản phẩm chất lượng cao với tiêu chuẩn quốc tế
              </p>
            </div>

            <div className="text-center bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-pink-600">💚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Bền Vững
              </h3>
              <p className="text-gray-600">
                Bảo vệ môi trường với bao bì thân thiện và quy trình sản xuất xanh
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Vision Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-lg">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-white text-xl font-bold">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Sứ Mệnh</h3>
              <p className="text-gray-700 leading-relaxed">
                Mang đến cho mọi người những sản phẩm mỹ phẩm an toàn, hiệu quả và 
                thân thiện với môi trường. Chúng tôi cam kết giúp khách hàng tự tin 
                thể hiện vẻ đẹp tự nhiên của mình thông qua những sản phẩm chất lượng cao.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-white text-xl font-bold">👁️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Tầm Nhìn</h3>
              <p className="text-gray-700 leading-relaxed">
                Trở thành thương hiệu mỹ phẩm hàng đầu Việt Nam, được tin tưởng và 
                yêu thích bởi khách hàng. Chúng tôi hướng tới việc mở rộng ra thị 
                trường quốc tế và góp phần nâng cao tiêu chuẩn làm đẹp bền vững.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Đội Ngũ Của Chúng Tôi
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Những con người tận tâm đang làm việc không ngừng nghỉ để mang đến 
              trải nghiệm tốt nhất cho khách hàng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
              <img
                src={ceo}
                alt="CEO"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Nguyễn Hữu Dũng
              </h4>
              <p className="text-emerald-600 font-medium mb-3">CEO & Founder</p>
              <p className="text-gray-600 text-sm">
                Với hơn 10 năm kinh nghiệm trong ngành mỹ phẩm, chị Minh là người 
                đặt nền móng cho tầm nhìn và sứ mệnh của công ty.
              </p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
              <img
                src={ceo}
                alt="CTO"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Nguyễn Hữu Dũng
              </h4>
              <p className="text-blue-600 font-medium mb-3">Giám đốc R&D</p>
              <p className="text-gray-600 text-sm">
                Chuyên gia nghiên cứu và phát triển sản phẩm, đảm bảo mọi công 
                thức đều đạt tiêu chuẩn cao nhất về chất lượng và an toàn.
              </p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
              <img
                src={ceo}
                alt="Marketing Director"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Nguyễn Hữu Dũng
              </h4>
              <p className="text-purple-600 font-medium mb-3">Giám đốc Marketing</p>
              <p className="text-gray-600 text-sm">
                Người kết nối thương hiệu với khách hàng, tạo ra những chiến dịch 
                ý nghĩa và truyền cảm hứng về vẻ đẹp tự nhiên.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 relative text-white"
        style={{ background: '#3c3c5a' }}
      >
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-light mb-6">
            Cùng Chúng Tôi Tạo Nên Vẻ Đẹp
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Hãy trở thành một phần trong hành trình mang vẻ đẹp tự nhiên 
            đến với mọi người. Khám phá bộ sưu tập sản phẩm của chúng tôi ngay hôm nay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catagory"
              className="bg-white text-purple-800 px-8 py-4 rounded-full font-semibold uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-gray-100"
              style={{ color: '#2d2d4a' }}
            >
              Khám Phá Sản Phẩm
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold uppercase tracking-wide transition-all duration-300 hover:bg-white hover:text-purple-800"
            >
              Liên Hệ Với Chúng Tôi
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">50K+</div>
              <p className="text-gray-600">Khách hàng hài lòng</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
              <p className="text-gray-600">Sản phẩm chất lượng</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
              <p className="text-gray-600">Năm kinh nghiệm</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">34</div>
              <p className="text-gray-600">Tỉnh thành phục vụ</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;