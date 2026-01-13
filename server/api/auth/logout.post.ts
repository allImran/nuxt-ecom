import { supabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  // Ideally, we would sign out the user from Supabase if we had their session.
  // Since this is a stateless API proxy, we primarily rely on the client to discard the token.
  // However, if we want to propagate the signout:
  
  // const { error } = await supabase.auth.signOut()
  
  // CAUTION: Using global supabase.auth.signOut() might affect other requests if using a shared instance with state.
  // Given the current setup, we'll just return success to indicate the client should clear its state.
  // Real stateless logout would require the access_token to be explicitly invalidated if Supabase supports that via Admin API.

  return { message: 'Logged out successfully' }
})
