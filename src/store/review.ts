import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { ReviewRecord } from '@/shared/lib/db/record'

export type ReviewModeInfo = {
  isReviewMode: boolean
  reviewRecord?: ReviewRecord
}

export const reviewModeInfoAtom = atomWithStorage<ReviewModeInfo>('reviewModeInfo', {
  isReviewMode: false,
  reviewRecord: undefined,
})

export const isReviewModeAtom = atom((get) => get(reviewModeInfoAtom).isReviewMode)
