/**
 * Picks CMS project for this request.
 * `?project=` is honored when `CMS_DYNAMIC_PROJECT=true` (server) **or**
 * `NEXT_PUBLIC_CMS_USE_PROJECT_PARAM=true` (build-time) so the public template
 * and admin iframes stay aligned without two separate envs.
 * If `CMS_PREVIEW_TOKEN` is set, `?cmsPreviewToken=` must match or the default project is used.
 */
const PROJECT_RE = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/

function canUseProjectQueryParam(): boolean {
  return (
    process.env.CMS_DYNAMIC_PROJECT === 'true' ||
    process.env.NEXT_PUBLIC_CMS_USE_PROJECT_PARAM === 'true'
  )
}

export function firstSearchParam(
  v: string | string[] | undefined,
): string | undefined {
  if (v === undefined) return undefined
  return Array.isArray(v) ? v[0] : v
}

export function resolveCmsProject(
  searchParams: Record<string, string | string[] | undefined>,
): string {
  const fallback = process.env.NEXT_PUBLIC_PROJECT_NAME || 'default'
  if (!canUseProjectQueryParam()) return fallback

  const secret = process.env.CMS_PREVIEW_TOKEN
  if (secret) {
    const t = firstSearchParam(searchParams.cmsPreviewToken)
    if (t !== secret) return fallback
  }

  const p = firstSearchParam(searchParams.project)
  if (p && PROJECT_RE.test(p)) return p
  return fallback
}
