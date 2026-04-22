import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IoClose } from 'react-icons/io5';
import { useTheme } from '../../src/context/ThemeContext';

export default function Failed() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { amount, type = 'перевод', reason = 'Операция отклонена системой безопасности' } = router.query;
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
        className={`absolute w-20 h-20 rounded-full bg-danger flex items-center justify-center transition-opacity duration-200 z-20 ${
          animationPhase === 'initial' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <IoClose size={48} color="#fff" />
      </div>

      <div
        className={`absolute w-20 h-20 rounded-full bg-danger transition-all duration-[350ms] z-15 ${
          animationPhase === 'expanding' ? 'scale-[25] opacity-100' : animationPhase === 'content' ? 'scale-[25] opacity-0' : 'scale-100 opacity-100'
        }`}
      />

      <div
        className={`mx-6 p-8 rounded-[20px] shadow-lg text-center z-25 transition-all duration-300 ${
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        } ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}
      >
        <div className="w-20 h-20 rounded-full bg-danger flex items-center justify-center mx-auto mb-6">
          <IoClose size={48} color="#fff" />
        </div>

        <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Операция отклонена</h1>

        <p className={`text-base leading-6 mb-2 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
          {type} на сумму
          <br />
          <span className="text-[28px] font-bold text-danger">{amount} ₽</span>
          <br />
          не выполнен
        </p>

        <div className={`${isDarkMode ? 'bg-[#3d1a1a] border border-[#5a2020]' : 'bg-[#FFF3F3] border border-[#FFE0E0]'} rounded-xl p-4 mb-6`}>
          <p className="text-sm text-danger font-medium leading-5">
            {reason}
          </p>
        </div>

        <div className={`${isDarkMode ? 'bg-[#1f1f1f] border border-[#4d4d4d]' : 'bg-[#F8FAFD]'} rounded-xl p-4 mb-6 text-left`}>
          <p className={`text-xs leading-5 mb-2 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
            <strong>Возможные причины:</strong>
          </p>
          <ul className={`text-xs leading-5 space-y-1 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
            <li>• Превышен лимит переводов</li>
            <li>• Подозрительная активность</li>
            <li>• Недостаточно средств</li>
            <li>• Технические неполадки</li>
          </ul>
        </div>

        <button
          className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-base mb-4 w-full"
          onClick={() => router.replace('/main/home')}
        >
          Вернуться на главную
        </button>

        <p className={`text-xs text-center ${isDarkMode ? 'text-[#666]' : 'text-[#999]'}`}>
          Автоматически закроется через {secondsLeft} {secondsLeft === 1 ? 'секунду' : secondsLeft < 5 ? 'секунды' : 'секунд'}
        </p>
      </div>
    </div>
  );
}
