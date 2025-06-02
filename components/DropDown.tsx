// design-system/dropdown-menu.tsx
import * as DropdownMenu from 'zeego/dropdown-menu'

export const DropdownMenuRoot = DropdownMenu.Root
export const DropdownMenuTrigger = DropdownMenu.Trigger
export const DropdownMenuContent = DropdownMenu.Content
export const DropdownMenuItemTitle = DropdownMenu.ItemTitle
// notice that we're using the `create()` function
export const DropdownMenuItem = DropdownMenu.create(
  (props: React.ComponentProps<typeof DropdownMenu.Item>) => (
    <DropdownMenu.Item {...props} style={{ height: 34 }} />
  ),
  'Item'
)
export const DropdownMenuCheckboxItem = DropdownMenu.CheckboxItem
export const DropdownMenuRadioItem = DropdownMenu.RadioItem
export const DropdownMenuRadioGroup = DropdownMenu.RadioGroup
export const DropdownMenuLabel = DropdownMenu.Label
export const DropdownMenuSeparator = DropdownMenu.Separator
export const DropdownMenuSub = DropdownMenu.Sub
export const DropdownMenuSubTrigger = DropdownMenu.SubTrigger
export const DropdownMenuSubContent = DropdownMenu.SubContent
