import clsx from "clsx"
import { createEffect, ParentComponent } from "solid-js"
import { Toaster } from "solid-toast"
import { isMaximized } from "../contexts/ui-controller"
import { Sidebar } from "../sidebar"
import { TitleBar } from "../title-bar"
import { useLocation } from "@solidjs/router"

export const MainLayout: ParentComponent = (props) => {
  const location = useLocation()
  createEffect(() => {
    console.debug("Current location: ", location)
  })
  return (
    <div class={clsx(
      "w-full h-svh overflow-hidden bg-primary-100",
      isMaximized() == false && "rounded-md"
    )} >
      <TitleBar />
      <div class="relative h-[fill-available] flex">
        <Sidebar />
        {props.children}
      </div>
      <Toaster containerClassName="mt-7" />
    </ div>
  )
}