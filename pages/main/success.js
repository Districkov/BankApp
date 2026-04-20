import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IoCheckmark } from 'react-icons/io5';

export default function Success() {
  const router = useRouter();
  const { amount, type = 'перевод' } = router.query;
  const [secondsLeft, setSecondsLeft] = useState(6);
  const [showContent, setShowContent] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('initial'); // initial, expanding, content

  useEffect(() => {
    // Фаза 1: Показываем галочку 200ms
    setTimeout(() => {
      setAnimationPhase('expanding');
    }, 200);

    // Фаза 2: Расширение круга 350ms
    setTimeout(() => {
      setAnimationPhase('content');
      setShowContent(true);
    }, 550);

    // Таймер обратного отсчета
    const countdownTimer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Автоматическое закрытие через 6 секунд
    const closeTimer = setTimeout(() => {
      router.replace('/main/home');
    }, 6000);

    return () => {
      clearTimeout(closeTimer);
      clearInterval(countdownTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F7F7FB] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Статичная галочка (быстро исчезает) */}
      <div
        className={`absolute w-20 h-20 rounded-full bg-success flex items-center justify-center transition-opacity duration-200 z-20 ${
          animationPhase === 'initial' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <IoCheckmark size={48} color="#fff" />
      </div>

      {/* Расширяющийся круг */}
      <div
        className={`absolute w-20 h-20 rounded-full bg-success transition-all duration-[350ms] z-15 ${
          animationPhase === 'expanding' ? 'scale-[25] opacity-100' : animationPhase === 'content' ? 'scale-[25] opacity-0' : 'scale-100 opacity-100'
        }`}
      />

      {/* Контент */}
      <div
        className={`bg-white mx-6 p-8 rounded-[20px] shadow-lg text-center z-25 transition-all duration-300 ${
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center mx-auto mb-6">
          <IoCheckmark size={48} color="#fff" />
        </div>

        <h1 className="text-2xl font-bold text-[#000] mb-4">Успешно!</h1>

        <p className="text-base text-[#666] leading-6 mb-8">
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

        <p className="text-xs text-[#999] text-center">
          Автоматически закроется через {secondsLeft} {secondsLeft === 1 ? 'секунду' : secondsLeft < 5 ? 'секунды' : 'секунд'}
        </p>
      </div>
    </div>
  );
}
