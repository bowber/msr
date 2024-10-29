/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import "./index.css";
import { ClusterProvider } from "./contexts/clusters";
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import RelativeTime from "dayjs/plugin/relativeTime"
import dayjs from "dayjs";
import { HostsProvider } from "./contexts/hosts";
import { TauriProvider } from "./contexts/tauri";
dayjs.extend(RelativeTime);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
})

render(() => (
  <QueryClientProvider client={queryClient}>
    <TauriProvider>
      <ClusterProvider>
        <HostsProvider>
          <SolidQueryDevtools />
          <App />
        </HostsProvider>
      </ClusterProvider>
    </TauriProvider>
  </QueryClientProvider>
), document.getElementById("root") as HTMLElement);
