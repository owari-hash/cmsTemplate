/**
 * Picks CMS project for this request.
 * When CMS_DYNAMIC_PROJECT=true (server env), ?project= may override NEXT_PUBLIC_PROJECT_NAME.
 * If CMS_PREVIEW_TOKEN is set, ?cmsPreviewToken= must match or the default project is used.
 */
const PROJECT_RE = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/

function first(
  v: string | string[] | undefined,
): string | undefined {
  if (v === undefined) return undefined
  return Array.isArray(v) ? v[0] : v
}

export function resolveCmsProject(
  searchParams: Record<string, string | string[] | undefined>,
): string {
  const fallback = process.env.NEXT_PUBLIC_PROJECT_NAME || 'default'
  if (process.env.CMS_DYNAMIC_PROJECT !== 'true') return fallback

  const secret = process.env.CMS_PREVIEW_TOKEN
  if (secret) {
    const t = first(searchParams.cmsPreviewToken)
    if (t !== secret) return fallback
  }

  const p = first(searchParams.project)
  if (p && PROJECT_RE.test(p)) return p
  return fallback
}
