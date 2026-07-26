import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid top-up amount' }, { status: 400 });
    }

    // In production, this executes DB transaction:
    // UPDATE users SET cashless_credit = cashless_credit + amount WHERE id = userId;
    // INSERT INTO activities (user_id, type, title, time, amount) VALUES (...);

    return NextResponse.json({
      success: true,
      added: amount,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
