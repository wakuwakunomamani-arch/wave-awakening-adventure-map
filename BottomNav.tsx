
import React from 'react';
import { Screen } from '../types';
import { ChecklistIcon, DashboardIcon, JournalIcon } from './icons';

interface BottomNavProps {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full transition-all duration-300 ${
        isActive ? 'text-rose-500 scale-110' : 'text-gray-400 hover:text-rose-400'
      }`}
    >
      {icon}
      <span className="text-xs mt-1 font-semibold">{label}</span>
    </button>
  );
};

export default function BottomNav({ currentScreen, setCurrentScreen }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)]">
      <div className="max-w-lg mx-auto flex h-full">
        <NavItem
          label="チェック"
          icon={<ChecklistIcon className="w-7 h-7" />}
          isActive={currentScreen === 'checklist'}
          onClick={() => setCurrentScreen('checklist')}
        />
        <NavItem
          label="ダッシュボード"
          icon={<DashboardIcon className="w-7 h-7" />}
          isActive={currentScreen === 'dashboard'}
          onClick={() => setCurrentScreen('dashboard')}
        />
        <NavItem
          label="ジャーナル"
          icon={<JournalIcon className="w-7 h-7" />}
          isActive={currentScreen === 'journal'}
          onClick={() => setCurrentScreen('journal')}
        />
      </div>
    </nav>
  );
}
