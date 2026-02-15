import React, { useState } from 'react';
import Layout from './components/Layout.tsx';
import KcCalculator from './components/KcCalculator.tsx';
import PhCalculator from './components/PhCalculator.tsx';
import QuizModule from './components/QuizModule.tsx';
import Assistant from './components/Assistant.tsx';
import { AppView } from './types.ts';
import { Beaker, Thermometer, Zap, GraduationCap, ArrowLeft, PlayCircle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');

  const renderView = () => {
    switch (view) {
      case 'home':
        return (
          <div className="space-y-16 py-8">
            {/* Hero Section Focusing on Quiz */}
            <header className="text-center space-y-8 animate-fadeIn relative">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-black mb-4 shadow-sm border border-emerald-200">
                <Sparkles className="w-4 h-4" /> رفيقك الذكي في دراسة الكيمياء
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight leading-tight">
                ابدأ التحدي <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">واختبر معلوماتك</span>
              </h1>
              <p className="text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium">
                اختبارات تفاعلية ذكية في ثابت الاتزان والأس الهيدروجيني مصممة خصيصاً لمستوى المدرسة الثانوية.
              </p>
              
              <div className="pt-6">
                <button 
                  onClick={() => setView('quiz')}
                  className="group relative px-16 py-8 bg-emerald-600 text-white rounded-[40px] font-black text-3xl shadow-2xl hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto"
                >
                  <PlayCircle size={40} />
                  ابدأ الاختبار الآن
                  <div className="absolute inset-0 bg-white/20 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </header>

            {/* Other Tools as Supporting Features */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { id: 'kc-calc', title: 'حاسبة Kc', desc: 'أداة مساعدة لحساب ثابت الاتزان خطوة بخطوة.', icon: Beaker, color: 'emerald' },
                { id: 'ph-calc', title: 'حاسبة pH', icon: Thermometer, desc: 'حول بين pH و pOH والتركيزات بلمحة بصر.', color: 'purple' },
                { id: 'gemini-assistant', title: 'المعلم الذكي', icon: Zap, desc: 'اطرح أي سؤال كيميائي واحصل على شرح مبسط.', color: 'amber' }
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setView(item.id as AppView)}
                  className={`group relative p-8 bg-white rounded-[45px] shadow-sm hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-${item.color}-200 flex flex-col items-center text-center`}
                >
                  <div className={`w-20 h-20 bg-${item.color}-50 text-${item.color}-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                    <item.icon size={36} />
                  </div>
                  <h2 className="text-2xl font-black mb-2 text-gray-800">{item.title}</h2>
                  <p className="text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Footer Educational Banner */}
            <div className="bg-emerald-900 rounded-[60px] p-10 md:p-16 relative overflow-hidden shadow-2xl border-b-[12px] border-emerald-700">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6 text-right">
                  <h2 className="text-4xl font-black text-white">لا تخشَ الكيمياء بعد اليوم!</h2>
                  <p className="text-emerald-100/70 text-xl leading-relaxed">
                    من خلال اختباراتنا المبسطة وشروحات الذكاء الاصطناعي، ستجد أن مفاهيم Kc و pH أسهل بكثير مما كنت تعتقد.
                  </p>
                  <ul className="grid grid-cols-2 gap-4 text-emerald-200 font-bold">
                    <li className="flex items-center gap-2">✓ شرح مبسط</li>
                    <li className="flex items-center gap-2">✓ تدرج في الصعوبة</li>
                    <li className="flex items-center gap-2">✓ حاسبات فورية</li>
                    <li className="flex items-center gap-2">✓ مساعد ذكي 24/7</li>
                  </ul>
                </div>
                <div className="w-64 h-64 bg-emerald-500/20 rounded-full flex items-center justify-center backdrop-blur-3xl border border-emerald-500/30">
                  <GraduationCap size={120} className="text-white opacity-80" />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
              <button 
                onClick={() => setView('home')} 
                className="flex items-center gap-3 px-6 py-3 bg-white text-gray-600 rounded-2xl font-black hover:text-emerald-600 shadow-sm transition-all border border-gray-100"
              >
                <ArrowLeft size={20} className="rotate-180" /> العودة للرئيسية
              </button>
              <div className="text-emerald-900 font-black text-xl opacity-20">كيمياء بلس</div>
            </div>
            {view === 'kc-calc' && <KcCalculator />}
            {view === 'ph-calc' && <PhCalculator />}
            {view === 'quiz' && <QuizModule />}
            {view === 'gemini-assistant' && <Assistant />}
          </div>
        );
    }
  };

  return (
    <Layout 
      activeView={view} 
      setView={setView} 
    >
      {renderView()}
    </Layout>
  );
};

export default App;

// Helper icons needed for UI
const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);