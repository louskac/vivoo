import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { TransactionDbModel } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, paymentMethod } = body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid top-up amount' }, { status: 400 });
    }

    const db = getDatabase();
    const userId = db.user.id;

    db.user.cashlessCredit += amount;

    const methodLabel = paymentMethod === 'card' ? 'Kartou' : paymentMethod === 'benefits' ? 'Benefity' : 'Apple Pay';
    const now = new Date();
    const dateStr = `Dnes, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newTx: TransactionDbModel = {
      id: `tx-${Date.now()}`,
      userId,
      title: `Dobití NFC Kredit - ${methodLabel}`,
      type: 'topup',
      dateStr,
      amount,
      isPositive: true,
      status: 'Dokončeno',
      timestamp: now.toISOString()
    };

    db.transactions.unshift(newTx);

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      userBalance: db.user.cashlessCredit,
      transaction: newTx,
      transactions: db.transactions.filter((t) => t.userId === userId)
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
