import { useEffect, useState } from 'react';
import { useDonateStats } from './useDonateStats';
import { DonateMilestoneDialog } from './DonateMilestoneDialog';
import { shouldPromptDonate } from './donate-card.logic';

export const DonateCard = () => {
  const [show, setShow] = useState(false);
  const { stats: donateStats } = useDonateStats();

  useEffect(() => {
    if (!donateStats) {
      return;
    }

    setShow(shouldPromptDonate(donateStats.chapterNumber));
  }, [donateStats]);

  if (!donateStats) {
    return null;
  }

  return (
    <DonateMilestoneDialog
      chapterNumber={donateStats.chapterNumber}
      dayFromFirstWord={donateStats.dayFromFirstWord}
      wordNumber={donateStats.wordNumber}
      sumWrongCount={donateStats.sumWrongCount}
      open={show}
      onOpenChange={setShow}
    />
  );
};
