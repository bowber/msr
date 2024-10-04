import { createSignal, onCleanup } from "solid-js";
import { appWindow } from "@tauri-apps/api/window"

export const [isMaximized, setIsMaximized] = createSignal(false);


const eHandlers = Promise.all([appWindow.onResized(async () => {
    setIsMaximized(await appWindow.isMaximized());
  })]);

  onCleanup(() => {
    eHandlers.then((handlers) => {
      handlers.forEach((handler) => handler());
    });
  });