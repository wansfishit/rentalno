const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://quflfbtlkipmbgaqlqgo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZmxmYnRsa2lwbWJnYXFscWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTAxNTgsImV4cCI6MjA5NjU4NjE1OH0.mk-9FeXDI1AUOec9w0z2TnFSukY1d2D5Rf-3HOQg2aU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testBookingFlow() {
  console.log('--- Testing Booking & Profile Flow (Smart Upsert) ---');
  
  // 1. Get a random car
  const { data: cars, error: carError } = await supabase.from('cars').select('id').limit(1);
  if (carError || !cars || cars.length === 0) {
    console.error('Failed to fetch a car:', carError);
    return;
  }
  const carId = cars[0].id;
  console.log('Selected car ID:', carId);

  const testUserId = '7b1373bf-f3cf-4299-87bb-dbff47bef057';
  const testGuestName = 'Test User ' + Math.floor(Math.random() * 1000);

  // 2. Smart Profile Setup
  console.log('Running Smart Profile Setup for:', testUserId);
  const { data: existingProfile, error: getError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', testUserId)
    .maybeSingle();

  if (getError) {
    console.error('Failed to query existing profile:', getError.message);
    return;
  }

  if (existingProfile) {
    console.log('Profile exists with role:', existingProfile.role, '. Updating username...');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username: testGuestName })
      .eq('id', testUserId);

    if (updateError) {
      console.error('FAIL: Profile update failed:', updateError.message);
      return;
    }
    console.log('SUCCESS: Profile updated successfully.');
  } else {
    console.log('Profile does not exist. Inserting with role user...');
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({ 
        id: testUserId,
        username: testGuestName,
        role: 'user'
      });

    if (insertError) {
      console.error('FAIL: Profile insert failed:', insertError.message);
      return;
    }
    console.log('SUCCESS: Profile inserted successfully.');
  }

  // 3. Test booking insertion
  console.log('Testing booking insertion...');
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const bookingData = {
    user_id: testUserId,
    car_id: carId,
    start_date: today.toISOString().split('T')[0],
    end_date: nextWeek.toISOString().split('T')[0],
    total_days: 7,
    total_price: 3500000,
    status: 'pending',
    notes: 'Testing booking flow with smart profile setup',
    guest_name: testGuestName,
    guest_phone: '081234567890',
    guest_address: '123 Test Street'
  };

  const { data: bookingResult, error: bookingError } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select();

  if (bookingError) {
    console.error('FAIL: Booking insertion failed:', bookingError.message);
    return;
  }
  console.log('SUCCESS: Booking insertion succeeded:', bookingResult);

  // Clean up test booking
  if (bookingResult && bookingResult.length > 0) {
    const { error: delError } = await supabase.from('bookings').delete().eq('id', bookingResult[0].id);
    if (delError) {
      console.error('Failed to clean up test booking:', delError.message);
    } else {
      console.log('Cleaned up test booking successfully.');
    }
  }
}

testBookingFlow();
