import type { ComponentProps, FC } from 'react'
import { CMSPage } from '@cms-builder/core'

/** CMSPage + `liveEdit` until the installed `@cms-builder/core` types include it. */
export const CMSPageWithLive = CMSPage as FC<
  ComponentProps<typeof CMSPage> & { liveEdit?: boolean }
>
