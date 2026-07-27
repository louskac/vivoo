import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { TicketDbModel, TransactionDbModel } from '@/lib/db/schema';

export async function GET() {
  try {
    const db = getDatabase();
    const userId = db.user.id;
    const tickets = db.tickets.filter((t) => t.userId === userId);

    return NextResponse.json({
      success: true,
      tickets
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, eventTitle, location, date, bgImg, tier, quantity, totalPrice, sectorName } = body;

    if (!eventId || !eventTitle || !totalPrice) {
      return NextResponse.json({ success: false, error: 'Missing required ticket parameters' }, { status: 400 });
    }

    const db = getDatabase();
    const userId = db.user.id;

    if (db.user.cashlessCredit < totalPrice) {
      return NextResponse.json({ success: false, error: 'Nedostatečný zůstatek kreditu' }, { status: 400 });
    }

    // Deduct credit
    db.user.cashlessCredit -= totalPrice;

    // Create ticket
    const newTicket: TicketDbModel = {
      id: `tkt-${Date.now()}`,
      userId,
      eventId,
      eventTitle,
      location: location || 'Praha',
      date: date || 'Dnes',
      bgImg: bgImg || '/images/metronome_festival.jpg',
      tier: tier || 'standard',
      quantity: quantity || 1,
      totalPrice,
      sectorName: sectorName || 'Standard',
      qrCode: `VIVOO-${eventId.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    db.tickets.unshift(newTicket);

    // Create transaction log
    const now = new Date();
    const dateStr = `Dnes, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newTx: TransactionDbModel = {
      id: `tx-${Date.now()}`,
      userId,
      title: `Nákup Vstupenky: ${eventTitle}`,
      type: 'ticket',
      dateStr,
      amount: totalPrice,
      isPositive: false,
      status: 'Dokončeno',
      timestamp: now.toISOString()
    };

    db.transactions.unshift(newTx);

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      ticket: newTicket,
      userBalance: db.user.cashlessCredit,
      tickets: db.tickets.filter((t) => t.userId === userId),
      transactions: db.transactions.filter((tx) => tx.userId === userId)
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
