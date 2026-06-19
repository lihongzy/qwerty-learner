import { useContext, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TypingContext, TypingStateActionType } from '@/pages/typing/store';
import IconCog6Tooth from '~icons/heroicons/cog-6-tooth-solid';
import IconEye from '~icons/heroicons/eye-solid';
import IconAdjustmentsHorizontal from '~icons/tabler/adjustments-horizontal';
import IconDatabaseCog from '~icons/tabler/database-cog';
import IconEar from '~icons/tabler/ear';
import AdvancedSetting from './AdvancedSetting';
import DataSetting from './DataSetting';
import SoundSetting from './SoundSetting';
import ViewSetting from './ViewSetting';

const tabs = [
  { key: 'sound', label: '声音', icon: IconEar, panel: <SoundSetting /> },
  { key: 'advanced', label: '高级', icon: IconAdjustmentsHorizontal, panel: <AdvancedSetting /> },
  { key: 'view', label: '显示', icon: IconEye, panel: <ViewSetting /> },
  { key: 'data', label: '数据', icon: IconDatabaseCog, panel: <DataSetting /> },
] as const;

export default function Setting() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('sound');
  const { dispatch } = useContext(TypingContext)!;

  function openModal() {
    setIsOpen(true);
    dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: false });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <button
        type="button"
        onClick={openModal}
        className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center rounded-md p-0.5 text-lg transition-colors"
      >
        <IconCog6Tooth />
      </button>

      <DialogContent className="overflow-hidden p-0 sm:max-w-2xl">
        <div className="flex h-120">
          <div className="flex w-48 flex-col gap-1 border-r p-3">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors ${
                  activeTab === key
                    ? 'bg-muted font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto">{tabs.find((t) => t.key === activeTab)?.panel}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
