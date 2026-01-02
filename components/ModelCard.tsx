
import React from 'react';
import { Motorcycle } from '../types';

interface ModelCardProps {
  motorcycle: Motorcycle;
  onClick: (motorcycle: Motorcycle) => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ motorcycle, onClick }) => {
  return (
    <div 
      onClick={() => onClick(motorcycle)}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]"
    >
      <img 
        src={motorcycle.image} 
        alt={motorcycle.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-gray-900">{motorcycle.name}</h3>
          <span className="text-blue-600 font-bold text-sm">¥{motorcycle.price}</span>
        </div>
        <p className="text-xs text-gray-500 mb-2">{motorcycle.series} · {motorcycle.category}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{motorcycle.specs.displacement}</span>
          <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{motorcycle.specs.coolingSystem}</span>
          {motorcycle.specs.absTcs.includes('ABS') && (
            <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full border border-blue-100">ABS</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
