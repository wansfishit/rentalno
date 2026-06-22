const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://quflfbtlkipmbgaqlqgo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZmxmYnRsa2lwbWJnYXFscWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTAxNTgsImV4cCI6MjA5NjU4NjE1OH0.mk-9FeXDI1AUOec9w0z2TnFSukY1d2D5Rf-3HOQg2aU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runQueries() {
  console.log('--- 1. Profiles Table Info ---');
  const { data: pData, error: pError } = await supabase.rpc('get_table_info', { table_name: 'profiles' });
  if (pError) {
    // If get_table_info RPC doesn't exist, we can try running a custom SQL block if we can,
    // or select columns via standard query
    console.error('get_table_info RPC failed. Trying direct query...');
  }

  // Let's try to query the schema info by selecting from a system view if possible,
  // or just get info about the profiles table RLS status by testing operations
  console.log('Testing insert policy:');
  const testId = '00000000-0000-0000-0000-000000000000';
  const { error: insError } = await supabase.from('profiles').insert({ id: testId, username: 'test_user' });
  console.log('Direct insert error (expected to fail if RLS/auth is required):', insError);
}

runQueries();
