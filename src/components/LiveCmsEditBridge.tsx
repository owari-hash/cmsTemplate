'use client'

import { useEffect } from 'react'

export const CMS_LIVE_EDIT_SELECT = 'cms-live-edit-select'
export const CMS_LIVE_EDIT_TEXT = 'cms-live-edit-text'

type PostMessage = { type: string; [k: string]: unknown }

export function LiveCmsEditBridge({ parentOrigin }: { parentOrigin: string }) {
  useEffect(() => {
    const target = parentOrigin

    const post = (msg: PostMessage) => {
      try {
        window.parent?.postMessage(msg, target)
      } catch {
        window.parent?.postMessage(msg, '*')
      }
    }

    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null
      if (!el) return
      const root = el.closest('[data-instance-id]')
      if (!root) return
      const instanceId = root.getAttribute('data-instance-id')
      if (!instanceId) return
      post({ type: CMS_LIVE_EDIT_SELECT, instanceId })
    }

    const onDblClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(
        '[data-cms-editable]',
      ) as HTMLElement | null
      const root = el?.closest('[data-instance-id]')
      if (!el || !root) return
      const instanceId = root.getAttribute('data-instance-id')
      const field = el.getAttribute('data-cms-field') || ''
      if (!instanceId || !field) return
      e.preventDefault()
      e.stopPropagation()
      el.contentEditable = 'true'
      el.style.outline = '2px solid #6366f1'
      el.style.outlineOffset = '2px'
      el.focus()
      const onBlur = () => {
        el.contentEditable = 'false'
        el.style.outline = ''
        el.style.outlineOffset = ''
        post({
          type: CMS_LIVE_EDIT_TEXT,
          instanceId,
          field,
          value: el.textContent?.trim() ?? '',
        })
      }
      el.addEventListener('blur', onBlur, { once: true })
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('dblclick', onDblClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('dblclick', onDblClick, true)
    }
  }, [parentOrigin])

  return null
}
