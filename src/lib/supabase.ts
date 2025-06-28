import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface UserProfile {
  id: string
  user_id: string
  name: string | null
  email: string | null
  created_at: string
  updated_at: string
}

export interface UserData {
  id: string
  user_id: string
  data_type: string
  data: any
  created_at: string
  updated_at: string
}