import { createQuery, CreateQueryResult } from "@tanstack/solid-query";
import { createContext, ParentComponent, useContext } from "solid-js";
import { get_clusters } from "../commands/clusters";

type ClusterContextType = {
  clusters: CreateQueryResult<Awaited<ReturnType<typeof get_clusters>>>
}

const ClusterContext = createContext<ClusterContextType | null>(null)


export const useCluster = () => {
  const context = useContext(ClusterContext);
  if (!context) throw new Error("useCluster must be used within a ClusterProvider")
  return context
}

export const ClusterProvider: ParentComponent = (props) => {
  const clusters = createQuery(() => ({
    queryKey: ["clusters"],
    queryFn: get_clusters
  }))
  return (
    <ClusterContext.Provider value={{ clusters }}>
      {props.children}
    </ClusterContext.Provider>
  )
}
