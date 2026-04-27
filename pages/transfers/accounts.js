import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoClose, IoSwapVertical, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { accountsAPI, transfersAPI } from '../../src/utils/api';
import { useTheme } from '../../src/context/ThemeContext';

export default function TransferAccounts() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState(null);
  const [toAccount, setToAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(1);
  const fromTouchStartX = useRef(0);
  const fromTouchEndX = useRef(0);
  const toTouchStartX = useRef(0);
  const toTouchEndX = useRef(0);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const accountsData = await accountsAPI.getAccounts().catch(() => null);

      if (accountsData && accountsData.length > 0) {
        const mapped = accountsData.map(acc => ({
          id: acc.id,
          name: acc.name || 'Счёт',
          amount: parseFloat(acc.balance || 0),
          color: acc.color || '#1A889F'
        }));
        setAccounts(mapped);

        if (mapped.length >= 2) {
          setFromAccount(mapped[0].id);
          setToAccount(mapped[1].id);
        } else if (mapped.length === 1) {
          setFromAccount(mapped[0].id);
        }
      } else {
        const fallback = [
          { id: 'account1', name: 'Основной счёт', amount: 22717.98, color: '#1A889F' },
          { id: 'account2', name: 'Накопительный счёт', amount: 50000.00, color: '#159E3A' }
        ];
        setAccounts(fallback);
        setFromAccount('account1');
        setToAccount('account2');
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
      const fallback = [
        { id: 'account1', name: 'Основной счёт', amount: 22717.98, color: '#1A889F' },
        { id: 'account2', name: 'Накопительный счёт', amount: 50000.00, color: '#159E3A' }
      ];
      setAccounts(fallback);
      setFromAccount('account1');
      setToAccount('account2');
    } finally {
      setLoading(false);
    }
  };

  const swapAccounts = () => {
    const tempIdx = fromIndex;
    setFromIndex(toIndex);
    setToIndex(tempIdx);
    const tempId = fromAccount;
    setFromAccount(toAccount);
    setToAccount(tempId);
  };

  const handleFromSwipeStart = (e) => {
    fromTouchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const handleFromSwipeMove = (e) => {
    fromTouchEndX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const handleFromSwipeEnd = () => {
    if (!fromTouchStartX.current || !fromTouchEndX.current) return;
    const diff = fromTouchStartX.current - fromTouchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && fromIndex < accounts.length - 1) {
        const newIdx = fromIndex + 1;
        setFromIndex(newIdx);
        setFromAccount(accounts[newIdx].id);
      } else if (diff < 0 && fromIndex > 0) {
        const newIdx = fromIndex - 1;
        setFromIndex(newIdx);
        setFromAccount(accounts[newIdx].id);
      }
    }
    fromTouchStartX.current = 0;
    fromTouchEndX.current = 0;
  };

  const handleToSwipeStart = (e) => {
    toTouchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const handleToSwipeMove = (e) => {
    toTouchEndX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const handleToSwipeEnd = () => {
    if (!toTouchStartX.current || !toTouchEndX.current) return;
    const diff = toTouchStartX.current - toTouchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && toIndex < accounts.length - 1) {
        const newIdx = toIndex + 1;
        setToIndex(newIdx);
        setToAccount(accounts[newIdx].id);
      } else if (diff < 0 && toIndex > 0) {
        const newIdx = toIndex - 1;
        setToIndex(newIdx);
        setToAccount(accounts[newIdx].id);
      }
    }
    toTouchStartX.current = 0;
    toTouchEndX.current = 0;
  };

  const handleTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Введите сумму для перевода');
      return;
    }

    const amountNum = parseFloat(amount);
    const fromAcc = accounts.find(a => a.id === fromAccount);

    if (!fromAcc) {
      alert('Выберите счёт для списания');
      return;
    }

    if (amountNum > fromAcc.amount) {
      alert('Недостаточно средств на счете');
      return;
    }

    try {
      await transfersAPI.transferBetweenAccounts({
        fromAccountId: fromAccount,
        toAccountId: toAccount,
        amount: amountNum
      });

      router.push(`/main/success?amount=${amountNum.toFixed(2)}&type=Перевод между счетами`);
    } catch (error) {
      const errorMessage = error.message || 'Операция отклонена системой безопасности';

      if (error.status === 400 || error.status === 403 || error.status === 429) {
        router.push(`/main/failed?amount=${amountNum.toFixed(2)}&type=Перевод между счетами&reason=${encodeURIComponent(errorMessage)}`);
      } else {
        alert(errorMessage);
      }
    }
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(balance);
  };

  const isFormValid = amount && parseFloat(amount) > 0 && fromAccount && toAccount && fromAccount !== toAccount;

  if (loading) {
    return (
      <MainLayout>
        <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
          <div className={`animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${isDarkMode ? 'border-[#1A889F]' : 'border-primary'}`} />
        </div>
      </MainLayout>
    );
  }

  const fromAcc = accounts[fromIndex];
  const toAcc = accounts[toIndex];

  return (
    <MainLayout>
      <div className={`flex flex-col flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
        <div className={`px-5 py-4 border-b flex justify-between items-center ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#E5E5E5]'}`}>
          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Между счетами</h1>
          <button onClick={() => router.back()}>
            <IoClose size={24} color={isDarkMode ? '#fff' : '#000'} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-5">
          <div className="mb-3">
            <label className={`text-base font-medium mb-3 block px-1 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Списать с</label>
            <div
              className={`rounded-[20px] border-2 border-primary shadow-sm ${isDarkMode ? 'bg-[#181818]' : 'bg-white'}`}
              onTouchStart={handleFromSwipeStart}
              onTouchMove={handleFromSwipeMove}
              onTouchEnd={handleFromSwipeEnd}
              onMouseDown={handleFromSwipeStart}
              onMouseMove={(e) => { if (e.buttons === 1) handleFromSwipeMove(e); }}
              onMouseUp={handleFromSwipeEnd}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: fromAcc?.color || '#1A889F' }} />
                    <span className={`text-base font-bold ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{fromAcc?.name || 'Счёт'}</span>
                  </div>
                  <button onClick={() => setIsBalanceHidden(!isBalanceHidden)}>
                    {isBalanceHidden ? <IoEyeOffOutline size={18} color={isDarkMode ? '#b3b3b3' : '#666'} /> : <IoEyeOutline size={18} color={isDarkMode ? '#b3b3b3' : '#666'} />}
                  </button>
                </div>
                <p className={`text-[28px] font-extrabold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>
                  {isBalanceHidden ? '•••••••' : `${formatBalance(fromAcc?.amount || 0)} ₽`}
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => {
                      let cleaned = e.target.value.replace(/[^\d,.]/g, '');
                      cleaned = cleaned.replace(',', '.');
                      const parts = cleaned.split('.');
                      if (parts.length > 2) {
                        cleaned = parts[0] + '.' + parts[1];
                      }
                      setAmount(cleaned);
                    }}
                    className={`flex-1 text-[32px] font-bold bg-transparent focus:outline-none ${isDarkMode ? 'text-white placeholder-[#666]' : 'text-[#000]'}`}
                    placeholder="0"
                  />
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>₽</span>
                </div>
              </div>

              {accounts.length > 1 && (
                <div className="flex justify-center gap-2 pb-4">
                  {accounts.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === fromIndex
                          ? 'w-6 bg-primary'
                          : (isDarkMode ? 'w-2 bg-[#4d4d4d]' : 'w-2 bg-[#E5E5E5]')
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center my-4">
            <button
              onClick={swapAccounts}
              className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg hover:bg-[#5A1FD8] transition-all duration-300 active:scale-90"
            >
              <IoSwapVertical size={24} color="#fff" />
            </button>
          </div>

          <div className="mb-6">
            <label className={`text-base font-medium mb-3 block px-1 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Зачислить на</label>
            <div
              className={`rounded-[20px] border-2 border-primary shadow-sm ${isDarkMode ? 'bg-[#181818]' : 'bg-white'}`}
              onTouchStart={handleToSwipeStart}
              onTouchMove={handleToSwipeMove}
              onTouchEnd={handleToSwipeEnd}
              onMouseDown={handleToSwipeStart}
              onMouseMove={(e) => { if (e.buttons === 1) handleToSwipeMove(e); }}
              onMouseUp={handleToSwipeEnd}
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: toAcc?.color || '#159E3A' }} />
                  <span className={`text-base font-bold ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{toAcc?.name || 'Счёт'}</span>
                </div>
                <p className={`text-[28px] font-extrabold ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>
                  {formatBalance(toAcc?.amount || 0)} ₽
                </p>
              </div>

              {accounts.length > 1 && (
                <div className="flex justify-center gap-2 pb-4">
                  {accounts.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === toIndex
                          ? 'w-6 bg-primary'
                          : (isDarkMode ? 'w-2 bg-[#4d4d4d]' : 'w-2 bg-[#E5E5E5]')
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            className={`w-full p-4 rounded-xl text-base font-bold text-white ${
              isFormValid ? 'bg-primary' : (isDarkMode ? 'bg-[#4d4d4d] text-[#999] cursor-not-allowed' : 'bg-[#B9B6FF] cursor-not-allowed')
            }`}
            disabled={!isFormValid}
            onClick={handleTransfer}
          >
            Перевести {amount ? parseFloat(amount).toFixed(2) + ' ₽' : ''}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
