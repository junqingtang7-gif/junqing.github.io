
import React, { useState } from 'react';
import { Motorcycle } from '../types';
import { KYMCO_MODELS } from '../constants';
import { X, Plus, Scale, AlertCircle } from 'lucide-react';

interface ComparisonViewProps {
  initialIds: string[];
  onIdsChange: (ids: string[]) => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ initialIds, onIdsChange }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const selectedModels = KYMCO_MODELS.filter(m => initialIds.includes(m.id));

  const toggleModel = (id: string) => {
    if (initialIds.includes(id)) {
      onIdsChange(initialIds.filter(i => i !== id));
    } else if (initialIds.length < 3) {
      onIdsChange([...initialIds, id]);
    }
  };

  const specKeys: (keyof Motorcycle['specs'])[] = [
    'displacement', 'maxPower', 'maxTorque', 'coolingSystem',
    'fuelCapacity', 'seatHeight', 'curbWeight', 'absTcs', 'tireFront', 'tireRear'
  ];

  const specLabels: Record<string, string> = {
    displacement: '排量',
    maxPower: '最大功率',
    maxTorque: '最大扭矩',
    coolingSystem: '冷却系统',
    fuelCapacity: '油箱容积',
    seatHeight: '座高',
    curbWeight: '整备质量',
    absTcs: '安全辅助',
    tireFront: '前轮',
    tireRear: '后轮'
  };

  return (
    <div className="pb-24 bg-white min-h-screen">
      <div className="p-6 sticky top-0 bg-white/90 backdrop-blur-md z-30 border-b flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900">车型比对</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Comparison</p>
        </div>
        <button 
          onClick={() => setIsPickerOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      {selectedModels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 px-10 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Scale size={40} className="text-gray-200" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">比对栏空空如也</h3>
          <p className="text-sm text-gray-400 leading-relaxed">请添加车型进行参数比对，支持最多 3 款车型同场竞技。</p>
          <button 
            onClick={() => setIsPickerOpen(true)}
            className="mt-8 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold active:scale-95 transition-all"
          >
            立即添加
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto select-none">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="w-28 p-4 border-b text-left text-[10px] font-black text-gray-400 uppercase tracking-widest sticky left-0 bg-white z-20">技术细节</th>
                {selectedModels.map(model => (
                  <th key={model.id} className="min-w-[140px] p-4 border-b relative align-top">
                    <button 
                      onClick={() => toggleModel(model.id)}
                      className="absolute -top-1 -right-1 bg-white text-gray-400 p-1.5 rounded-full shadow-md border border-gray-100 z-10"
                    >
                      <X size={14} />
                    </button>
                    <img src={model.image} className="w-full h-20 object-cover rounded-lg mb-3 shadow-sm" />
                    <div className="font-black text-xs text-gray-900 leading-tight mb-1 truncate">{model.name}</div>
                    <div className="text-blue-600 font-black text-xs">¥{model.price}</div>
                  </th>
                ))}
                {selectedModels.length < 3 && (
                   <th className="min-w-[140px] p-4 border-b align-middle">
                      <button 
                        onClick={() => setIsPickerOpen(true)}
                        className="w-full h-32 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-300 gap-2 hover:bg-gray-50 transition-all"
                      >
                        <Plus size={24} />
                        <span className="text-[10px] font-bold">继续添加</span>
                      </button>
                   </th>
                )}
              </tr>
            </thead>
            <tbody>
              {specKeys.map((key) => {
                // Logic to check if all models have same value to highlight differences
                const values = selectedModels.map(m => m.specs[key]);
                const isDifferent = new Set(values).size > 1;

                return (
                  <tr key={key} className={`border-b ${isDifferent ? 'bg-blue-50/30' : ''}`}>
                    <td className="p-4 text-xs font-bold text-gray-500 sticky left-0 bg-white z-10">
                      {specLabels[key]}
                      {isDifferent && <div className="text-[8px] text-blue-500 mt-1 flex items-center gap-0.5"><AlertCircle size={8}/> 差异项</div>}
                    </td>
                    {selectedModels.map(model => (
                      <td key={model.id} className={`p-4 text-xs leading-relaxed font-bold ${isDifferent ? 'text-gray-900' : 'text-gray-500'}`}>
                        {model.specs[key]}
                      </td>
                    ))}
                    {selectedModels.length < 3 && <td className="p-4 bg-gray-50/30"></td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Model Picker Overlay */}
      {isPickerOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end animate-in fade-in duration-200">
          <div className="bg-white w-full rounded-t-[40px] p-8 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900">选择车型</h3>
                <p className="text-xs text-gray-400 font-bold mt-1">已选择 {initialIds.length}/3</p>
              </div>
              <button onClick={() => setIsPickerOpen(false)} className="p-2 text-gray-400 bg-gray-100 rounded-full"><X size={20}/></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {KYMCO_MODELS.map(model => (
                <div 
                  key={model.id}
                  onClick={() => toggleModel(model.id)}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    initialIds.includes(model.id) ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50' : 'border-gray-50 bg-gray-50'
                  }`}
                >
                  {initialIds.includes(model.id) && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full z-10">
                      <Plus size={12} className="rotate-45" />
                    </div>
                  )}
                  <img src={model.image} className="w-full h-24 object-cover rounded-xl mb-3" />
                  <div className="text-xs font-black text-gray-900 truncate mb-1">{model.name}</div>
                  <div className="text-[10px] text-blue-600 font-bold">¥{model.price}</div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setIsPickerOpen(false)}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl mt-8 font-black shadow-xl shadow-gray-200"
            >
              完成选择
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonView;
