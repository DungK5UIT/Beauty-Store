import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Heart } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BeautyChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: '✨ Xin chào beauty! Tôi là **Beauty Assistant**, sẵn sàng tư vấn mỹ phẩm cho bạn! 💄' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Khởi tạo Google Generative AI với API key
  const genAI = new GoogleGenerativeAI('AIzaSyBEpKZP9ka9I3IrKzX8ZqOA-Pr_CNjyOE0');

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const beautyContext = `Bạn là chuyên gia tư vấn mỹ phẩm và làm đẹp chuyên nghiệp. 
      Trả lời thân thiện, chuyên môn và hữu ích. 
      Sử dụng emoji và Markdown để trình bày rõ ràng: ${input}`;

      const result = await model.generateContent(beautyContext);

      const botMessage = {
        role: 'bot',
        content: result.response.text() || 'Xin lỗi, tôi không thể trả lời câu hỏi này. 💕',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Lỗi API:', error);
      setMessages(prev => [
        ...prev,
        { role: 'bot', content: `❌ Lỗi: ${error.message}. Hãy thử lại sau nhé! 😊` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[500px] rounded-3xl shadow-2xl border border-[#483C54]/20 overflow-hidden"
             style={{background: 'linear-gradient(135deg, #EEF4D5 0%, #F8FBE8 100%)'}}>
          
          {/* Header */}
          <div className="text-white p-6 relative"
               style={{background: 'linear-gradient(135deg, #483C54 0%, #5D4E6B 100%)'}}>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                     style={{background: 'linear-gradient(45deg, #EEF4D5, #F8FBE8)'}}>
                  <Heart className="w-6 h-6 text-[#483C54]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Beauty Assistant</h3>
                  <p className="text-sm opacity-90 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Powered by Gemini AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-4 rounded-2xl shadow-sm relative ${
                    msg.role === 'user'
                      ? 'text-white rounded-br-md'
                      : 'text-[#483C54] rounded-bl-md border border-[#483C54]/10'
                  }`}
                  style={{
                    background: msg.role === 'user' 
                      ? 'linear-gradient(135deg, #483C54 0%, #5D4E6B 100%)'
                      : '#FFFFFF'
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="text-sm leading-relaxed prose prose-sm max-w-none"
                  >
                    {msg.content}
                  </ReactMarkdown>

                  {msg.role === 'user' && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#483C54] transform rotate-45"></div>
                  )}
                  {msg.role === 'bot' && (
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-l border-b border-[#483C54]/10 transform rotate-45"></div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md p-4 border border-[#483C54]/10 shadow-sm relative">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#483C54'}}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#483C54', animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#483C54', animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-xs text-[#483C54]/70">AI đang suy nghĩ...</span>
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-l border-b border-[#483C54]/10 transform rotate-45"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-[#483C54]/10">
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Hỏi tôi về skincare, makeup, làm đẹp..."
                className="flex-1 p-4 border-2 border-[#483C54]/20 rounded-2xl focus:outline-none focus:border-[#483C54] text-sm transition-all duration-300"
                style={{backgroundColor: '#EEF4D5'}}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="p-4 text-white rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg"
                style={{
                  background: isLoading || !input.trim() 
                    ? '#9CA3AF' 
                    : 'linear-gradient(135deg, #483C54 0%, #5D4E6B 100%)'
                }}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 relative overflow-hidden ${
          isOpen ? 'bg-gray-500 hover:bg-gray-600' : ''
        }`}
        style={{
          background: isOpen 
            ? undefined
            : 'linear-gradient(135deg, #483C54 0%, #5D4E6B 100%)'
        }}
      >
        {!isOpen && (
          <>
            <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#EEF4D5] rounded-full animate-pulse"></div>
          </>
        )}
        
        {isOpen ? (
          <X className="w-6 h-6 relative z-10" />
        ) : (
          <div className="relative z-10 flex items-center justify-center">
            <Heart className="w-6 h-6" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 animate-pulse" />
          </div>
        )}
      </button>

      {/* Notification Badge */}
      {!isOpen && messages.length > 1 && (
        <div className="absolute -top-2 -left-2 w-6 h-6 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce shadow-lg"
             style={{background: 'linear-gradient(135deg, #FF6B9D, #FF8E9B)'}}>
          {messages.filter(m => m.role === 'bot').length - 1}
        </div>
      )}
    </div>
  );
}
