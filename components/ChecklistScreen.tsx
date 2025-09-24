import React, { useMemo } from 'react';
import { ChecklistItem, Category } from '../types';
import { CheckCircleIcon, SparklesIcon, FireIcon } from './icons';

interface ChecklistScreenProps {
  dailyItems: ChecklistItem[];
  todayChecks: number[];
  setTodayChecks: (itemIds: number[]) => void;
  streak: number;
}

const ChecklistCategory: React.FC<{
  category: Category;
  items: ChecklistItem[];
  todayChecks: number[];
  onToggle: (id: number) => void;
}> = ({ category, items, todayChecks, onToggle }) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="font-display text-lg text-rose-500 mb-3">{category}</h3>
      <div className="space-y-3">
        {items.map(item => {
          const isChecked = todayChecks.includes(item.id);
          return (
            <label
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={`flex items-center p-4 rounded-xl shadow-md cursor-pointer transition-all duration-300 ${
                isChecked
                  ? 'bg-gradient-to-r from-teal-300 to-cyan-400 text-white transform scale-105'
                  : 'bg-white/70 hover:bg-white'
              }`}
            >
              <div className="flex-1">
                <p className="font-semibold">{item.text}</p>
                <p className={`text-sm ${isChecked ? 'text-white/80' : 'text-gray-500'}`}>{item.points} pts</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                  isChecked ? 'bg-white border-white' : 'border-gray-300'
                }`}
              >
                {isChecked && <CheckCircleIcon className="w-5 h-5 text-cyan-500" />}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};


export default function ChecklistScreen({ dailyItems, todayChecks, setTodayChecks, streak }: ChecklistScreenProps) {
  const todayDate = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleToggleCheck = (itemId: number) => {
    const newChecks = todayChecks.includes(itemId)
      ? todayChecks.filter(id => id !== itemId)
      : [...todayChecks, itemId];
    setTodayChecks(newChecks);
  };

  const todaysPoints = useMemo(() => {
    return todayChecks.reduce((total, id) => {
      const item = dailyItems.find(i => i.id === id);
      return total + (item ? item.points : 0);
    }, 0);
  }, [todayChecks, dailyItems]);
  
  const itemsByCategory = useMemo(() => {
    return dailyItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<Category, ChecklistItem[]>);
  }, [dailyItems]);

  const allItemsCompleted = dailyItems.length > 0 && todayChecks.length === dailyItems.length;

  return (
    <div className="animate-fade-in">
      {streak > 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-orange-400 to-rose-400 text-white rounded-xl shadow-lg flex items-center justify-center space-x-2 animate-fade-in">
            <FireIcon className="w-6 h-6" />
            <p className="font-bold text-lg">{streak}日連続達成中！</p>
        </div>
      )}
      <div className="text-center mb-4 p-4 bg-white/50 rounded-xl shadow-sm">
        <p className="text-lg font-semibold text-gray-700">{todayDate}</p>
      </div>
      
      {Object.values(Category).map(cat => (
        <ChecklistCategory 
            key={cat} 
            category={cat} 
            items={itemsByCategory[cat] || []}
            todayChecks={todayChecks} 
            onToggle={handleToggleCheck} 
        />
      ))}
      
      <div className="sticky bottom-20 z-10 p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex justify-between items-center mt-6">
        <p className="text-gray-600 font-semibold">今日の獲得ポイント</p>
        <p className="text-2xl font-bold text-purple-600 animate-pulse">{todaysPoints} pts</p>
      </div>

      {allItemsCompleted && (
        <div className="mt-6 p-4 bg-gradient-to-r from-amber-300 to-orange-400 text-white rounded-xl shadow-lg flex items-center justify-center space-x-3 animate-bounce">
          <SparklesIcon className="w-6 h-6" />
          <p className="font-bold text-lg">今日のコンプリート！おめでとう！</p>
        </div>
      )}
    </div>
  );
}