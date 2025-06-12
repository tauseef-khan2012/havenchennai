import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// TODO: ensure env vars are provided in deployment environment

export const supabase = createClient(supabaseUrl, supabaseKey)

