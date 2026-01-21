/**
 * Generates a public URL for an image stored in Supabase storage.
 * @param bucket - The Supabase storage bucket name
 * @param path - The file path within the bucket
 * @returns The public URL for the image
 */
export const getPublicImage = (bucket: string, path: string): string => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string

  if (!supabaseUrl) {
    console.error('Supabase URL missing in runtime config')
    return ''
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`
}
