'use client'

import { useEffect } from 'react'
import {
  CMS_LIVE_EDIT_SELECT,
  CMS_LIVE_EDIT_TEXT,
  CMS_LIVE_EDIT_HIGHLIGHT,
} from '@/lib/liveEditMessageTypes'

type PostMessage = { type: string; [k: string]: unknown }

const PREVIEW_STYLE_ID = 'cms-admin-preview-styles'

function applySelectionHighlight(instanceId: string | null) {
  document.querySelectorAll('[data-cms-selected="1"]').forEach((n) => {
    n.removeAttribute('data-cms-selected')
  })
  if (!instanceId) return
  document.querySelectorAll('[data-instance-id]').forEach((node) => {
    if (node.getAttribute('data-instance-id') === instanceId) {
      node.setAttribute('data-cms-selected', '1')
      ;(node as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  })
}

export function LiveCmsEditBridge({ parentOrigin }: { parentOrigin: string }) {
  useEffect(() => {
    if (document.getElementById(PREVIEW_STYLE_ID)) return
    const el = document.createElement('style')
    el.id = PREVIEW_STYLE_ID
    el.textContent = `
      html[data-cms-admin-preview="1"] [data-instance-id] { cursor: pointer; }
      html[data-cms-admin-preview="1"] [data-instance-id]:hover {
        outline: 2px dashed rgba(99, 102, 241, 0.45);
        outline-offset: 2px;
      }
      html[data-cms-admin-preview="1"] [data-instance-id][data-cms-selected="1"] {
        outline: 2px solid rgb(99, 102, 241);
        outline-offset: 2px;
      }
    `
    document.head.appendChild(el)
    document.documentElement.setAttribute('data-cms-admin-preview', '1')
    return () => {
      document.documentElement.removeAttribute('data-cms-admin-preview')
      el.remove()
    }
  }, [])

  useEffect(() => {
    const target = parentOrigin

    const post = (msg: PostMessage) => {
      if (!window.parent) return
      const t = target || '*'
      try {
        window.parent.postMessage(msg, t)
      } catch {
        try {
          window.parent.postMessage(msg, '*')
        } catch {
          /* ignore */
        }
      }
    }

    const onParentMessage = (e: MessageEvent) => {
      if (e.source !== window.parent) return
      if (parentOrigin && e.origin !== parentOrigin) return
      const d = e.data as { type?: string; instanceId?: string | null }
      if (!d || d.type !== CMS_LIVE_EDIT_HIGHLIGHT) return
      const id = typeof d.instanceId === 'string' ? d.instanceId : null
      applySelectionHighlight(id)
    }

    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null
      if (!el) return
      const root = el.closest('[data-instance-id]')
      if (!root) return
      const instanceId = root.getAttribute('data-instance-id')
      if (!instanceId) return
      if (el.closest('a[href]')) {
        e.preventDefault()
        e.stopPropagation()
      }
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

    window.addEventListener('message', onParentMessage)
    document.addEventListener('click', onClick, true)
    document.addEventListener('dblclick', onDblClick, true)
    return () => {
      window.removeEventListener('message', onParentMessage)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('dblclick', onDblClick, true)
    }
  }, [parentOrigin])

  return null
}
