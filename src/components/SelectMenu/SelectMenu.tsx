import type { ReactElement, ReactNode } from "react"
import { Menu } from "@base-ui/react/menu"
import { HugeiconsIcon } from "@hugeicons/react"
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon"
import { cn } from "../../lib/cn"

export type SelectMenuValue = string | number

export type SelectMenuItem =
  | "divider"
  | {
      icon?: ReactNode
      label: ReactNode
      value?: SelectMenuValue
      selected?: boolean
      type?: "default" | "danger"
      onSelect?: () => void
    }

export type SelectMenuProps = {
  renderTrigger: ReactElement
  items: SelectMenuItem[]
  value?: SelectMenuValue
  onValueChange?: (value: SelectMenuValue) => void
}

export function SelectMenu(props: SelectMenuProps) {
  const { renderTrigger, items, value, onValueChange } = props

  return (
    <Menu.Root>
      <Menu.Trigger render={renderTrigger} />

      <Menu.Portal>
        <Menu.Positioner className="z-[100]" sideOffset={8} align="end">
          <Menu.Popup className="menu-popup">
            {items.map((item, index) => {
              if (item === "divider") {
                return <Menu.Separator key={index} className="menu-separator" />
              }

              const hasValue = item.value != null
              const isSelected = item.selected ?? (hasValue && item.value === value)
              const hasSelectAction = item.onSelect != null || (hasValue && onValueChange != null)

              return (
                <Menu.Item
                  key={index}
                  closeOnClick={hasSelectAction}
                  className={cn(
                    "menu-item",
                    isSelected && "bg-slate-950/[0.04]",
                    item.type === "danger" && "text-red-700",
                  )}
                  onClick={() => {
                    if (hasValue) {
                      onValueChange?.(item.value!)
                    }

                    item.onSelect?.()
                  }}
                >
                  {item.icon ?? (
                    isSelected
                      ? <HugeiconsIcon icon={CheckIcon} size={16} />
                      : <span className="size-4" />
                  )}
                  <span>{item.label}</span>
                </Menu.Item>
              )
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
