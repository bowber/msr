import { createContext, createSignal, ParentComponent, useContext } from "solid-js";
import { getHosts } from "../commands/hosts";
import { createQuery, CreateQueryResult } from "@tanstack/solid-query";
import { useTauri } from "./tauri";

type HostsContextType = {
  hosts: CreateQueryResult<Awaited<ReturnType<typeof getHosts>>>
  filter: () => Record<string, string>
  setFilter: (filter: Record<string, string>) => void
}

const HostsContext = createContext<HostsContextType | null>(null)


export const useHosts = () => {
  const context = useContext(HostsContext);
  if (!context) throw new Error("useCluster must be used within a ClusterProvider")
  return context
}

export const HostsProvider: ParentComponent = (props) => {
  const tauri = useTauri()
  const [filter, setFilter] = createSignal<Record<string, string>>({})
  const hosts = createQuery(() => ({
    queryKey: ["hosts", filter()],
    queryFn: () => getHosts(filter()),
    enabled: tauri.tauriSetup.status === 'success'
  }))

  return (
    <HostsContext.Provider value={{
      hosts,
      filter,
      setFilter
    }}>
      {props.children}
    </HostsContext.Provider>
  )
}
