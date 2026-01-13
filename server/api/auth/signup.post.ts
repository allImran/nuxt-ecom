import { supabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, data } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required',
    })
  }

  const { data: user, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: data || {},
    },
  })

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    })
  }

  return { user }
})
