import { createQuery, CreateQueryResult } from "@tanstack/solid-query";
import { Accessor, createContext, createSignal, ParentComponent, Setter, useContext } from "solid-js";
import { makePersisted } from "@solid-primitives/storage";
import { getHosts } from "../commands/clusters";

type ClusterContextType = {
  clusters: CreateQueryResult<Awaited<ReturnType<typeof getHosts>>>
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
    queryKey: ["hosts"],
    queryFn: getHosts
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
