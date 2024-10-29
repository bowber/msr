import { createQuery, CreateQueryResult } from "@tanstack/solid-query";
import { createContext, ParentComponent, useContext } from "solid-js";
import { setupTauri } from "../commands";

type TauriContextType = {
  tauriSetup: CreateQueryResult<Awaited<ReturnType<typeof setupTauri>>>
}

const TauriContext = createContext<TauriContextType | null>(null)


export const useTauri = () => {
  const context = useContext(TauriContext);
  if (!context) throw new Error("useCluster must be used within a ClusterProvider")
  return context
}

export const TauriProvider: ParentComponent = (props) => {
  const tauriSetup = createQuery(() => ({
    queryKey: ["tauri", "setup"],
    queryFn: setupTauri
  }))

  return (
    <TauriContext.Provider value={{
      tauriSetup,
    }}>
      {props.children}
    </TauriContext.Provider>
  )
}
