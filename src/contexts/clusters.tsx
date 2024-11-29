import { createQuery, CreateQueryResult } from "@tanstack/solid-query";
import { Accessor, createContext, createMemo, createSignal, ParentComponent, Setter, useContext } from "solid-js";
import { makePersisted } from "@solid-primitives/storage";
import { Cluster, getClusters } from "../commands/clusters";
import { useTauri } from "./tauri";

type ClusterContextType = {
  clusters: CreateQueryResult<Awaited<ReturnType<typeof getClusters>>>
  clustersMap: () => Map<string, Cluster>
  defaultCluster: Accessor<string | undefined>
  setDefaultCluster: Setter<string | undefined>
}

const ClusterContext = createContext<ClusterContextType | null>(null)


export const useClusters = () => {
  const context = useContext(ClusterContext);
  if (!context) throw new Error("useCluster must be used within a ClusterProvider")
  return context
}

export const ClusterProvider: ParentComponent = (props) => {
  const tauri = useTauri()
  const [defaultCluster, setDefaultCluster] = makePersisted(
    createSignal<string>(),
    { name: "defaultCluster" }
  )
  const clusters = createQuery(() => ({
    queryKey: ["cluster"],
    queryFn: getClusters,
    enabled: tauri.tauriSetup.status === 'success'
  }))

  const clustersMap = createMemo(() => {
    return new Map(clusters.data?.map((c) => [c.id.toString(), c]) ?? [])
  })

  return (
    <ClusterContext.Provider value={{
      clusters,
      clustersMap,
      defaultCluster,
      setDefaultCluster
    }}>
      {props.children}
    </ClusterContext.Provider>
  )
}
