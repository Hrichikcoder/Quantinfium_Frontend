import React from 'react';

import { ActionCardData, TradeManagementData } from '@/types/common';

interface ActionCardProps {
  data: ActionCardData;
  onDelete?: () => void;
  onChange: (data: Partial<ActionCardData>) => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ data, onDelete, onChange }) => {
  const handleAddLevel = () => {
    const currentLevels = Array.isArray(data.levels) ? data.levels : [];
    if (currentLevels.length < 5) {
      onChange({ levels: [...currentLevels, { ...data.tradeManagement }] });
    }
  };

  return (
    <div className="border border-gray-200 rounded p-4 mb-4">
      {onDelete && (
        <div className="flex justify-end mt-2">
          <button className="text-red-500" onClick={onDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      )}
      {/* Condition and Value row */}
      <div className={`grid ${data.condition === 'In between' ? 'grid-cols-[1fr_160px_160px]' : 'grid-cols-[1fr_160px]'} gap-4 mb-4`}>
        <div>
          <label className="block text-[13px] text-gray-500 font-semibold mb-1">Condition*</label>
          <div className="relative">
            <select 
              className="w-full border rounded px-3 py-2 text-sm appearance-none bg-white pr-8"
              value={data.condition}
              onChange={(e) => onChange({ condition: e.target.value })}
            >
              <option value="Less than">Less than</option>
              <option value="Greater than">Greater than</option>
              <option value="Equal to">Equal to</option>
              <option value="In between">In between</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        {data.condition === 'In between' ? (
          <>
            <div>
              <label className="block text-[13px] text-gray-500 font-semibold mb-1">Min Value*</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 text-sm"
                value={data.minValue || '20'}
                onChange={(e) => onChange({ minValue: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[13px] text-gray-500 font-semibold mb-1">Max Value*</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 text-sm"
                value={data.maxValue || '80'}
                onChange={(e) => onChange({ maxValue: e.target.value })}
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-[13px] text-gray-500 font-semibold mb-1">Value*</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              value={data.value}
              onChange={(e) => onChange({ value: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Trade Management section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[15px] text-sky-600 font-bold">Trade management</h3>
          <button className="text-[12px] text-blue-600 font-bold" onClick={handleAddLevel}>
            + Add levels ({5 - (Array.isArray(data.levels) ? data.levels.length : 0)})
          </button>
        </div>

        {/* Main trade management row */}
        {data.type === 'BUY' ? (
          // BUY action fields
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] text-gray-500 font-semibold mb-1">Amount per Buy* ($)</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={data.tradeManagement.amountPerBuyDollars}
                  onChange={(e) => onChange({
                    tradeManagement: {
                      ...data.tradeManagement,
                      amountPerBuyDollars: e.target.value
                    }
                  })}
                />
              </div>
              <div>
                <label className="block text-[13px] text-gray-500 font-semibold mb-1">Amount per Buy* (%)</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">OR</span>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={data.tradeManagement.amountPerBuyPercentage}
                    onChange={(e) => onChange({
                      tradeManagement: {
                        ...data.tradeManagement,
                        amountPerBuyPercentage: e.target.value
                      }
                    })}
                  />
                </div>
                <span className="text-[10px] text-gray-400">
                  (%) percentage calculated from total available capital
                </span>
              </div>
            </div>

            {/* Additional levels */}
            {(Array.isArray(data.levels) ? data.levels : []).map((level, index) => (
              <div key={index} className="relative grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <button 
                  className="absolute right-0 top-2 text-red-500 hover:text-red-700"
                  onClick={() => {
                    const newLevels = [...(Array.isArray(data.levels) ? data.levels : [])];
                    newLevels.splice(index, 1);
                    onChange({ levels: newLevels });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
                <div>
                  <label className="block text-[13px] text-gray-500 font-semibold mb-1">Amount per Buy* ($)</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={level.amountPerBuyDollars}
                    onChange={(e) => {
                      const newLevels = [...(Array.isArray(data.levels) ? data.levels : [])];
                      newLevels[index] = {
                        ...newLevels[index],
                        amountPerBuyDollars: e.target.value
                      };
                      onChange({ levels: newLevels });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-gray-500 font-semibold mb-1">Amount per Buy* (%)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">OR</span>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={level.amountPerBuyPercentage}
                      onChange={(e) => {
                        const newLevels = [...(Array.isArray(data.levels) ? data.levels : [])];
                        newLevels[index] = {
                          ...newLevels[index],
                          amountPerBuyPercentage: e.target.value
                        };
                        onChange({ levels: newLevels });
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400">
                    (%) percentage calculated from total available capital
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // SELL action fields
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] text-gray-500 font-semibold mb-1">Trade (%) to sell/take profit</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={data.tradeManagement.sellProfitPercentage || '1'}
                  onChange={(e) => onChange({
                    tradeManagement: {
                      ...data.tradeManagement,
                      sellProfitPercentage: e.target.value
                    }
                  })}
                />
                <span className="text-[10px] text-gray-400">
                  (%) percentage will be calculated based on position/hold size
                </span>
              </div>
              <div>
                <label className="block text-[13px] text-gray-500 font-semibold mb-1">Take profit or sell level</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={data.tradeManagement.sellLevel || '25'}
                  onChange={(e) => onChange({
                    tradeManagement: {
                      ...data.tradeManagement,
                      sellLevel: e.target.value
                    }
                  })}
                />
              </div>
            </div>

            {/* Additional levels */}
            {(Array.isArray(data.levels) ? data.levels : []).map((level, index) => (
              <div key={index} className="relative grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <button 
                  className="absolute right-0 top-2 text-red-500 hover:text-red-700"
                  onClick={() => {
                    const newLevels = [...(Array.isArray(data.levels) ? data.levels : [])];
                    newLevels.splice(index, 1);
                    onChange({ levels: newLevels });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
                <div>
                  <label className="block text-[13px] text-gray-500 font-semibold mb-1">Trade (%) to sell/take profit</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={level.sellProfitPercentage || '1'}
                    onChange={(e) => {
                      const newLevels = [...(Array.isArray(data.levels) ? data.levels : [])];
                      newLevels[index] = {
                        ...newLevels[index],
                        sellProfitPercentage: e.target.value
                      };
                      onChange({ levels: newLevels });
                    }}
                  />
                  <span className="text-[10px] text-gray-400">
                    (%) percentage will be calculated based on position/hold size
                  </span>
                </div>
                <div>
                  <label className="block text-[13px] text-gray-500 font-semibold mb-1">Take profit or sell level</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={level.sellLevel || '25'}
                    onChange={(e) => {
                      const newLevels = [...(Array.isArray(data.levels) ? data.levels : [])];
                      newLevels[index] = {
                        ...newLevels[index],
                        sellLevel: e.target.value
                      };
                      onChange({ levels: newLevels });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete button - floating to the right */}
      
    </div>
  );
};