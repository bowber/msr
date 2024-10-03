import { BaseButton } from "./share/base-button"
import { appWindow } from '@tauri-apps/api/window'
export const TitleBar = () => {
  return (
    <div data-tauri-drag-region class="w-full flex justify-end">
      <BaseButton onClick={() => appWindow.minimize()}>
        <img
          src="https://api.iconify.design/mdi:window-minimize.svg"
          alt="minimize"
        />
      </BaseButton>
      <BaseButton onClick={() => appWindow.toggleMaximize()}>
        <img
          src="https://api.iconify.design/mdi:window-maximize.svg"
          alt="maximize"
        />
      </BaseButton>
      <BaseButton onClick={() => appWindow.close()}>
        <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
      </BaseButton>
    </div>
  )
}