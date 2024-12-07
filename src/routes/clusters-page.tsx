import dayjs from "dayjs";
import { For, Show } from "solid-js";
import { BaseButton } from "../components/share/base-button";
import { useClusters } from "../contexts/clusters";
import { useUIController } from "../contexts/ui-controller";
import { Cluster, deleteCluster } from "../commands/clusters";
import { askConfirmation } from "../utils/tauri";
import toast from "solid-toast";

export const ClustersPage = () => {
  const { setShowNewClusterForm } = useUIController();
  const clustersCtx = useClusters();
  return (
    <div class="p-4 w-fill-available h-fill-available  relative">
      <div class="flex">
        <h2>Clusters</h2>
        <BaseButton class="h-8">
          <img
            src="/icons/refresh.svg"
            alt="refresh"
          />
        </BaseButton>
        <BaseButton
          class="ml-auto text-primary-900"
          onClick={() => setShowNewClusterForm(true)}
        >
          Create Cluster
        </BaseButton>
      </div>
      <br />
      <div class="p-1 rounded bg-primary-900 w-full">
        <div class="overflow-y-auto space-y-1 max-h-[calc(100vh-9rem)]">
          <For each={clustersCtx.clusters.data}>
            {(cluster) => (
              <ClusterDisplay cluster={cluster} />
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

const ClusterDisplay = (props: { cluster: Cluster }) => {
  const clusterCtx = useClusters();
  return (
    <div class="bg-primary-100 p-2 first:rounded-t last:rounded-b">
      <div class="flex items center justify-start">
        {/* Col 1 */}
        <div class="flex flex-col">
          <h4>{props.cluster.name}</h4>
          <span class="mt-auto">Updated: <b>{dayjs(props.cluster.updated_at).fromNow()}</b></span>
          <span>Created: <b>{dayjs(props.cluster.created_at).fromNow()}</b></span>
          <span>LB IP: <b>{props.cluster.lb_address}</b></span>
        </div>

        {/* Col 2 */}
        <div class="ml-4 flex flex-col">
          <span>Status: <b class="text-green-400">{"NULL"}</b></span>
          <span>Hosts:  <b>{"NULL"}</b></span>
          <span>Services: <b>{"NULL"}</b></span>
          <span>Controller: <b>{"NULL"}</b></span>
          <span>Workers: <b>{"NULL"}</b></span>
        </div>
        {/* Col 3 */}
        <div class="ml-auto flex self-center">
          <Show when={clusterCtx.defaultCluster() !== props.cluster.id}>
            <BaseButton
              class="h-8 text-primary-900 font-bold"
              // TODO: Add confirmation dialog
              onClick={() => clusterCtx.setDefaultCluster(props.cluster.id)}
            >
              Make Default
            </BaseButton>
          </Show>
          <Show when={clusterCtx.defaultCluster() === props.cluster.id}>
            <BaseButton class="h-8 text-primary-900">
              Default
            </BaseButton>
          </Show>
        </div>

        {/* Col 4 */}
        <div class="ml-auto flex self-center">
          <BaseButton class="h-8">
            <img src="/icons/edit.svg" alt="edit" />
          </BaseButton>
          <BaseButton class="h-8">
            <img src="/icons/device-desktop-analytics.svg" alt="analytics" />
          </BaseButton>
          <BaseButton class="h-8" onClick={() => askConfirmation(() => {
            toast.loading('Deleting cluster...', { id: 'delete-cluster' })
            deleteCluster(props.cluster.id)
              .then(() => {
                toast.success('Cluster deleted', { id: 'delete-cluster' })
                clusterCtx.clusters.refetch()
              })
              .catch((e) => {
                toast.error('Failed to delete cluster', { id: 'delete-cluster' })
                console.error(e)
              })
          })
          }>
            <img src="/icons/x.svg" alt="delete" />
          </BaseButton>
        </div>
      </div>
    </div >
  );
}