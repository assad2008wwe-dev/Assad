
import React from 'react';
import { Home, Calculator, Droplets, BookOpen, BrainCircuit, Settings } from 'lucide-react';
import { AppView, LayoutProps } from '../types.ts';

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView, onOpenSettings }) => {
  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'kc-calc', label: 'حاسبة Kc', icon: Calculator },
    { id: 'ph-calc', label: 'حاسبة pH', icon: Droplets },
    { id: 'quiz', label: 'اختبارات', icon: BookOpen },
    { id: 'gemini-assistant', label: 'المساعد الذكي', icon: BrainCircuit },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-800">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-emerald-700 text-white p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-white p-2 rounded-lg text-emerald-700">
            <BookOpen size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">كيمياء بلس</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as AppView)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeView === item.id 
                    ? 'bg-white/20 font-bold shadow-lg' 
                    : 'hover:bg-white/10 opacity-80'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <button 
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 opacity-80 transition-all text-sm"
          >
            <Settings size={18} />
            <span>إعدادات API</span>
          </button>
          
          <div className="pt-4 border-t border-white/20 text-xs text-center opacity-60">
            &copy; 2024 كيمياء بلس التعليمي
          </div>
        </div>
      </aside>

      {/* Mobile Nav */}
      <header className="md:hidden bg-emerald-700 text-white p-4 sticky top-0 z-50 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <BookOpen size={20} />
          <h1 className="text-lg font-bold">كيمياء بلس</h1>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            <Settings size={20} />
          </button>
          <div className="flex gap-2 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as AppView)}
                  className={`p-2 rounded-lg shrink-0 ${activeView === item.id ? 'bg-white/20' : ''}`}
                  title={item.label}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto animate-fadeIn">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
