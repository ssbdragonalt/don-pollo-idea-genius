// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://dpmvhdmlrfgkktobhfiu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwbXZoZG1scmZna2t0b2JoZml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5ODY1ODUsImV4cCI6MjA0ODU2MjU4NX0.lSjmNadwTSUsfOijr2W5-UG92THoNJQcrn57GDKX8YA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);