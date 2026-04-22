import React from 'react';
import { IoArrowDown, IoArrowUp, IoSwapHorizontal } from 'react-icons/io5';
import { useTheme } from '../context/ThemeContext';

const TransactionItem = ({ transaction, onClick }) => {
  const { isDarkMode } = useTheme();
  const getIcon = (type) => {
    switch (type) {
      case 'income':
        return { Icon: IoArrowDown, color: '#159E3A', bgColor: isDarkMode ? '#1a3d1a' : '#E8F5E8' };
      case 'expense':
        return { Icon: IoArrowUp, color: '#FF3B30', bgColor: isDarkMode ? '#3d1a1a' : '#FFE5E5' };
      default:
        return { Icon: IoSwapHorizontal, color: '#6A2EE8', bgColor: isDarkMode ? '#2a1a4d' : '#F0EBFF' };
    }
  };

  const { Icon, color, bgColor } = getIcon(transaction.type);

  return (
    <button 
      className={`flex flex-row items-center p-4 rounded-xl mb-2 shadow-sm hover:shadow-md transition-shadow w-full ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}
      onClick={onClick}
    >
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
        style={{ backgroundColor: bgColor }}
      >
        <Icon size={20} color={color} />
      </div>
      <div className="flex-1 text-left">
        <p className={`text-base font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{transaction.title}</p>
        <p className={`text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{transaction.date}</p>
      </div>
      <p 
        className="text-base font-bold"
        style={{ color: transaction.type === 'income' ? '#159E3A' : '#FF3B30' }}
      >
        {transaction.amount}
      </p>
    </button>
  );
};

export default TransactionItem;
