// btoa/atob are available in both Node.js 18+ and browser
export function encodeNewsSlug(url: string): string {
  return btoa(url).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export function decodeNewsSlug(slug: string): string {
  const base64 = slug.replace(/-/g, '+').replace(/_/g, '/')
  const padded  = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return atob(padded)
}
