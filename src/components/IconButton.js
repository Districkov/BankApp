import React from 'react';
import { useTheme } from '../context/ThemeContext';

const IconButton = ({ icon, label, onClick, className, testID }) => {
  const { isDarkMode } = useTheme();
  return (
    <button 
      data-testid={testID}
      className={`flex flex-col items-center w-20 ${className || ''}`}
      onClick={onClick}
      aria-label={label}
    >
      <div className={`w-14 h-14 rounded-full ${isDarkMode ? 'bg-[#09436B]' : 'bg-primary-light'} flex items-center justify-center`}>
        {icon}
      </div>
      <span className={`mt-2 text-xs text-center font-medium ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#1A1A1A]'}`}>{label}</span>
    </button>
  );
};

export default React.memo(IconButton);
