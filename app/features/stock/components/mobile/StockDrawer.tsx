import { StockForm } from '../StockForm'
import { MaterialPalette } from '../MaterialPalette' // ★追加
import { ScrollArea } from '~/components/ui/scroll-area'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '~/components/ui/drawer'

/**
 * @description モバイル画面用ののコンポーネント。ストックの追加フォームと資材パレットを表示するドロワーを表示。
 * @param param0 
 * @returns 
 */
export function StockDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* h-[85vh] で全体の高さを制限 */}
      <DrawerContent className="drawer-stock-content">
        {/* 引き手バー（自動で出ますが、念のため中身をflex-colで制御） */}

        <DrawerHeader className="px-8 py-6 shrink-0">
          <DrawerTitle className="text-drawer-title">
            Material Stock
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-8 mb-6 shrink-0">
          <StockForm />
        </div>

        <div className="scroll-area-container px-8 pb-10">
          <ScrollArea className="h-full w-full">
            <div className="pr-4">
              <MaterialPalette />
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  )
}