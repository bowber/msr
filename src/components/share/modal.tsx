import { JSX, Show } from "solid-js";
import { BaseButton } from "./base-button";

interface ModalProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element,
  isOpen: boolean,
  onClose: () => void
}

export const Modal = (props: ModalProps) => {
  return (
    <Show when={props.isOpen}>
      <div
        class="bg-primary-100 bg-opacity-50 backdrop-blur-sm absolute inset-0 duration-200 p-10 animate-fade-in origin-right"
        onClick={(e) => {
          // Close the modal when clicking outside the modal
          if (e.target === e.currentTarget) {
            props.onClose();
          }
        }}
      >
        {props.children}
        <BaseButton
          onClick={props.onClose}
          class="absolute top-2 right-3 z-50 text-primary-900"
        >
          Close
        </BaseButton>
      </div>
    </Show>
  )
}