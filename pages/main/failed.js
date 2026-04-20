import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IoClose } from 'react-icons/io5';

export default function Failed() {
  const router = useRouter();
  const { amount, type = 'перевод', reason = 'Операция отклонена системой безопасности' } = router.query;
  const [secondsLeft, setSecondsLeft] = useState(6);
  const [showContent, setShowContent] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('initial'); // initial, expanding, content

  useEffect(() => {
    // Фаза 1: Показываем крестик 200ms
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
      {/* Статичный крестик (быстро исчезает) */}
      <div
        className={`absolute w-20 h-20 rounded-full bg-danger flex items-center justify-center transition-opacity duration-200 z-20 ${
          animationPhase === 'initial' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <IoClose size={48} color="#fff" />
      </div>

      {/* Расширяющийся круг */}
      <div
        className={`absolute w-20 h-20 rounded-full bg-danger transition-all duration-[350ms] z-15 ${
          animationPhase === 'expanding' ? 'scale-[25] opacity-100' : animationPhase === 'content' ? 'scale-[25] opacity-0' : 'scale-100 opacity-100'
        }`}
      />

      {/* Контент */}
      <div
        className={`bg-white mx-6 p-8 rounded-[20px] shadow-lg text-center z-25 transition-all duration-300 ${
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <div className="w-20 h-20 rounded-full bg-danger flex items-center justify-center mx-auto mb-6">
          <IoClose size={48} color="#fff" />
        </div>

        <h1 className="text-2xl font-bold text-[#000] mb-4">Операция отклонена</h1>

        <p className="text-base text-[#666] leading-6 mb-2">
          {type} на сумму
          <br />
          <span className="text-[28px] font-bold text-danger">{amount} ₽</span>
          <br />
          не выполнен
        </p>

        <div className="bg-[#FFF3F3] border border-[#FFE0E0] rounded-xl p-4 mb-6">
          <p className="text-sm text-danger font-medium leading-5">
            {reason}
          </p>
        </div>

        <div className="bg-[#F8FAFD] rounded-xl p-4 mb-6 text-left">
          <p className="text-xs text-[#666] leading-5 mb-2">
            <strong>Возможные причины:</strong>
          </p>
          <ul className="text-xs text-[#666] leading-5 space-y-1">
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

        <p className="text-xs text-[#999] text-center">
          Автоматически закроется через {secondsLeft} {secondsLeft === 1 ? 'секунду' : secondsLeft < 5 ? 'секунды' : 'секунд'}
        </p>
      </div>
    </div>
  );
}
