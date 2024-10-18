import { onCleanup, onMount } from "solid-js";
import { appWindow } from "@tauri-apps/api/window"
import { setIsMaximized } from "./contexts/ui-controller";
import { AppRouter } from "./routes";



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
