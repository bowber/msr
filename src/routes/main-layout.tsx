import clsx from "clsx"
import { createEffect, ParentComponent } from "solid-js"
import { Toaster } from "solid-toast"
import { isMaximized } from "../contexts/ui-controller"
import { Sidebar } from "../components/sidebar"
import { TitleBar } from "../components/title-bar"
import { useLocation } from "@solidjs/router"
import { NewHostDrawer } from "../components/drawers/new-host-drawer"
import { NewClusterDrawer } from "../components/drawers/new-cluster-drawer"
import { NewServiceDrawer } from "../components/drawers/new-service-drawer"

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
        {/* Drawers */}
        <NewClusterDrawer />
        <NewHostDrawer />
        <NewServiceDrawer />
      </div>
      <Toaster containerClassName="mt-7" />
    </ div>
  )
}