import { onCleanup, onMount } from "solid-js";
import { TitleBar } from "./components/title-bar";
import { appWindow } from "@tauri-apps/api/window"
import { isMaximized, setIsMaximized } from "./components/contexts/ui-controller";
import clsx from "clsx";
import { Toaster } from "solid-toast";
import { Sidebar } from "./components/sidebar";
import { AppRouter } from "./components/routes";



function App() {
  // Don't put this outside of the component if u don't want it focus whenever you makes any changes to this file
  onMount(() => {
    appWindow.setFocus();
  });

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

  return (
    <AppRouter />
  );
}

export default App;
