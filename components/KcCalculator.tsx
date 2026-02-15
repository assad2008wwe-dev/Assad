
import React, { useState } from 'react';
import { Calculator, Plus, Trash2, RefreshCw } from 'lucide-react';

interface Substance {
  name: string;
  concentration: number;
  coefficient: number;
}

const KcCalculator: React.FC = () => {
  const [reactants, setReactants] = useState<Substance[]>([{ name: 'A', concentration: 1, coefficient: 1 }]);
  const [products, setProducts] = useState<Substance[]>([{ name: 'C', concentration: 1, coefficient: 1 }]);
  const [result, setResult] = useState<number | null>(null);

  const addSubstance = (type: 'reactant' | 'product') => {
    const newItem = { name: '', concentration: 1, coefficient: 1 };
    if (type === 'reactant') setReactants([...reactants, newItem]);
    else setProducts([...products, newItem]);
  };

  const removeSubstance = (type: 'reactant' | 'product', index: number) => {
    if (type === 'reactant') setReactants(reactants.filter((_, i) => i !== index));
    else setProducts(products.filter((_, i) => i !== index));
  };

  const updateSubstance = (type: 'reactant' | 'product', index: number, field: keyof Substance, value: string | number) => {
    const list = type === 'reactant' ? [...reactants] : [...products];
    list[index] = { ...list[index], [field]: value };
    if (type === 'reactant') setReactants(list);
    else setProducts(list);
  };

  const calculateKc = () => {
    const numerator = products.reduce((acc, p) => acc * Math.pow(p.concentration, p.coefficient), 1);
    const denominator = reactants.reduce((acc, r) => acc * Math.pow(r.concentration, r.coefficient), 1);
    setResult(numerator / denominator);
  };

  const reset = () => {
    setReactants([{ name: 'A', concentration: 1, coefficient: 1 }]);
    setProducts([{ name: 'C', concentration: 1, coefficient: 1 }]);
    setResult(null);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
          <Calculator size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">حاسبة ثابت الاتزان (Kc)</h2>
          <p className="text-gray-500">أدخل التركيزات والمعاملات لحساب Kc</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Reactants */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-emerald-700">المتفاعلات</h3>
            <button onClick={() => addSubstance('reactant')} className="p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100">
              <Plus size={18} />
            </button>
          </div>
          {reactants.map((r, i) => (
            <div key={i} className="flex gap-2 items-center bg-gray-50 p-3 rounded-xl">
              <input 
                placeholder="المادة" 
                className="w-16 p-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none" 
                value={r.name} 
                onChange={(e) => updateSubstance('reactant', i, 'name', e.target.value)}
              />
              <div className="flex flex-col flex-1">
                <label className="text-xs text-gray-400">التركيز (M)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="p-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none" 
                  value={r.concentration} 
                  onChange={(e) => updateSubstance('reactant', i, 'concentration', parseFloat(e.target.value))}
                />
              </div>
              <div className="flex flex-col w-16">
                <label className="text-xs text-gray-400">المعامل</label>
                <input 
                  type="number" 
                  className="p-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none" 
                  value={r.coefficient} 
                  onChange={(e) => updateSubstance('reactant', i, 'coefficient', parseInt(e.target.value))}
                />
              </div>
              <button onClick={() => removeSubstance('reactant', i)} className="text-red-400 hover:text-red-600">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Products */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-blue-700">النواتج</h3>
            <button onClick={() => addSubstance('product')} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100">
              <Plus size={18} />
            </button>
          </div>
          {products.map((p, i) => (
            <div key={i} className="flex gap-2 items-center bg-gray-50 p-3 rounded-xl">
              <input 
                placeholder="المادة" 
                className="w-16 p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" 
                value={p.name} 
                onChange={(e) => updateSubstance('product', i, 'name', e.target.value)}
              />
              <div className="flex flex-col flex-1">
                <label className="text-xs text-gray-400">التركيز (M)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={p.concentration} 
                  onChange={(e) => updateSubstance('product', i, 'concentration', parseFloat(e.target.value))}
                />
              </div>
              <div className="flex flex-col w-16">
                <label className="text-xs text-gray-400">المعامل</label>
                <input 
                  type="number" 
                  className="p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={p.coefficient} 
                  onChange={(e) => updateSubstance('product', i, 'coefficient', parseInt(e.target.value))}
                />
              </div>
              <button onClick={() => removeSubstance('product', i)} className="text-red-400 hover:text-red-600">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center">
        <div className="flex gap-4">
          <button 
            onClick={calculateKc}
            className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Calculator size={20} />
            حساب Kc
          </button>
          <button 
            onClick={reset}
            className="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={20} />
            إعادة تعيين
          </button>
        </div>

        {result !== null && (
          <div className="mt-8 p-6 bg-emerald-50 rounded-3xl border-2 border-emerald-100 text-center w-full">
            <p className="text-emerald-800 text-sm mb-1">النتيجة النهائية</p>
            <div className="text-4xl font-black text-emerald-700">
              Kc = {result.toFixed(4)}
            </div>
            <div className="mt-4 text-xs text-emerald-600 font-mono">
              [النواتج] / [المتفاعلات]
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KcCalculator;
