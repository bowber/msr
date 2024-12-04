import { createQuery, CreateQueryResult } from "@tanstack/solid-query";
import { createContext, createEffect, ParentComponent, useContext } from "solid-js";
import { setupTauri } from "../commands";
import toast from "solid-toast";
import { getHostRoles } from "../commands/hosts";

type TauriContextType = {
  tauriSetup: CreateQueryResult<Awaited<ReturnType<typeof setupTauri>>>
  hostRoles: CreateQueryResult<Awaited<ReturnType<typeof getHostRoles>>>
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
    queryFn: setupTauri,
    staleTime: Infinity,
  }))

  const hostRoles = createQuery(() => ({
    queryKey: ["roles", "hosts"],
    queryFn: getHostRoles,
    staleTime: Infinity,
  }))

  createEffect(() => {
    if (tauriSetup.status === "pending") {
      toast.loading("Setting up Tauri...", { id: "tauri-setup" })
    }
    if (tauriSetup.status === "error") {
      toast.error("Setting up Tauri failed: " + (tauriSetup.error.message ?? tauriSetup.error.name ?? tauriSetup.error ?? "Unknown error"), { id: "tauri-setup" })
      console.error(tauriSetup.error)
    }
    if (tauriSetup.status === "success") {
      toast.success("Setting up Tauri successful", { id: "tauri-setup" })
    }
  })
  return (
    <TauriContext.Provider value={{
      tauriSetup,
      hostRoles
    }}>
      {props.children}
    </TauriContext.Provider>
  )
}
