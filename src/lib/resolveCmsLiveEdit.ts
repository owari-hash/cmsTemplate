import { firstSearchParam } from './resolveCmsProject';

/**
 * Inline iframe editing from client admin (postMessage).
 * Requires ?cmsLiveEdit=1&parentOrigin=https%3A%2F%2F... (admin origin).
 * If CMS_PREVIEW_TOKEN is set on the server, ?cmsPreviewToken= must match (same as dynamic project).
 */
export function resolveCmsLiveEditEnabled(
  searchParams: Record<string, string | string[] | undefined>,
): boolean {
  if (firstSearchParam(searchParams.cmsLiveEdit) !== '1') return false
  const secret = process.env.CMS_PREVIEW_TOKEN
  if (secret) {
    return firstSearchParam(searchParams.cmsPreviewToken) === secret
  }
  return true
}

export function resolveCmsLiveEditParentOrigin(
  searchParams: Record<string, string | string[] | undefined>,
): string | null {
  const raw = firstSearchParam(searchParams.parentOrigin)
  if (!raw?.trim()) return null
  try {
    return new URL(raw).origin
  } catch {
    return null
  }
}
