import { onCleanup } from "solid-js";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"
import { useUIController } from "./contexts/ui-controller";
import { AppRouter } from "./routes";
const appWindow = getCurrentWebviewWindow()



function App() {
  const { setIsMaximized } = useUIController();

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
