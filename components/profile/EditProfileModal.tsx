'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { X, User, Sparkles, CreditCard, Check } from 'lucide-react';

export const EditProfileModal: React.FC = () => {
  const { activeModal, setActiveModal } = useAppStore();
  const { user, updateProfile } = useUser();

  const [fullName, setFullName] = useState(user.fullName || '');
  const [handle, setHandle] = useState(user.handle || '');
  const [bio, setBio] = useState(user.bio || '');
  const [memberTier, setMemberTier] = useState(user.memberTier || 'VIP Gold');
  const [cashlessCredit, setCashlessCredit] = useState(user.cashlessCredit || 0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setHandle(user.handle || '');
      setBio(user.bio || '');
      setMemberTier(user.memberTier || 'VIP Gold');
      setCashlessCredit(user.cashlessCredit || 0);
    }
  }, [user]);

  if (activeModal !== 'edit_profile') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const ok = await updateProfile({
      fullName,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      bio,
      memberTier,
      cashlessCredit: Number(cashlessCredit)
    });
    setIsSaving(false);
    if (ok) {
      setActiveModal(null);
    }
  };

  return (
    <div
      onClick={() => setActiveModal(null)}
      className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#0A0B0E]/95 border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 text-white shadow-2xl relative animate-slide-up backdrop-blur-2xl cursor-default"
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 active:scale-90 transition-all cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pr-8">
          <div className="w-10 h-10 rounded-xl bg-[#DE1D3E]/20 border border-[#DE1D3E]/30 flex items-center justify-center text-[#DE1D3E]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Upravit profil</h2>
            <p className="text-xs text-neutral-400">Nastavení profilu a testovacích údajů</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Celé jméno</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl py-3 px-3.5 text-sm text-white focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Uživatelské jméno / Handle</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl py-3 px-3.5 text-sm text-white focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Bio / Popis</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              VIP Úroveň (Tester Tier)
            </label>
            <select
              value={memberTier}
              onChange={(e) => setMemberTier(e.target.value)}
              className="w-full bg-[#181A20] border border-white/15 rounded-xl py-3 px-3 text-sm text-white focus:outline-none focus:border-red-500"
            >
              <option value="VIP Gold">VIP Gold</option>
              <option value="VIP Silver">VIP Silver</option>
              <option value="VIP Platinum">VIP Platinum</option>
              <option value="Standard Member">Standard Member</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              Kredit v Peněžence (Kč)
            </label>
            <input
              type="number"
              value={cashlessCredit}
              onChange={(e) => setCashlessCredit(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/15 rounded-xl py-3 px-3.5 text-sm text-white focus:outline-none focus:border-red-500 font-mono font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 rounded-2xl bg-[#DE1D3E] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 hover:bg-red-600 active:scale-95 transition-all cursor-pointer mt-2"
          >
            <Check className="w-4 h-4" />
            {isSaving ? 'Ukládám...' : 'Uložit změny profilu'}
          </button>
        </form>
      </div>
    </div>
  );
};
