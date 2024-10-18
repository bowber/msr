import { createContext, ParentComponent, useContext } from "solid-js";

type HostsContextType = {
}

const HostsContext = createContext<HostsContextType | null>(null)


export const useHosts = () => {
  const context = useContext(HostsContext);
  if (!context) throw new Error("useCluster must be used within a ClusterProvider")
  return context
}

export const HostsProvider: ParentComponent = (props) => {

  return (
    <HostsContext.Provider value={{
    }}>
      {props.children}
    </HostsContext.Provider>
  )
}
