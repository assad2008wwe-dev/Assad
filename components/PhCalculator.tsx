
import React, { useState, useEffect } from 'react';
import { Droplets, Info } from 'lucide-react';
import { PhCalculationResult } from '../types';

const PhCalculator: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('7');
  const [inputType, setInputType] = useState<'ph' | 'poh' | 'hplus' | 'ohminus'>('ph');
  const [result, setResult] = useState<PhCalculationResult | null>(null);

  const calculate = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return;

    let ph = 7;
    let poh = 7;
    let hPlus = 1e-7;
    let ohMinus = 1e-7;

    switch (inputType) {
      case 'ph':
        ph = val;
        poh = 14 - ph;
        hPlus = Math.pow(10, -ph);
        ohMinus = Math.pow(10, -poh);
        break;
      case 'poh':
        poh = val;
        ph = 14 - poh;
        hPlus = Math.pow(10, -ph);
        ohMinus = Math.pow(10, -poh);
        break;
      case 'hplus':
        hPlus = val;
        ph = -Math.log10(hPlus);
        poh = 14 - ph;
        ohMinus = Math.pow(10, -poh);
        break;
      case 'ohminus':
        ohMinus = val;
        poh = -Math.log10(ohMinus);
        ph = 14 - poh;
        hPlus = Math.pow(10, -ph);
        break;
    }

    let nature: 'حمضي' | 'قاعدي' | 'متعادل' = 'متعادل';
    if (ph < 7) nature = 'حمضي';
    else if (ph > 7) nature = 'قاعدي';

    setResult({ ph, poh, hPlus, ohMinus, nature });
  };

  useEffect(() => {
    calculate();
  }, [inputValue, inputType]);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
          <Droplets size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">حاسبة الأس الهيدروجيني (pH)</h2>
          <p className="text-gray-500">أدخل أي قيمة للحصول على باقي النتائج</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">نوع المدخل</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'ph', label: 'pH' },
                { id: 'poh', label: 'pOH' },
                { id: 'hplus', label: '[H+]' },
                { id: 'ohminus', label: '[OH-]' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setInputType(type.id as any)}
                  className={`py-2 px-4 rounded-xl text-sm font-bold transition-all border-2 ${
                    inputType === type.id 
                      ? 'bg-purple-600 text-white border-purple-600' 
                      : 'bg-white text-gray-600 border-gray-100 hover:border-purple-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">القيمة</label>
            <input
              type="number"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-4 text-2xl font-bold bg-gray-50 rounded-2xl border-2 border-transparent focus:border-purple-500 outline-none transition-all"
              placeholder="0.00"
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl flex gap-3 text-blue-800 text-sm">
            <Info size={20} className="shrink-0" />
            <p>تعتمد الحسابات على درجة حرارة 25° مئوية حيث أن Kw = 10⁻¹⁴</p>
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <div className={`p-6 rounded-3xl text-center border-4 transition-all ${
              result.nature === 'حمضي' ? 'bg-red-50 border-red-200' : 
              result.nature === 'قاعدي' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
            }`}>
              <p className="text-sm opacity-70 mb-1">طبيعة المحلول</p>
              <h3 className={`text-4xl font-black ${
                result.nature === 'حمضي' ? 'text-red-600' : 
                result.nature === 'قاعدي' ? 'text-blue-600' : 'text-green-600'
              }`}>{result.nature}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-xs text-gray-500 uppercase">pH</p>
                <p className="text-xl font-bold">{result.ph.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-xs text-gray-500 uppercase">pOH</p>
                <p className="text-xl font-bold">{result.poh.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-xs text-gray-500 uppercase">[H+] M</p>
                <p className="text-sm font-mono overflow-hidden whitespace-nowrap overflow-ellipsis">{result.hPlus.toExponential(2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-xs text-gray-500 uppercase">[OH-] M</p>
                <p className="text-sm font-mono overflow-hidden whitespace-nowrap overflow-ellipsis">{result.ohMinus.toExponential(2)}</p>
              </div>
            </div>

            {/* Scale Visualization */}
            <div className="mt-6">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-red-500">حمضي (0)</span>
                <span className="text-green-500">متعادل (7)</span>
                <span className="text-blue-500">قاعدي (14)</span>
              </div>
              <div className="h-4 w-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-full relative">
                <div 
                  className="absolute h-6 w-2 bg-black rounded-full top-1/2 -translate-y-1/2 border-2 border-white shadow-md transition-all duration-500"
                  style={{ left: `${Math.min(Math.max((result.ph / 14) * 100, 0), 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhCalculator;
