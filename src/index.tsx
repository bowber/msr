/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import "./index.css";
import { ClusterProvider } from "./contexts/clusters";
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import RelativeTime from "dayjs/plugin/relativeTime"
import ArraySupport from "dayjs/plugin/arraySupport"
import dayjs from "dayjs";
import { TauriProvider } from "./contexts/tauri";
import { UIControllerProvider } from "./contexts/ui-controller";
dayjs.extend(RelativeTime);
dayjs.extend(ArraySupport)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
})

render(() => (
  <QueryClientProvider client={queryClient}>
    <UIControllerProvider>
      <TauriProvider>
        <ClusterProvider>
            <SolidQueryDevtools />
            <App />
        </ClusterProvider>
      </TauriProvider>
    </UIControllerProvider>
  </QueryClientProvider>
), document.getElementById("root") as HTMLElement);
