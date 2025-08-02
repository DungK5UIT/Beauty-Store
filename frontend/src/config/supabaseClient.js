
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://xfswcnmwovkwdwimszov.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhmc3djbm13b3Zrd2R3aW1zem92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMTcxODQsImV4cCI6MjA2OTU5MzE4NH0.oh48YykLXpmCJjViSGREYIwG98JjQFwc2VHX9SiQB7w';
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase