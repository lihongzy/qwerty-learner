import standTypingHandPosition from '@/assets/standard_typing_hand_position.png';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import IconKeyboard from '~icons/ic/round-keyboard';

export default function HandPositionIllustration() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <button
        type="button"
        className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-0.5 text-lg transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <IconKeyboard />
      </button>

      <DialogContent className="overflow-hidden p-0 sm:max-w-2xl">
        <DialogTitle className="px-6 pt-6 text-center text-xl font-semibold">推荐打字指法图示</DialogTitle>
        <div className="p-6 pt-4">
          <img className="block w-full rounded-lg" src={standTypingHandPosition} alt="标准打字手型图示" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
