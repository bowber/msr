import { Router } from "@solidjs/router"
import { ClustersPage } from "./clusters-page"
import { MainLayout } from "./main-layout"
import { HostsPage } from "./hosts-page"

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        component: () => <ClustersPage />,
      },
      {
        path: "hosts",
        component: () => <HostsPage />,
      },
      {
        path: "*",
        component: () => <h1 class="p-4">
          <div onClick={() => window.history.back()}>404 Go back</div>
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