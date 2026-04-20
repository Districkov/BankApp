import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoClose, IoSwapVertical } from 'react-icons/io5';
import { accountsAPI, transfersAPI } from '../../src/utils/api';

export default function TransferAccounts() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState(null);
  const [toAccount, setToAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const accountsData = await accountsAPI.getAccounts().catch(() => null);
      
      if (accountsData && accountsData.length > 0) {
        setAccounts(accountsData.map(acc => ({
          id: acc.id,
          name: acc.name || 'Счёт',
          amount: parseFloat(acc.balance || 0),
          color: acc.color || '#6A2EE8'
        })));
        
        // Устанавливаем первые два счета по умолчанию
        if (accountsData.length >= 2) {
          setFromAccount(accountsData[0].id);
          setToAccount(accountsData[1].id);
        } else if (accountsData.length === 1) {
          setFromAccount(accountsData[0].id);
        }
      } else {
        // Fallback на заглушки
        setAccounts([
          { id: 'account1', name: 'Основной счёт', amount: 22717.98, color: '#6A2EE8' },
          { id: 'account2', name: 'Накопительный счёт', amount: 50000.00, color: '#159E3A' }
        ]);
        setFromAccount('account1');
        setToAccount('account2');
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
      // Устанавливаем заглушки при ошибке
      setAccounts([
        { id: 'account1', name: 'Основной счёт', amount: 22717.98, color: '#6A2EE8' },
        { id: 'account2', name: 'Накопительный счёт', amount: 50000.00, color: '#159E3A' }
      ]);
      setFromAccount('account1');
      setToAccount('account2');
    } finally {
      setLoading(false);
    }
  };

  const swapAccounts = () => {
    const temp = fromAccount;
    setFromAccount(toAccount);
    setToAccount(temp);
  };

  const onChangeAmount = (e) => {
    let cleaned = e.target.value.replace(/[^\d,.]/g, '');
    cleaned = cleaned.replace(',', '.');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts[1];
    }
    setAmount(cleaned);
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
      // Отправляем запрос на бэкенд
      await transfersAPI.transferBetweenAccounts({
        fromAccountId: fromAccount,
        toAccountId: toAccount,
        amount: amountNum
      });
      
      router.push(`/main/success?amount=${amountNum.toFixed(2)}&type=Перевод между счетами`);
    } catch (error) {
      const errorMessage = error.message || 'Операция отклонена системой безопасности';
      
      if (error.status === 400 || error.status === 403 || error.status === 429) {
        // Редирект на страницу ошибки для антифрод и других критичных ошибок
        router.push(`/main/failed?amount=${amountNum.toFixed(2)}&type=Перевод между счетами&reason=${encodeURIComponent(errorMessage)}`);
      } else {
        alert(errorMessage);
      }
    }
  };

  const isFormValid = amount && parseFloat(amount) > 0 && fromAccount && toAccount && fromAccount !== toAccount;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex-1 bg-[#F7F7FB] min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex-1 bg-[#F7F7FB] min-h-screen">
        <div className="bg-white px-4 py-4 border-b border-[#E5E5E5] flex justify-between items-center">
          <button className="w-8 h-8 flex items-center justify-center" onClick={() => router.back()}>
            <IoClose size={24} color="#000" />
          </button>
          <h1 className="text-lg font-semibold text-[#000]">Между счетами</h1>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-5">
          {/* From Account */}
          <div className="mb-3">
            <label className="text-base font-medium text-[#666] mb-3 block px-1">Списать с</label>
            {accounts.filter(acc => acc.id === fromAccount).map((account) => (
              <div
                key={account.id}
                className="w-full bg-white p-5 rounded-2xl border-2 border-primary bg-[#F8F5FF] shadow-sm"
              >
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: account.color }} />
                  <span className="text-base font-semibold text-[#000]">{account.name}</span>
                </div>
                <p className="text-xl font-bold text-[#000]">{account.amount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽</p>
              </div>
            ))}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center my-4">
            <button
              onClick={swapAccounts}
              className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg hover:bg-[#5A1FD8] transition-colors"
            >
              <IoSwapVertical size={24} color="#fff" />
            </button>
          </div>

          {/* To Account */}
          <div className="mb-6">
            <label className="text-base font-medium text-[#666] mb-3 block px-1">Зачислить на</label>
            {accounts.filter(acc => acc.id === toAccount).map((account) => (
              <div
                key={account.id}
                className="w-full bg-white p-5 rounded-2xl border-2 border-primary bg-[#F8F5FF] shadow-sm"
              >
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: account.color }} />
                  <span className="text-base font-semibold text-[#000]">{account.name}</span>
                </div>
                <p className="text-xl font-bold text-[#000]">{account.amount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽</p>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <label className="text-base font-medium text-[#666] mb-3 block px-1">Сумма перевода</label>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white px-5 py-4 rounded-2xl shadow-sm">
                <input
                  type="text"
                  value={amount}
                  onChange={onChangeAmount}
                  className="w-full text-[32px] font-bold text-[#000] text-center bg-transparent"
                  placeholder="0"
                />
              </div>
              <span className="text-2xl font-bold text-[#000] w-[30px]">₽</span>
            </div>
          </div>

          <button
            className={`w-full p-4 rounded-xl text-base font-bold text-white mt-2 ${
              isFormValid ? 'bg-primary' : 'bg-[#B9B6FF]'
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
