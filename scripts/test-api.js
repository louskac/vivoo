// Force ignoring self-signed certificate errors for local HTTPS testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const PORT = 8443;
const BASE_URL = `https://localhost:${PORT}`;

async function runTests() {
  console.log('🧪 Starting API & Database Integration Tests...');
  const testUser = {
    username: `test_user_${Date.now()}`,
    password: 'Password123',
    fullName: 'Test User Profile',
    bio: 'Test bio for SQLite DB'
  };

  let token = null;

  // Helper fetch function
  async function api(path, options = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { ...headers, ...options.headers }
    });
    const data = await response.json();
    if (!response.ok || data.success === false) {
      throw new Error(data.error || `HTTP error ${response.status}`);
    }
    return data;
  }

  try {
    // 1. Testing Apple Biometric Sign-In
    console.log('\n1. Testing Apple ID Biometric Registration...');
    const appleRes = await api('/api/auth/apple', {
      method: 'POST',
      body: JSON.stringify({})
    });
    console.log('✅ Apple OAuth signup successful. Username:', appleRes.user.username);
    
    // 2. Testing OTP Onboarding Send
    console.log('\n2. Testing OTP Send...');
    const testIdentity = `test_otp_${Date.now()}@gmail.com`;
    const sendRes = await api('/api/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ identity: testIdentity })
    });
    console.log('✅ OTP code sent successfully:', sendRes.message);

    // 2.5 Testing OTP Verification
    console.log('\n2.5 Testing OTP Verification & Login...');
    const verifyRes = await api('/api/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ identity: testIdentity, code: '1234' })
    });
    console.log('✅ OTP verification successful. Registered Name:', verifyRes.user.full_name);
    
    // Set token for subsequent tests
    token = verifyRes.user.id;

    // 3. GET PROFILE ME
    console.log('\n3. Testing Get User Profile details...');
    const meRes = await api('/api/auth/me');
    console.log('✅ Get profile successful. Cashless balance:', meRes.user.cashless_credit);

    // 4. GET EVENTS
    console.log('\n4. Testing Get Events & Sectors...');
    const eventsRes = await api('/api/events');
    console.log('✅ Get events successful. Number of events:', eventsRes.events.length);
    const firstEvent = eventsRes.events[0];
    console.log(`- First Event: ${firstEvent.title} (Sectors: ${firstEvent.sectors.length})`);

    // 5. BUY TICKET
    console.log('\n5. Testing Ticket Purchase (direct)...');
    const firstSector = firstEvent.sectors[0];
    const buyRes = await api('/api/tickets/purchase', {
      method: 'POST',
      body: JSON.stringify({
        eventId: firstEvent.id,
        sectorName: firstSector.name,
        price: firstSector.price,
        holderName: testUser.fullName,
        isGroup: false
      })
    });
    console.log('✅ Ticket purchase successful!');
    console.log('- Purchased Ticket ID:', buyRes.ticket.id);
    console.log('- New Cashless Credit:', buyRes.newCredit);

    // 6. GET TICKETS
    console.log('\n6. Testing Get Purchased Tickets...');
    const ticketsRes = await api('/api/tickets');
    console.log('✅ Get tickets successful. User tickets count:', ticketsRes.tickets.length);
    console.log('- Ticket in wallet:', ticketsRes.tickets[0].id, '-', ticketsRes.tickets[0].seat.name);

    // 7. GET ACTIVITIES LOG
    console.log('\n7. Testing Get Cashless Activities...');
    const activitiesRes = await api('/api/wallet/activities');
    console.log('✅ Get activities successful. Activities count:', activitiesRes.activities.length);
    activitiesRes.activities.forEach(a => {
      console.log(`- [${a.type}] ${a.title}: ${a.amount} CZK (${a.time})`);
    });

    // 8. TEST SCAN TICKET
    console.log('\n8. Testing Ticket Scan...');
    const scanRes = await api('/api/tickets/scan', { method: 'POST' });
    console.log('✅ Ticket scan endpoint returned successfully');
    const updatedTicketsRes = await api('/api/tickets');
    console.log('- Updated ticket scan status:', updatedTicketsRes.tickets[0].isScanned ? 'SCANNED' : 'ACTIVE');

    // 8.5 UPDATE CREDIT (top up)
    console.log('\n8.5 Testing Cashless Top Up...');
    const topupRes = await api('/api/wallet/update', {
      method: 'POST',
      body: JSON.stringify({
        amount: 500,
        title: 'Top Up for Split Buy Test',
        type: 'reward'
      })
    });
    console.log('✅ Top up successful. New credit:', topupRes.newCredit);

    // 9. SPLIT PAYMENTS / GROUP BUY
    console.log('\n9. Testing Split Payment / Group Buy...');
    const splitRes = await api('/api/split/create', {
      method: 'POST',
      body: JSON.stringify({
        eventId: firstEvent.id,
        sectorName: firstSector.name,
        price: firstSector.price,
        totalSeats: 3
      })
    });
    console.log('✅ Split booking created successfully. Room code:', splitRes.sessionId);
    
    // Check split session details
    const splitStatusRes = await api(`/api/split/status?sessionId=${splitRes.sessionId}`);
    console.log('✅ Split session status retrieved successfully. Paid count:', splitStatusRes.session.paidSeats);
    
    // Find guest friend Honza to simulate split payment
    const honza = splitStatusRes.members.find(m => m.name === 'Honza');
    console.log('- Simulating payment for Friend Honza...');
    const payRes = await api('/api/split/pay', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: splitRes.sessionId,
        memberId: honza.id
      })
    });
    console.log('✅ Honza payment successful. New paid count:', payRes.newPaidCount);

    console.log('\n🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉');
  } catch (err) {
    console.error('\n❌ Test execution failed:', err);
    process.exit(1);
  }
}

runTests();
