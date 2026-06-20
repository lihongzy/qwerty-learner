const DONATE_CHAPTER_INTERVAL = 10;

export function isDonateMilestone(chapterNumber: number | undefined) {
  return Boolean(chapterNumber && chapterNumber % DONATE_CHAPTER_INTERVAL === 0);
}

export function shouldPromptDonate(chapterNumber: number | undefined) {
  // 每完成 10 章即弹出捐赠提示。
  return isDonateMilestone(chapterNumber);
}
