'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { TicketTier } from '@/lib/types';
import { X, Minus, Plus, Users, CreditCard, CheckCircle2 } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { selectedEvent, activeModal, setActiveModal, setActiveTab, setSelectedEvent } = useAppStore();
  const { user, purchaseTicket } = useUser();
  
  const [selectedTier, setSelectedTier] = useState<TicketTier>('standard');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSplitPayment, setIsSplitPayment] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [selectedSector] = useState<string>('Stání u pódia');

  if (activeModal !== 'checkout' || !selectedEvent) return null;

  const tierPrices: Record<TicketTier, { label: string; price: number }> = {
    standard: { label: 'Standardní vstupenka', price: selectedEvent.priceMin || 600 },
    vip: { label: 'VIP Vstupenka + Backstage', price: (selectedEvent.priceMin || 600) + 900 },
    early_bird: { label: 'Early Bird', price: Math.max(300, (selectedEvent.priceMin || 600) - 150) },
    student: { label: 'Student / ISIC', price: Math.max(250, (selectedEvent.priceMin || 600) - 200) }
  };

  const unitPrice = tierPrices[selectedTier].price;
  const subtotal = unitPrice * quantity;
  const serviceFee = 30;
  const totalPrice = subtotal + serviceFee;
  const perPersonPrice = isSplitPayment ? Math.round(totalPrice / 2) : totalPrice;

  const handlePay = async () => {
    const res = await purchaseTicket({
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      location: selectedEvent.location,
      date: selectedEvent.date,
      bgImg: selectedEvent.bgImg,
      tier: selectedTier,
      quantity,
      totalPrice: perPersonPrice,
      sectorName: selectedSector
    });

    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setActiveModal(null);
        setSelectedEvent(null);
        setActiveTab('tickets');
      }, 1800);
    } else {
      alert(res.error || 'Nedostatečný zůstatek na účtu ViVoo. Prosím dobijte si kredit v Profilu.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#0F1117] border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 text-white shadow-2xl relative animate-slide-up">
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-4 animate-fade-in">
            <CheckCircle2 className="w-20 h-20 text-emerald-400 animate-bounce" />
            <h2 className="text-2xl font-black text-white">Vstupenka zakoupena!</h2>
            <p className="text-sm text-neutral-400 max-w-xs">
              Vstupenka byla úspěšně uložena do vašich lístků. Přesměrováváme...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <span className="text-xs font-bold text-[#DE1D3E] uppercase tracking-wider">Nákup vstupenek</span>
              <h2 className="text-2xl font-extrabold text-white mt-1">{selectedEvent.title}</h2>
              <p className="text-xs text-neutral-400 mt-1">{selectedEvent.date} · {selectedEvent.location}</p>
            </div>

            {/* Ticket Tier Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Typ vstupenky</label>
              <div className="grid grid-cols-1 gap-2.5">
                {(Object.keys(tierPrices) as TicketTier[]).map((t) => {
                  const item = tierPrices[t];
                  const isSelected = selectedTier === t;
                  return (
                    <div
                      key={t}
                      onClick={() => setSelectedTier(t)}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#DE1D3E]/15 border-[#DE1D3E] text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-neutral-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{item.label}</span>
                        <span className="text-xs text-neutral-400">Včetně vstupu na hlavní scénu</span>
                      </div>
                      <span className="text-base font-black text-white">{item.price} Kč</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
              <div>
                <span className="text-xs text-neutral-400 font-semibold block">Počet kusů</span>
                <span className="text-base font-extrabold text-white">{quantity}x vstupenka</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-full p-1 border border-white/10">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all"
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>
                <span className="text-sm font-extrabold px-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-[#DE1D3E] flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Split Payment Toggle */}
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-4 rounded-2xl border border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Rozdělit platbu s přáteli</h4>
                  <p className="text-xs text-purple-300/80">Zaplať pouze svou polovinu ({perPersonPrice} Kč)</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isSplitPayment}
                onChange={(e) => setIsSplitPayment(e.target.checked)}
                className="w-5 h-5 accent-[#DE1D3E] rounded cursor-pointer"
              />
            </div>

            {/* Price Summary */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10 text-xs text-neutral-400">
              <div className="flex justify-between">
                <span>Vstupenky ({quantity}x)</span>
                <span className="font-semibold text-white">{subtotal} Kč</span>
              </div>
              <div className="flex justify-between">
                <span>Servisní poplatek</span>
                <span className="font-semibold text-white">{serviceFee} Kč</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/10">
                <span>Celková cena</span>
                <span className="text-lg text-[#DE1D3E]">{totalPrice} Kč</span>
              </div>
            </div>

            {/* User Balance Info */}
            <div className="flex items-center justify-between text-xs text-neutral-400 bg-white/5 p-3 rounded-xl">
              <span>Váš kreditní zůstatek:</span>
              <span className="font-bold text-white">{user.cashlessCredit.toLocaleString('cs-CZ')} Kč</span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              className="w-full py-4 rounded-full bg-[#DE1D3E] text-white font-extrabold text-base shadow-lg shadow-red-600/30 hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Zaplatit {perPersonPrice} Kč (ViVoo Kredit)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
