import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { UserDbModel } from '@/lib/db/schema';

const DEMO_USERS: Record<string, UserDbModel> = {
  'usr-1': {
    id: 'usr-1',
    username: 'novakjan',
    handle: '@novakjan',
    fullName: 'Jan Novák',
    avatarUrl: '/images/avatar.jpg',
    bio: 'Festival enthusiast & music lover',
    memberTier: 'VIP Gold',
    cashlessCredit: 2360,
    isGuest: false,
    phoneNumber: '+420 777 123 456'
  },
  'usr-2': {
    id: 'usr-2',
    username: 'klara_s',
    handle: '@klarasvoboda',
    fullName: 'Klára Svobodová',
    avatarUrl: '/images/metronome_festival.jpg',
    bio: 'Live concerts & techno vibes',
    memberTier: 'VIP Silver',
    cashlessCredit: 1200,
    isGuest: false,
    phoneNumber: '+420 608 987 654'
  },
  'guest': {
    id: 'usr-guest',
    username: 'host',
    handle: '@host_4921',
    fullName: 'Host / Návštěvník',
    avatarUrl: '/images/avatar.jpg',
    bio: 'Procházím akce bez registrácie',
    memberTier: 'Guest Pass',
    cashlessCredit: 0,
    isGuest: true
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, phoneNumber, otpCode, passkeyToken, targetUserId } = body;

    const db = getDatabase();

    if (action === 'switch_demo') {
      const targetUser = DEMO_USERS[targetUserId] || DEMO_USERS['usr-1'];
      db.user = { ...targetUser };
      saveDatabase(db);
      return NextResponse.json({
        success: true,
        user: db.user
      });
    }

    if (action === 'passkey') {
      // Simulate/process WebAuthn Passkey login
      const newUser: UserDbModel = {
        id: `usr-pk-${Date.now()}`,
        username: 'passkey_user',
        handle: '@passkey_member',
        fullName: 'Passkey Uživatel',
        avatarUrl: '/images/avatar.jpg',
        memberTier: 'VIP Member',
        cashlessCredit: 500,
        isGuest: false
      };
      db.user = newUser;
      saveDatabase(db);
      return NextResponse.json({
        success: true,
        user: db.user,
        message: 'Přihlášeno přes Touch ID / Face ID Passkey'
      });
    }

    if (action === 'phone_otp') {
      if (!phoneNumber) {
        return NextResponse.json({ success: false, error: 'Telefonní číslo je povinné' }, { status: 400 });
      }

      // Create or log in user by phone number
      const newUser: UserDbModel = {
        id: `usr-ph-${Date.now()}`,
        username: `user_${phoneNumber.replace(/\D/g, '').slice(-4)}`,
        handle: `@mobile_${phoneNumber.replace(/\D/g, '').slice(-4)}`,
        fullName: `Uživatel (${phoneNumber})`,
        avatarUrl: '/images/avatar.jpg',
        memberTier: 'Standard Member',
        cashlessCredit: 250,
        isGuest: false,
        phoneNumber
      };

      db.user = newUser;
      saveDatabase(db);
      return NextResponse.json({
        success: true,
        user: db.user,
        message: `Telefonní číslo ${phoneNumber} ověřeno`
      });
    }

    if (action === 'guest') {
      db.user = { ...DEMO_USERS['guest'] };
      saveDatabase(db);
      return NextResponse.json({
        success: true,
        user: db.user
      });
    }

    return NextResponse.json({ success: false, error: 'Neznámá akce' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
