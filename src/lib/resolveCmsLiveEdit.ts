import { firstSearchParam } from './resolveCmsProject'

function cmsLiveEditQueryOn(
  searchParams: Record<string, string | string[] | undefined>,
): boolean {
  const v = firstSearchParam(searchParams.cmsLiveEdit)
  if (!v) return false
  const s = v.trim().toLowerCase()
  return s === '1' || s === 'true' || s === 'yes'
}

/**
 * postMessage bridge (clicks → parent, highlights from parent).
 * On when the admin iframe URL includes cmsLiveEdit + a valid parentOrigin.
 * Does not require CMS_PREVIEW_TOKEN — so block pick / sidebar sync works even
 * when the preview token is missing or wrong. Token still gates {@link resolveCmsLiveEditContentMode}.
 */
export function resolveCmsLiveEditBridgeActive(
  searchParams: Record<string, string | string[] | undefined>,
): boolean {
  if (!cmsLiveEditQueryOn(searchParams)) return false
  return resolveCmsLiveEditParentOrigin(searchParams) !== null
}

/**
 * Rich preview mode on CMSPage (data-cms-editable, outline-friendly wrappers).
 * Stricter: CMS_PREVIEW_TOKEN must match when that env is set, unless
 * CMS_LIVE_EDIT_TRUST_PARENT_ORIGIN=true.
 */
export function resolveCmsLiveEditContentMode(
  searchParams: Record<string, string | string[] | undefined>,
): boolean {
  if (!cmsLiveEditQueryOn(searchParams)) return false
  if (process.env.CMS_LIVE_EDIT_TRUST_PARENT_ORIGIN === 'true') return true
  const secret = process.env.CMS_PREVIEW_TOKEN
  if (secret) {
    return firstSearchParam(searchParams.cmsPreviewToken) === secret
  }
  return true
}

/** @deprecated use resolveCmsLiveEditContentMode */
export function resolveCmsLiveEditEnabled(
  searchParams: Record<string, string | string[] | undefined>,
): boolean {
  return resolveCmsLiveEditContentMode(searchParams)
}

export function resolveCmsLiveEditParentOrigin(
  searchParams: Record<string, string | string[] | undefined>,
): string | null {
  const raw = firstSearchParam(searchParams.parentOrigin)
  if (!raw?.trim()) return null
  const trimmed = raw.trim()
  const candidates = [trimmed]
  try {
    const dec = decodeURIComponent(trimmed)
    if (dec !== trimmed) candidates.push(dec)
  } catch {
    /* ignore */
  }
  for (const c of candidates) {
    try {
      return new URL(c).origin
    } catch {
      /* try next */
    }
  }
  return null
}
