import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useDonateStats } from './useDonateStats'
import { DonateMilestoneDialog } from './DonateMilestoneDialog'
import { shouldPromptDonate } from './donate-card.logic'
import { DONATE_DATE } from '@/shared/constants'

export const DonateCard = () => {
  const [show, setShow] = useState(false)
  const donateStats = useDonateStats()

  const onClickHasDonated = () => {
    setShow(false)
    window.localStorage.setItem(DONATE_DATE, dayjs().format())
  }

  const onClickRemindMeLater = () => {
    setShow(false)
  }

  useEffect(() => {
    if (!donateStats) {
      return
    }

    // Only show the prompt after the aggregate stats are ready, so the dialog
    // doesn't flash open on the initial render with placeholder values.
    const storedDate = window.localStorage.getItem(DONATE_DATE)
    setShow(shouldPromptDonate(donateStats.chapterNumber, storedDate))
  }, [donateStats])

  if (!donateStats) {
    return null
  }

  return (
    <DonateMilestoneDialog
      chapterNumber={donateStats.chapterNumber}
      dayFromFirstWord={donateStats.dayFromFirstWord}
      wordNumber={donateStats.wordNumber}
      sumWrongCount={donateStats.sumWrongCount}
      open={show}
      onRemindMeLater={onClickRemindMeLater}
      onHasDonated={onClickHasDonated}
    />
  )
}
