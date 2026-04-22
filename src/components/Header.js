import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Header = ({ name, onClick }) => {
  const { isDarkMode } = useTheme();
  return (
    <div className={`pt-[18px] px-4 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
      <button onClick={onClick} className="py-2">
        <h1 className={`text-[28px] font-extrabold ${isDarkMode ? 'text-white' : 'text-[#0B0B0B]'}`}>{name}</h1>
      </button>
      <div className="h-3" />
    </div>
  );
};

export default React.memo(Header);
