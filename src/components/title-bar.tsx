import { IconMaximize, IconMinimize, IconMinus, IconX } from "@tabler/icons-solidjs"
import { BaseButton } from "./share/base-button"
import { appWindow } from '@tauri-apps/api/window'
import { Show } from "solid-js"
import { isMaximized } from "./contexts/ui-controller"
import toast from "solid-toast"
export const TitleBar = () => {
  return (
    <div data-tauri-drag-region class="w-full h-10 flex justify-end bg-primary-500">
      <BaseButton onClick={() => toast("Coming soon Feature!", { icon: "🚧" })} class="h-full aspect-square mr-auto pl-2">
        <img
          src="/logo.png"
          alt="logo"
          class="w-full h-full flex justify-center items-center"
        />
      </BaseButton>
      <BaseButton onClick={() => appWindow.minimize()} class="h-full flex justify-center items-center aspect-square">
        <IconMinus />
      </BaseButton>
      <BaseButton onClick={() => appWindow.toggleMaximize()} class="h-full flex justify-center items-center aspect-square">
        <Show when={isMaximized()} fallback={<IconMaximize />}>
          <IconMinimize />
        </Show>
      </BaseButton>
      <BaseButton onClick={() => appWindow.close()} class="h-full flex justify-center items-center aspect-square">
        <IconX />
      </BaseButton>
    </div>
  )
}