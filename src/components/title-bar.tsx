import { IconMaximize, IconMinimize, IconMinus, IconX } from "@tabler/icons-solidjs"
import { BaseButton } from "./share/base-button"
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { Show } from "solid-js"
import { useUIController } from "../contexts/ui-controller"
import toast from "solid-toast"
const appWindow = getCurrentWebviewWindow()

export const TitleBar = () => {
  const {isMaximized} = useUIController()
  return (
    <div
      data-tauri-drag-region
      class="w-full h-10 flex justify-end bg-primary-500"
    >
      <a class="h-full aspect-square pl-2" href="/">
        <img
          src="/logo.png"
          alt="logo"
          class="h-full"
        />
      </a>
      <a class="h-full ml-7 pl-2 flex gap-1 justify-center items-center" href="/">
        <span class="text-xl font-bold">Cluster 001</span>
      </a>
      <a class="h-full ml-7 mr-auto pl-2 flex gap-1 justify-center items-center" href="/">
        <span class="text-sm">Cluster IP:</span>
        <span class="font-bold">192.168.1.1</span>
      </a>
      <BaseButton onClick={() => toast("Coming soon 🚧")} class="h-[90%] my-auto rounded-full border-2 border-black flex justify-center items-center aspect-square mr-12">
        •ᴗ•
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