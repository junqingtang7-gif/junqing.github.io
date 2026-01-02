
import React, { useState, useMemo, useEffect } from 'react';
import { Motorcycle, ViewState, Category } from './types';
import { KYMCO_MODELS } from './constants';
import ModelCard from './components/ModelCard';
import Navigation from './components/Navigation';
import ComparisonView from './components/ComparisonView';
import { getAIRecommendation } from './services/geminiService';
import { ChevronLeft, Search, Info, Send, Bot, MessageCircle, Scale } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  const [selectedModel, setSelectedModel] = useState<Motorcycle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | '全部'>('全部');
  const [compareList, setCompareList] = useState<string[]>([]);
  
  // AI Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: '你好！我是光阳智选顾问。你可以问我：“哪款车适合长途旅行？”或者“1.5万预算推荐什么车？”' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const filteredModels = useMemo(() => {
    return KYMCO_MODELS.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.series.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === '全部' || m.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleModelClick = (model: Motorcycle) => {
    setSelectedModel(model);
    setView('detail');
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;
    
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await getAIRecommendation(userMsg);
    setChatHistory(prev => [...prev, { role: 'bot', text: response }]);
    setIsTyping(false);
  };

  const renderContent = () => {
    if (view === 'detail' && selectedModel) {
      return (
        <div className="pb-24 animate-in fade-in slide-in-from-right duration-300">
          <div className="relative">
            <button 
              onClick={() => setView('list')}
              className="absolute top-4 left-4 z-10 bg-black/20 backdrop-blur-md p-2 rounded-full text-white shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <img src={selectedModel.image} className="w-full aspect-[4/3] object-cover" />
          </div>
          <div className="p-6 bg-white -mt-6 rounded-t-3xl relative z-10 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-black text-gray-900 leading-tight">{selectedModel.name}</h1>
                <p className="text-gray-500 font-medium">{selectedModel.series} · {selectedModel.category}</p>
              </div>
              <div className="text-right">
                <span className="text-blue-600 text-2xl font-black italic">¥{selectedModel.price}</span>
                <p className="text-[10px] text-gray-400 mt-1">官方指导价</p>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button 
                onClick={() => toggleCompare(selectedModel.id)}
                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  compareList.includes(selectedModel.id) 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'bg-gray-900 text-white'
                }`}
              >
                <Scale size={18} />
                {compareList.includes(selectedModel.id) ? '已加入对比' : '加入对比'}
              </button>
            </div>
            
            <div className="mb-8">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">产品简述</h2>
              <p className="text-gray-700 leading-relaxed font-medium">{selectedModel.description}</p>
            </div>
            
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info size={20} className="text-blue-600" /> 技术参数详解
            </h2>
            <div className="space-y-1 bg-gray-50 rounded-2xl p-1 border border-gray-100">
              {Object.entries(selectedModel.specs).map(([key, value]) => {
                const specLabels: Record<string, string> = {
                  engineType: '发动机类型',
                  displacement: '排量',
                  maxPower: '最大功率',
                  maxTorque: '最大扭矩',
                  coolingSystem: '冷却系统',
                  fuelSystem: '供油系统',
                  transmission: '传动系统',
                  fuelCapacity: '油箱容积',
                  seatHeight: '座高',
                  curbWeight: '整备质量',
                  tireFront: '前胎规格',
                  tireRear: '后胎规格',
                  brakingSystem: '制动系统',
                  absTcs: '安全辅助配置'
                };
                return (
                  <div key={key} className="flex justify-between bg-white p-4 rounded-xl">
                    <span className="text-gray-500 text-sm">{specLabels[key] || key}</span>
                    <span className="text-gray-900 font-bold text-sm text-right ml-4">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (view === 'compare') {
      return <ComparisonView initialIds={compareList} onIdsChange={setCompareList} />;
    }

    if (view === 'ai') {
      return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50">
          <div className="p-4 border-b bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <Bot size={24} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">光阳智选顾问</h2>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span className="text-[10px] text-gray-400 font-medium">在线为您提供选车建议</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((chat, idx) => (
              <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                  chat.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 font-medium leading-relaxed'
                }`}>
                  {chat.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm rounded-tl-none border border-gray-100 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t flex gap-2 pb-safe-bottom">
            <input 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="描述您的需求（如：3万以内水冷踏板）"
              className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || isTyping}
              className="bg-blue-600 text-white p-3 rounded-full disabled:opacity-50 active:scale-95 transition-all shadow-md shadow-blue-200"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="pb-24">
        <header className="px-6 pt-10 pb-6 bg-white">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">KYMCO</h1>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Motorcycle Database</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">V 2.5</span>
            </div>
          </div>
        </header>

        {/* Search */}
        <div className="px-4 sticky top-0 z-20 bg-white pb-4 shadow-sm shadow-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索车型名称、排量或系列..." 
              className="w-full bg-gray-100 border-none rounded-2xl py-3.5 pl-11 pr-4 font-medium text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 mt-6">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {['全部', ...Object.values(Category)].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                  activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-blue-200' 
                  : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Model List */}
        <div className="px-4 mt-6 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">在售车型 ({filteredModels.length})</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredModels.map(model => (
              <ModelCard key={model.id} motorcycle={model} onClick={handleModelClick} />
            ))}
          </div>
          {filteredModels.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-300">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="font-bold">未找到匹配车型</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative shadow-2xl overflow-x-hidden selection:bg-blue-200">
      {renderContent()}
      <Navigation currentView={view} onNavigate={(v) => {
        setView(v);
        setSelectedModel(null);
      }} />
      
      {/* Compare Badge Overlay */}
      {view !== 'compare' && compareList.length > 0 && (
        <div 
          onClick={() => setView('compare')}
          className="fixed bottom-24 right-6 bg-gray-900 text-white p-4 rounded-full shadow-xl flex items-center justify-center cursor-pointer active:scale-90 transition-transform z-40"
        >
          <Scale size={24} />
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
            {compareList.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default App;
