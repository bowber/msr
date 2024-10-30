import { createContext, ParentComponent, useContext } from "solid-js";
import { getHosts } from "../commands/hosts";
import { createQuery, CreateQueryResult } from "@tanstack/solid-query";
import { useTauri } from "./tauri";

type HostsContextType = {
  hosts: CreateQueryResult<Awaited<ReturnType<typeof getHosts>>>
}

const HostsContext = createContext<HostsContextType | null>(null)


export const useHosts = () => {
  const context = useContext(HostsContext);
  if (!context) throw new Error("useCluster must be used within a ClusterProvider")
  return context
}

export const HostsProvider: ParentComponent = (props) => {
  const tauri = useTauri()
  const hosts = createQuery(() => ({
    queryKey: ["hosts"],
    queryFn: getHosts,
    enabled: tauri.tauriSetup.status === 'success'
  }))
  return (
    <HostsContext.Provider value={{
      hosts
    }}>
      {props.children}
    </HostsContext.Provider>
  )
}
