import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IoCheckmark } from 'react-icons/io5';
import { useTheme } from '../../src/context/ThemeContext';

export default function Success() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { amount, type = 'перевод' } = router.query;
  const [secondsLeft, setSecondsLeft] = useState(6);
  const [showContent, setShowContent] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('initial');

  useEffect(() => {
    setTimeout(() => {
      setAnimationPhase('expanding');
    }, 200);

    setTimeout(() => {
      setAnimationPhase('content');
      setShowContent(true);
    }, 550);

    const countdownTimer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const closeTimer = setTimeout(() => {
      router.replace('/main/home');
    }, 6000);

    return () => {
      clearTimeout(closeTimer);
      clearInterval(countdownTimer);
    };
  }, [router]);

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
      <div
        className={`absolute w-20 h-20 rounded-full bg-success flex items-center justify-center transition-opacity duration-200 z-20 ${
          animationPhase === 'initial' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <IoCheckmark size={48} color="#fff" />
      </div>

      <div
        className={`absolute w-20 h-20 rounded-full bg-success transition-all duration-[350ms] z-15 ${
          animationPhase === 'expanding' ? 'scale-[25] opacity-100' : animationPhase === 'content' ? 'scale-[25] opacity-0' : 'scale-100 opacity-100'
        }`}
      />

      <div
        className={`mx-6 p-8 rounded-[20px] shadow-lg text-center z-25 transition-all duration-300 ${
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        } ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}
      >
        <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center mx-auto mb-6">
          <IoCheckmark size={48} color="#fff" />
        </div>

        <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Успешно!</h1>

        <p className={`text-base leading-6 mb-8 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
          {type} на сумму
          <br />
          <span className="text-[28px] font-bold text-success">{amount} ₽</span>
          <br />
          выполнен успешно
        </p>

        <button
          className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-base mb-4"
          onClick={() => router.replace('/main/home')}
        >
          Закрыть
        </button>

        <p className={`text-xs text-center ${isDarkMode ? 'text-[#666]' : 'text-[#999]'}`}>
          Автоматически закроется через {secondsLeft} {secondsLeft === 1 ? 'секунду' : secondsLeft < 5 ? 'секунды' : 'секунд'}
        </p>
      </div>
    </div>
  );
}
