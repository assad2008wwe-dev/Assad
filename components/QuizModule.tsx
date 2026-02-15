
import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, XCircle, ChevronRight, Loader2, Award, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { generateChemistryQuestions } from '../services/geminiService.ts';
import { Question, Difficulty } from '../types.ts';

const QuizModule: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [step, setStep] = useState<'topic' | 'difficulty' | 'quiz'>('topic');
  const [activeTopic, setActiveTopic] = useState<'Kc' | 'pH' | null>(null);

  const handleStartQuiz = async (difficulty: Difficulty) => {
    if (!activeTopic) return;
    setLoading(true);
    setStep('quiz');
    try {
      const qs = await generateChemistryQuestions(activeTopic, difficulty);
      setQuestions(qs);
      setCurrentIndex(0);
      setScore(0);
      setSelectedOption(null);
      setIsFinished(false);
      setShowExplanation(false);
    } catch (error) {
      console.error(error);
      setStep('topic');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === questions[currentIndex].correctAnswer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] bg-white rounded-[50px] shadow-2xl border-4 border-emerald-50">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-20 animate-pulse"></div>
          <Loader2 className="w-20 h-20 text-emerald-600 animate-spin relative z-10" />
        </div>
        <h2 className="text-3xl font-black text-gray-800 animate-pulse">جاري تحضير أسئلتك...</h2>
        <p className="text-gray-400 mt-2 font-medium">نصيغ لك تحدياً كيميائياً ممتعاً</p>
      </div>
    );
  }

  if (step === 'topic') {
    return (
      <div className="bg-white rounded-[50px] shadow-2xl p-10 md:p-16 text-center border-t-8 border-emerald-600 animate-fadeIn">
        <div className="w-28 h-28 bg-emerald-50 text-emerald-600 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-100/50">
          <BookOpen size={56} />
        </div>
        <h2 className="text-4xl font-black mb-6 text-gray-900 leading-tight">ابدأ رحلة التعلم</h2>
        <p className="text-gray-500 mb-12 text-xl max-w-lg mx-auto leading-relaxed">اختر الموضوع الذي تريد اختباره، وسأقوم بإنشاء اختبار مخصص لمستواك الحالي.</p>
        
        <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <button 
            onClick={() => { setActiveTopic('Kc'); setStep('difficulty'); }}
            className="group relative px-8 py-12 bg-white border-2 border-emerald-100 rounded-[45px] transition-all hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-100 transition-colors"></div>
            <div className="relative z-10">
              <span className="block text-5xl font-black text-emerald-600 mb-2">Kc</span>
              <span className="text-xl font-bold text-gray-700">ثابت الاتزان</span>
            </div>
          </button>
          <button 
            onClick={() => { setActiveTopic('pH'); setStep('difficulty'); }}
            className="group relative px-8 py-12 bg-white border-2 border-purple-100 rounded-[45px] transition-all hover:border-purple-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-100 transition-colors"></div>
            <div className="relative z-10">
              <span className="block text-5xl font-black text-purple-600 mb-2">pH</span>
              <span className="text-xl font-bold text-gray-700">الأس الهيدروجيني</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (step === 'difficulty') {
    return (
      <div className="bg-white rounded-[50px] shadow-2xl p-10 md:p-16 text-center border-t-8 border-blue-600 animate-fadeIn">
        <button onClick={() => setStep('topic')} className="mb-8 text-gray-400 hover:text-emerald-600 font-bold flex items-center gap-2 mx-auto transition-colors">
          <ChevronRight size={20} /> العودة لاختيار الموضوع
        </button>
        <h2 className="text-4xl font-black mb-10 text-gray-900">حدد مستوى الصعوبة</h2>
        <div className="grid gap-5 max-w-md mx-auto">
          {[
            { id: 'easy', label: 'مستوى أساسي (سهل)', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-50' },
            { id: 'medium', label: 'تطبيق متوسط', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
            { id: 'hard', label: 'تحدي المتفوقين', icon: Award, color: 'text-red-500', bg: 'bg-red-50' }
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => handleStartQuiz(lvl.id as Difficulty)}
              className={`flex items-center gap-6 p-6 rounded-[35px] border-2 border-transparent hover:border-blue-500 hover:bg-white transition-all group ${lvl.bg} shadow-sm hover:shadow-xl`}
            >
              <div className={`p-4 rounded-[20px] bg-white shadow-md ${lvl.color}`}>
                <lvl.icon size={32} />
              </div>
              <div className="text-right">
                <span className="block text-xl font-black text-gray-800">{lvl.label}</span>
                <span className="text-sm text-gray-400 font-medium">مناسب للمراجعة السريعة</span>
              </div>
              <ChevronRight size={24} className="mr-auto opacity-0 group-hover:opacity-100 transition-all rotate-180 text-blue-500" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / (questions.length || 1)) * 100);
    return (
      <div className="bg-white rounded-[50px] shadow-2xl p-12 text-center border-t-8 border-emerald-500 animate-fadeIn">
        <div className={`w-32 h-32 rounded-[40px] flex items-center justify-center mx-auto mb-8 ${percentage >= 60 ? 'bg-emerald-100 text-emerald-600 shadow-emerald-100' : 'bg-red-100 text-red-600 shadow-red-100'} shadow-2xl animate-bounce`}>
          <Award size={64} />
        </div>
        <h2 className="text-5xl font-black mb-4 text-gray-900">انتهى الاختبار!</h2>
        <p className="text-gray-500 mb-12 text-2xl font-medium">أداء رائع في {activeTopic === 'Kc' ? 'ثابت الاتزان' : 'الأس الهيدروجيني'}</p>
        
        <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto mb-12">
          <div className="bg-gray-50 p-8 rounded-[40px] border-2 border-gray-100">
            <p className="text-sm text-gray-400 font-black uppercase mb-2">النتيجة</p>
            <p className="text-6xl font-black text-blue-600">{score}<span className="text-3xl text-gray-300 mx-1">/</span>{questions.length}</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-[40px] border-2 border-gray-100">
            <p className="text-sm text-gray-400 font-black uppercase mb-2">النسبة</p>
            <p className="text-6xl font-black text-emerald-600">{percentage}%</p>
          </div>
        </div>

        <button 
          onClick={() => setStep('topic')}
          className="px-16 py-6 bg-gray-900 text-white rounded-[30px] font-black text-xl hover:bg-emerald-600 transition-all shadow-2xl hover:scale-105 active:scale-95"
        >
          اختبار جديد
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / (questions.length || 1)) * 100;

  if (!currentQ) return null;

  return (
    <div className="bg-white rounded-[50px] shadow-2xl p-8 md:p-14 border border-gray-100 relative overflow-hidden animate-fadeIn">
      {/* Visual Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-black mb-2 shadow-sm">
              <Sparkles size={16} /> مستوى {currentQ.difficulty === 'easy' ? 'أساسي' : currentQ.difficulty === 'medium' ? 'متوسط' : 'متقدم'}
            </span>
            <h2 className="text-3xl font-black text-gray-900">تحدي السؤال {currentIndex + 1}</h2>
          </div>
          <div className="text-right">
             <span className="block text-4xl font-black text-blue-600">{Math.round(progressPercent)}%</span>
             <span className="text-xs font-bold text-gray-400">معدل الإنجاز</span>
          </div>
        </div>
        
        <div className="h-4 w-full bg-gray-100 rounded-full p-1 shadow-inner relative">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) relative shadow-lg" 
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute top-0 right-0 h-full w-4 bg-white/30 rounded-full blur-sm"></div>
          </div>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-12 p-8 bg-gray-50 rounded-[40px] border-2 border-gray-100 shadow-inner group">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 leading-snug group-hover:text-emerald-700 transition-colors">
          {currentQ.text}
        </h3>
      </div>

      {/* Options Grid */}
      <div className="grid gap-5">
        {currentQ.options.map((option, index) => {
          let btnStyles = "bg-white border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-gray-700";
          if (selectedOption !== null) {
            if (index === currentQ.correctAnswer) btnStyles = "bg-emerald-50 border-emerald-500 text-emerald-800 ring-8 ring-emerald-50 shadow-xl scale-[1.02]";
            else if (index === selectedOption) btnStyles = "bg-red-50 border-red-500 text-red-800 ring-8 ring-red-50 shadow-xl animate-shake";
            else btnStyles = "bg-white border-gray-100 opacity-40 grayscale";
          }

          return (
            <button
              key={index}
              disabled={selectedOption !== null}
              onClick={() => handleOptionSelect(index)}
              className={`p-7 rounded-[35px] text-right border-2 font-bold transition-all flex items-center justify-between group text-xl ${btnStyles}`}
            >
              <span>{option}</span>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                selectedOption === index ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200'
              }`}>
                {selectedOption !== null && index === currentQ.correctAnswer && <CheckCircle2 size={20} />}
                {selectedOption !== null && index === selectedOption && index !== currentQ.correctAnswer && <XCircle size={20} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation Area */}
      {showExplanation && (
        <div className="mt-12 p-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[45px] border-r-[12px] border-blue-500 animate-slideUp shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-md">
              <Zap size={24} />
            </div>
            <h4 className="text-2xl font-black text-blue-900">توضيح المعلم الكيميائي</h4>
          </div>
          <p className="text-gray-700 leading-relaxed text-xl font-medium">{currentQ.explanation}</p>
        </div>
      )}

      {/* Next Button */}
      {selectedOption !== null && (
        <button
          onClick={nextQuestion}
          className="mt-12 w-full py-7 bg-gray-900 text-white rounded-[35px] font-black text-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-4 shadow-2xl hover:-translate-y-2 active:scale-95"
        >
          {currentIndex === questions.length - 1 ? 'رؤية النتيجة النهائية' : 'السؤال التالي'}
          <ChevronRight size={32} className="rotate-180" />
        </button>
      )}
    </div>
  );
};

export default QuizModule;
