
import React, { useState } from 'react';
import { Key, Save, AlertCircle, X } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  canClose: boolean;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, canClose }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  
  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      onSave();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
        <div className="bg-emerald-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-white/20 p-2 rounded-xl">
              <Key size={24} />
            </div>
            <h2 className="text-xl font-bold">إعدادات مفتاح API</h2>
          </div>
          {canClose && (
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X size={24} />
            </button>
          )}
        </div>
        
        <div className="p-8 space-y-6">
          <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 text-blue-800 text-sm leading-relaxed border border-blue-100">
            <AlertCircle size={20} className="shrink-0 mt-1" />
            <p>
              لتشغيل الميزات الذكية (الاختبارات والمساعد)، تحتاج إلى مفتاح 
              <strong> Google Gemini API Key</strong>. 
              يتم حفظ المفتاح في متصفحك فقط ولا يتم إرساله لأي خادم آخر.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">أدخل المفتاح هنا (API Key)</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 outline-none transition-all font-mono text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              يمكنك الحصول على مفتاح مجاني من <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-emerald-600 underline hover:text-emerald-800">Google AI Studio</a>.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            حفظ ومتابعة
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
