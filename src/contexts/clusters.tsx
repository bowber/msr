import { createQuery, CreateQueryResult } from "@tanstack/solid-query";
import { Accessor, createContext, createSignal, ParentComponent, Setter, useContext } from "solid-js";
import { get_clusters } from "../commands/clusters";
import { makePersisted } from "@solid-primitives/storage";

type ClusterContextType = {
  clusters: CreateQueryResult<Awaited<ReturnType<typeof get_clusters>>>
  defaultCluster: Accessor<string | undefined>
  setDefaultCluster: Setter<string | undefined>
}

const ClusterContext = createContext<ClusterContextType | null>(null)


export const useCluster = () => {
  const context = useContext(ClusterContext);
  if (!context) throw new Error("useCluster must be used within a ClusterProvider")
  return context
}

export const ClusterProvider: ParentComponent = (props) => {
  const [defaultCluster, setDefaultCluster] = makePersisted(
    createSignal<string>(),
    { name: "defaultCluster" }
  )
  const clusters = createQuery(() => ({
    queryKey: ["clusters"],
    queryFn: get_clusters
  }))

  return (
    <ClusterContext.Provider value={{
      clusters,
      defaultCluster,
      setDefaultCluster
    }}>
      {props.children}
    </ClusterContext.Provider>
  )
}
