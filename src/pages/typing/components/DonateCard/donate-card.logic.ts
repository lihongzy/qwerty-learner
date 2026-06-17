import dayjs from 'dayjs'

const DONATE_CHAPTER_INTERVAL = 10
const DONATE_REMINDER_INTERVAL_DAYS = 60

export function isDonateMilestone(chapterNumber: number | undefined) {
  return Boolean(chapterNumber && chapterNumber % DONATE_CHAPTER_INTERVAL === 0)
}

export function shouldPromptDonate(chapterNumber: number | undefined, storedDate: string | null) {
  // Only prompt at milestone chapters, and don't repeat too frequently.
  if (!isDonateMilestone(chapterNumber)) {
    return false
  }

  if (!storedDate) {
    return true
  }

  return dayjs().diff(dayjs(storedDate), 'day') > DONATE_REMINDER_INTERVAL_DAYS
}
