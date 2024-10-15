/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import "./index.css";
import { ClusterProvider } from "./components/contexts/clusters";
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
})

render(() => (
  <QueryClientProvider client={queryClient}>
    <ClusterProvider>
      <SolidQueryDevtools />
      <App />
    </ClusterProvider>
  </QueryClientProvider>
), document.getElementById("root") as HTMLElement);
