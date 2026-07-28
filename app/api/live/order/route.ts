import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, items, totalAmount } = body;

    const db = getDatabase();
    if (db.user.cashlessCredit < totalAmount) {
      return NextResponse.json({ success: false, error: 'Nedostatečný zůstatek kreditu pro Express Bar.' }, { status: 400 });
    }

    // Deduct credit
    db.user.cashlessCredit -= totalAmount;

    // Generate random pickup code e.g. "BAR-492"
    const pickupCode = `BAR-${Math.floor(100 + Math.random() * 900)}`;

    const orderId = `exp-${Date.now()}`;
    const itemsSummary = items.map((i: any) => `${i.quantity}x ${i.item.name}`).join(', ');

    const newOrder = {
      id: orderId,
      userId: db.user.id,
      eventId: eventId || 'derby',
      itemsSummary,
      totalAmount,
      pickupCode,
      status: 'ready' as const,
      createdAt: new Date().toISOString()
    };

    if (!db.expressOrders) db.expressOrders = [];
    db.expressOrders.unshift(newOrder);

    // Record NFC Transaction
    db.transactions.unshift({
      id: `tx-${Date.now()}`,
      userId: db.user.id,
      title: `Express Bar: ${itemsSummary}`,
      type: 'nfc',
      dateStr: 'Právě teď',
      amount: totalAmount,
      isPositive: false,
      status: 'Dokončeno',
      timestamp: new Date().toISOString()
    });

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      order: newOrder,
      userBalance: db.user.cashlessCredit,
      transactions: db.transactions
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
