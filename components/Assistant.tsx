
import React, { useState, useRef, useEffect } from 'react';
import { Send, BrainCircuit, Bot, User, Loader2 } from 'lucide-react';
import { getChemistryExplanation } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'مرحباً بك! أنا مساعدك الذكي في الكيمياء. كيف يمكنني مساعدتك في فهم ثابت الاتزان Kc أو الأس الهيدروجيني pH اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await getChemistryExplanation(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'عذراً، حدث خطأ أثناء الاتصال بالخادم.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl flex flex-col h-[70vh] overflow-hidden border border-gray-100">
      <div className="bg-emerald-600 p-6 text-white flex items-center gap-4">
        <div className="bg-white/20 p-2 rounded-xl">
          <BrainCircuit size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold">المساعد الكيميائي الذكي</h2>
          <p className="text-emerald-100 text-xs">اسأل عن أي مفهوم أو مسألة</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={`p-4 rounded-3xl max-w-[80%] text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Loader2 size={20} className="animate-spin" />
            </div>
            <div className="bg-gray-50 p-4 rounded-3xl rounded-tl-none border border-gray-100 text-gray-400 italic text-sm">
              جاري التفكير...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 border-t flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="مثلاً: اشرح لي تأثير درجة الحرارة على Kc..."
          className="flex-1 p-4 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none transition-all text-sm"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="w-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 transition-all disabled:opacity-50"
        >
          <Send size={20} className="rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default Assistant;
