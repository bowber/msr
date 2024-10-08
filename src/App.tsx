import { onMount } from "solid-js";
import { TitleBar } from "./components/title-bar";
import { appWindow } from "@tauri-apps/api/window"
import { isMaximized } from "./components/contexts/ui-controller";
import clsx from "clsx";
import { Toaster } from "solid-toast";
import { Sidebar } from "./components/sidebar";
import { AppRouter } from "./components/routes";



function App() {
  // Don't put this outside of the component if u don't want it focus whenever you makes any changes to this file
  onMount(() => {
    appWindow.setFocus();
  });

  return (
    <div class={clsx(
      "w-full h-svh overflow-hidden bg-primary-100",
      isMaximized() == false && "rounded-md"
    )} >
      <TitleBar />
      <div class="relative h-[fill-available] flex">
        <Sidebar />
        <AppRouter />
      </div>
      <Toaster containerClassName="mt-7" />
    </ div>
  );
}

export default App;
