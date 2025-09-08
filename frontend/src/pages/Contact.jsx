import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Star, Heart, Sparkles } from 'lucide-react';
import background from "../assets/backgroundcontact.jpg";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
const handleSubmit = (e) => {
  e.preventDefault();

  // Gửi sự kiện về GA4
  if (window.gtag) {
    window.gtag("event", "contact_form_submit", {
      event_category: "engagement",
      event_label: "Liên hệ thành công",
      value: 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });
  }

  setIsSubmitted(true);

  setTimeout(() => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  }, 3000);
};


  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Header with decorative elements */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute top-8 left-8 animate-pulse">
          <Sparkles className="w-5 h-5 text-rose-400" />
        </div>
        <div className="absolute top-16 right-16 animate-bounce">
          <Heart className="w-4 h-4 text-rose-400" />
        </div>
        <div className="absolute bottom-8 left-1/4 animate-pulse">
          <Star className="w-3 h-3 text-yellow-400" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto leading-relaxed">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin để được tư vấn các sản phẩm mỹ phẩm tốt nhất!
            </p>
            <div className="w-20 h-1 bg-rose-400 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-rose-400 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  Thông Tin Liên Hệ
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-black/20 hover:bg-black/30 transition-all duration-300">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-1">Hotline</h3>
                      <p className="text-gray-200 text-sm">1900 1234 (miễn phí)</p>
                      <p className="text-gray-200 text-sm">0123 456 789</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-black/20 hover:bg-black/30 transition-all duration-300">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-1">Email</h3>
                      <p className="text-gray-200 text-sm">info@mypham.com</p>
                      <p className="text-gray-200 text-sm">support@mypham.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-black/20 hover:bg-black/30 transition-all duration-300">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-1">Địa Chỉ</h3>
                      <p className="text-gray-200 text-sm">123 Đường ABC, Quận 1</p>
                      <p className="text-gray-200 text-sm">TP. Hồ Chí Minh, Việt Nam</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-black/20 hover:bg-black/30 transition-all duration-300">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-1">Giờ Làm Việc</h3>
                      <p className="text-gray-200 text-sm">T2 - T6: 8:00 - 18:00</p>
                      <p className="text-gray-200 text-sm">T7 - CN: 9:00 - 17:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Theo Dõi Chúng Tôi</h3>
                <div className="flex gap-3">
                  {['Facebook', 'Instagram', 'TikTok', 'YouTube'].map((platform, index) => (
                    <button
                      key={platform}
                      className="w-10 h-10 bg-rose-400 rounded-full flex items-center justify-center text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
                      style={{
                        backgroundColor: index === 0 ? '#3b82f6' :
                                       index === 1 ? '#ec4899' :
                                       index === 2 ? '#000000' :
                                       '#ef4444'
                      }}
                    >
                      {platform[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-rose-400 rounded-full flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </div>
                Gửi Tin Nhắn
              </h2>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Cảm ơn bạn!</h3>
                  <p className="text-gray-600 text-sm">Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-sm">Họ & Tên *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition-all duration-300 bg-white/80 text-sm"
                        placeholder="Nhập họ và tên của bạn"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-sm">Số Điện Thoại *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition-all duration-300 bg-white/80 text-sm"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 text-sm">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition-all duration-300 bg-white/80 text-sm"
                      placeholder="Nhập địa chỉ email"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 text-sm">Chủ Đề</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition-all duration-300 bg-white/80 text-sm"
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="tư vấn">Tư vấn sản phẩm</option>
                      <option value="khiếu nại">Khiếu nại</option>
                      <option value="đại lý">Đăng ký đại lý</option>
                      <option value="khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 text-sm">Tin Nhắn *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition-all duration-300 bg-white/80 resize-none text-sm"
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-rose-400 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-500 transform hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    Gửi Tin Nhắn
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}