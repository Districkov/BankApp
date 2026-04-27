import React, { useRef, useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { useTheme } from '../context/ThemeContext';

const CURRENCY_COLORS = { RUB: '#1A889F', USD: '#159E3A', EUR: '#E5A100' };
const CURRENCY_SYMBOLS = { RUB: '₽', USD: '$', EUR: '€' };

export default function AccountSlider({ accounts, selectedId, onSelect, label, excludeId, showBalanceToggle, isBalanceHidden, onToggleBalance }) {
  const { isDarkMode } = useTheme();
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const visibleAccounts = accounts.filter(a => a.id !== excludeId);
  const selectedIdx = visibleAccounts.findIndex(a => a.id === selectedId);

  const goTo = (idx) => {
    if (idx >= 0 && idx < visibleAccounts.length) {
      onSelect(visibleAccounts[idx].id);
    }
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setIsDragging(true);
  };

  const onTouchMove = (e) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 40) {
      if (touchDeltaX.current < 0 && selectedIdx < visibleAccounts.length - 1) {
        goTo(selectedIdx + 1);
      } else if (touchDeltaX.current > 0 && selectedIdx > 0) {
        goTo(selectedIdx - 1);
      }
    }
    touchDeltaX.current = 0;
    setIsDragging(false);
  };

  if (visibleAccounts.length === 0) return null;

  const currentAcc = visibleAccounts[selectedIdx] || visibleAccounts[0];
  const symbol = currentAcc?.symbol || CURRENCY_SYMBOLS[currentAcc?.currency] || '₽';
  const color = currentAcc?.color || CURRENCY_COLORS[currentAcc?.currency] || '#1A889F';

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(balance);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className={`text-sm font-semibold mb-2 block px-5 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{label}</label>
      )}
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="relative"
          style={{ touchAction: 'pan-y' }}
        >
          {visibleAccounts.length > 1 && selectedIdx > 0 && (
            <button
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow ${isDarkMode ? 'bg-[#2d2d2d]' : 'bg-white border border-[#E5E5E5]'}`}
              onClick={() => goTo(selectedIdx - 1)}
            >
              <IoChevronBack size={16} color={isDarkMode ? '#fff' : '#000'} />
            </button>
          )}
          {visibleAccounts.length > 1 && selectedIdx < visibleAccounts.length - 1 && (
            <button
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow ${isDarkMode ? 'bg-[#2d2d2d]' : 'bg-white border border-[#E5E5E5]'}`}
              onClick={() => goTo(selectedIdx + 1)}
            >
              <IoChevronForward size={16} color={isDarkMode ? '#fff' : '#000'} />
            </button>
          )}

          <div
            className={`mx-5 p-6 rounded-[20px] shadow-lg border-2 ${isDarkMode ? 'bg-[#181818] border-primary' : 'bg-white border-primary'}`}
          >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className={`text-base font-bold ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
                {currentAcc?.currency || 'RUB'}
              </span>
            </div>
            {showBalanceToggle && (
              <button onClick={onToggleBalance}>
                {isBalanceHidden ? <IoEyeOffOutline size={18} color={isDarkMode ? '#b3b3b3' : '#666'} /> : <IoEyeOutline size={18} color={isDarkMode ? '#b3b3b3' : '#666'} />}
              </button>
            )}
          </div>
          <p className={`text-[28px] font-extrabold ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>
            {(showBalanceToggle && isBalanceHidden) ? '•••••••' : `${formatBalance(currentAcc?.balance || 0)} ${symbol}`}
          </p>
        </div>

        {visibleAccounts.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {visibleAccounts.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === selectedIdx
                    ? 'w-6 bg-primary'
                    : (isDarkMode ? 'w-2 bg-[#4d4d4d]' : 'w-2 bg-[#E5E5E5]')
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
