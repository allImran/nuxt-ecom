
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export const useSupabase = () => {
  if (supabaseInstance) return supabaseInstance

  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseKey = config.public.supabasePublishableKey as string

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key missing in runtime config')
    throw new Error('Supabase configuration missing')
  }

  supabaseInstance = createClient(supabaseUrl, supabaseKey)
  return supabaseInstance
}
