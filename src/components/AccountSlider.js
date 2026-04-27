import React, { useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const CURRENCY_COLORS = { RUB: '#1A889F', USD: '#159E3A', EUR: '#E5A100' };

export default function AccountSlider({ accounts, selectedId, onSelect, label, excludeId }) {
  const { isDarkMode } = useTheme();
  const containerRef = useRef(null);
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

  return (
    <div className="mb-4 -mx-4">
      {label && (
        <label className={`text-sm font-semibold mb-2 block px-4 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{label}</label>
      )}
      <div
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative overflow-hidden"
        style={{ touchAction: 'pan-y' }}
      >
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: isDragging
              ? `translateX(calc(-${selectedIdx * 33.333}vw + ${touchDeltaX.current}px))`
              : `translateX(-${selectedIdx * 33.333}vw)`,
            width: `${visibleAccounts.length * 33.333}vw`,
          }}
        >
          {visibleAccounts.map(acc => {
            const isActive = selectedId === acc.id;
            return (
              <div
                key={acc.id}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: '33.333vw' }}
              >
                <div
                  className={`w-[calc(33.333vw-16px)] mx-2 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-primary shadow-md'
                      : (isDarkMode ? 'border-[#4d4d4d]' : 'border-[#E5E5E5]')
                  } ${isDarkMode ? 'bg-[#181818]' : 'bg-white'}`}
                  onClick={() => onSelect(acc.id)}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: acc.color || CURRENCY_COLORS[acc.currency] || '#1A889F' }}
                    />
                    <span className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>
                      {acc.symbol}
                    </span>
                  </div>
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>
                    {acc.balance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })}
                  </p>
                  <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
                    {acc.symbol}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {visibleAccounts.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {visibleAccounts.map((acc, i) => (
            <div
              key={acc.id}
              className={`h-1.5 rounded-full transition-all ${
                i === selectedIdx
                  ? 'w-6 bg-primary'
                  : 'w-1.5 ' + (isDarkMode ? 'bg-[#4d4d4d]' : 'bg-[#ccc]')
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
