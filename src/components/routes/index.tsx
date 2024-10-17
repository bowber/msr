import { Router } from "@solidjs/router"
import { Clusters } from "./clusters"
import { children } from "solid-js/types/server/reactive.js"
import clsx from "clsx"
import { Toaster } from "solid-toast"
import { isMaximized } from "../contexts/ui-controller"
import { Sidebar } from "../sidebar"
import { TitleBar } from "../title-bar"
import { MainLayout } from "./main-layout"

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        component: () => <Clusters />,
      },
      {
        path: "*",
        component: () => <h1 class="p-4">
          <a href="/">404 Go back</a>
        </h1>
      }
    ]
  },
]

export const AppRouter = () => {
  return (
    <Router>
      {routes}
    </Router>
  )
}