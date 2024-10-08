import { createSignal, onCleanup } from "solid-js";
import { appWindow } from "@tauri-apps/api/window"
import { makePersisted } from "@solid-primitives/storage";

export const [isMaximized, setIsMaximized] = createSignal(false);
export const [isSidebarOpen, setIsSidebarOpen] = makePersisted(createSignal(true), { name: "isSidebarOpen" });


const eHandlers = Promise.all([
  appWindow.onResized(async () => {
    setIsMaximized(await appWindow.isMaximized());
}),
]);

onCleanup(() => {
    eHandlers.then((handlers) => {
      handlers.forEach((handler) => handler());
    });
});