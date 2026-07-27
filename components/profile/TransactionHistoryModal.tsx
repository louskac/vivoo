'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { X, History, ArrowUpRight, ArrowDownLeft, Ticket, CreditCard, Download } from 'lucide-react';

interface TransactionItem {
  id: string;
  title: string;
  type: 'topup' | 'ticket' | 'nfc';
  date: string;
  amount: number;
  isPositive: boolean;
  status: string;
}

export const TransactionHistoryModal: React.FC = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const setActiveModal = useAppStore((state) => state.setActiveModal);

  if (activeModal !== 'transaction_receipt') return null;

  const transactions: TransactionItem[] = [
    {
      id: 'tx-101',
      title: 'Dobití NFC Kredit - Apple Pay',
      type: 'topup',
      date: '27. čvc 2026 · 12:45',
      amount: 1000,
      isPositive: true,
      status: 'Dokončeno'
    },
    {
      id: 'tx-102',
      title: 'Vstupenky: Metronome Festival 2026',
      type: 'ticket',
      date: '25. čvc 2026 · 18:20',
      amount: 1200,
      isPositive: false,
      status: 'Schváleno'
    },
    {
      id: 'tx-103',
      title: 'NFC Nápojový Bar · Riegrovy Sady',
      type: 'nfc',
      date: '20. čvc 2026 · 21:14',
      amount: 240,
      isPositive: false,
      status: 'Zúčtováno'
    },
    {
      id: 'tx-104',
      title: 'Dobití NFC Kredit - Kartou *4920',
      type: 'topup',
      date: '15. čvc 2026 · 14:02',
      amount: 2000,
      isPositive: true,
      status: 'Dokončeno'
    }
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#0F1117] border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-6 text-white shadow-2xl relative animate-slide-up">
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pr-10">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Historie transakcí</h2>
            <p className="text-xs text-neutral-400">Přehled dobíjení a nákupů lístků</p>
          </div>
        </div>

        {/* Transaction List */}
        <div className="flex flex-col gap-3 mb-6">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="glass-panel p-3.5 rounded-2xl flex items-center justify-between gap-3 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                {tx.type === 'topup' ? (
                  <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                ) : tx.type === 'ticket' ? (
                  <Ticket className="w-5 h-5 text-red-500" />
                ) : (
                  <CreditCard className="w-5 h-5 text-amber-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{tx.title}</h4>
                <span className="text-[11px] text-neutral-400 block mt-0.5">{tx.date}</span>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-sm font-black block ${tx.isPositive ? 'text-emerald-400' : 'text-white'}`}>
                  {tx.isPositive ? '+' : '-'}{tx.amount} Kč
                </span>
                <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">{tx.status}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setActiveModal(null)}
          className="w-full py-3.5 rounded-full bg-white/10 text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Stáhnout daňový doklad (PDF)
        </button>
      </div>
    </div>
  );
};
