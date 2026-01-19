'use client'

import { cn } from '@/lib/utils'
import CheckIcon from '@/components/icons/CheckIcon'
import { useTranslations } from '@/i18n/client'

/**
 * Left side content for enhanced result card header.
 * Shows success indicator and "Enhanced Prompt" label.
 */
export default function EnhanceResultInfo() {
  const dict = useTranslations()
  const t = dict.enhance

  return (
    <>
      <div
        className={cn(
          'w-6',
          'h-6',
          'flex',
          'items-center',
          'justify-center',
          'bg-emerald-100',
          'rounded-full',
        )}
      >
        <CheckIcon className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
      </div>
      <h3
        className={cn(
          'text-sm',
          'sm:text-base',
          'font-semibold',
          'text-emerald-900',
          'whitespace-nowrap',
        )}
      >
        {t.result.title}
      </h3>
    </>
  )
}
