const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://quflfbtlkipmbgaqlqgo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZmxmYnRsa2lwbWJnYXFscWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTAxNTgsImV4cCI6MjA5NjU4NjE1OH0.mk-9FeXDI1AUOec9w0z2TnFSukY1d2D5Rf-3HOQg2aU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function makeAdmin() {
  console.log('Logging in...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'pereman0813@gmail.com',
    password: 'Tino2009'
  });

  if (authError) {
    console.error('Login failed:', authError.message);
    return;
  }

  const userId = authData.user.id;
  console.log('User logged in. ID:', userId);

  console.log('Updating profile role to admin...');
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', userId);

  if (error) {
    console.error('Failed to update role:', error.message);
  } else {
    console.log('Successfully updated role to admin!');
  }
}

makeAdmin();
