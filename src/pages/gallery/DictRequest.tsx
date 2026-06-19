import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import IconBook2 from '~icons/tabler/book-2';

export default function DictRequest() {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setShowPanel(true)}>
        <IconBook2 />
        <span>词库征集</span>
      </Button>

      <Dialog open={showPanel} onOpenChange={setShowPanel}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle className="flex items-center gap-3">
            <span className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <IconBook2 className="h-5 w-5" />
            </span>
            词库征集
          </DialogTitle>

          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 text-sm font-semibold">提交自定义词库</h4>
              <p className="text-muted-foreground text-sm">
                想补充新词库，可以先阅读
                <a
                  href="https://github.com/Kaiyiwing/qwerty-learner/blob/master/docs/toBuildDict.md"
                  className="text-primary mx-1 font-medium hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  词库制作说明
                </a>
                后再提交。
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-2 text-sm font-semibold">试试 QwertyLearner.ai</h4>
              <p className="text-muted-foreground text-sm">
                需要更快整理词条、释义或例句时，可以用它辅助生成和整理内容。
              </p>
              <Button
                className="mt-4 w-full"
                onClick={() => {
                  window.open('https://qwertylearner.ai', '_blank');
                  setShowPanel(false);
                }}
              >
                打开 QwertyLearner.ai
              </Button>
            </div>

            <div className="border-destructive/20 bg-destructive/10 rounded-lg border px-4 py-3 text-xs">
              QwertyLearner.ai 不是内置服务。
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
