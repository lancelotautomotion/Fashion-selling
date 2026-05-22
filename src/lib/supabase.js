import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mgmrughdltfrdaemnuld.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nbXJ1Z2hkbHRmcmRhZW1udWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzOTc1MjUsImV4cCI6MjA5NDk3MzUyNX0.TZsLCmOxBFEcKY7tVMWpNH_VzMqnKjAo958jAuEmNuU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
