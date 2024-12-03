import { JSX, Show } from "solid-js";
import { Button } from "./button";

interface DrawerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element,
  isOpen: boolean,
  onClose: () => void
  hideCloseButton?: boolean
}

export const Drawer = (props: DrawerProps) => {
  return (
    <Show when={props.isOpen}>
      <div
        class="drop-shadow-lg absolute inset-0 pl-[calc(100%-28rem)] animate-fade-in origin-right bg-[#0005]"
        onClick={(e) => {
          // Close the modal when clicking outside the modal
          if (e.target === e.currentTarget) {
            props.onClose();
          }
        }}
      >
        {props.children}
        <Show when={!props.hideCloseButton}>
          <Button
            onClick={props.onClose}
            class="absolute top-4 right-3 z-50"
            variant="secondary"
            scaleOnClick
          >
            Close
          </Button>
        </Show>
      </div>
    </Show>
  )
}