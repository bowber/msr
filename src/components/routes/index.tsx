import { Router } from "@solidjs/router"
import { Clusters } from "./clusters"

const routes = [
  {
    path: "/",
    component: () => <Clusters />
  },
]

export const AppRouter = () => {
  return (
    <Router>
      {routes}
    </Router>
  )
}