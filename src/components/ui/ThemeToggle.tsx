import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/useTheme';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
      aria-label="Toggle Theme"
      className={`relative p-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center
        ${
          theme === 'dark'
            ? 'bg-slate-800/80 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-slate-700/80 shadow-[0_0_10px_rgba(251,191,36,0.15)]'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 shadow-sm'
        } ${className}`}
    >
      {theme === 'dark' ? (
        <Sun size={18} className="transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon size={18} className="transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
};
