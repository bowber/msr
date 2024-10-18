import dayjs from "dayjs";
import { For, Show } from "solid-js";
import { BaseButton } from "../components/share/base-button";
import { useCluster } from "../contexts/clusters";
import { NewClusterModal } from "../components/modals/new-cluster-modal";

export const ClustersPage = () => {
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
        <a href="/#new" class="ml-auto text-primary-900">
          <BaseButton>
            Create Cluster
          </BaseButton>
        </a>
      </div>
      <br />
      <div class="p-1 rounded bg-primary-900 w-full">
        <div class="overflow-y-auto space-y-1 max-h-[calc(100vh-9rem)]">
          <For each={fakeData}>
            {(cluster) => (
              <ClusterDisplay cluster={cluster} />
            )}
          </For>
        </div>
      </div>
      <NewClusterModal />
    </div>
  );
}

const ClusterDisplay = (props: { cluster: typeof fakeData[0] }) => {
  const clusterCtx = useCluster();
  return (
    <div class="bg-primary-100 p-2 first:rounded-t last:rounded-b">
      <div class="flex items center justify-start">
        {/* Col 1 */}
        <div class="flex flex-col">
          <h4>{props.cluster.name}</h4>
          <span class="mt-auto">Updated: <b>{dayjs(props.cluster.updatedAt).fromNow()}</b></span>
          <span>Created: <b>{dayjs(props.cluster.createdAt).fromNow()}</b></span>
          <span>LB IP: <b>{props.cluster.lbIP}</b></span>
        </div>

        {/* Col 2 */}
        <div class="ml-4 flex flex-col">
          <span>Status: <b class="text-green-400">{props.cluster.status}</b></span>
          <span>Hosts:  <b>{props.cluster.totalHosts}</b></span>
          <span>Services: <b>{props.cluster.totalServices}</b></span>
          <span>Controller: <b>{props.cluster.totalController}</b></span>
          <span>Workers: <b>{props.cluster.totalWorkers}</b></span>
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
          <BaseButton class="h-8">
            <img src="/icons/x.svg" alt="delete" />
          </BaseButton>
        </div>
      </div>
    </div >
  );
}
const fakeData = [
  {
    id: "1",
    name: 'Cluster 1',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    status: 'Healthy',
    lbIP: '192.168.1.1',
    totalHosts: 10,
    totalServices: 200,
    totalWorkers: 7,
    totalController: 3,
  },
  {
    id: "2",
    name: 'Cluster 2',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    status: 'Healthy',
    lbIP: '192.168.1.2',
    totalHosts: 10,
    totalServices: 200,
    totalWorkers: 7,
    totalController: 3,
  },
  {
    id: "3",
    name: 'Cluster 3',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    status: 'Healthy',
    lbIP: '192.168.1.3',
    totalHosts: 10,
    totalServices: 200,
    totalWorkers: 7,
    totalController: 3,
  },
  {
    id: "4",
    name: 'Cluster 4',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    status: 'Healthy',
    lbIP: '192.168.1.4',
    totalHosts: 10,
    totalServices: 200,
    totalWorkers: 7,
    totalController: 3,
  },
  {
    id: "5",
    name: 'Cluster 5',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    status: 'Healthy',
    lbIP: '192.168.1.5',
    totalHosts: 10,
    totalServices: 200,
    totalWorkers: 7,
    totalController: 3,
  },
  {
    id: "6",
    name: 'Cluster 6',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    status: 'Healthy',
    lbIP: '192.168.1.6',
    totalHosts: 10,
    totalServices: 200,
    totalWorkers: 7,
    totalController: 3,
  },
]