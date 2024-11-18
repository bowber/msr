import dayjs from "dayjs";
import { For } from "solid-js";
import { BaseButton } from "../components/share/base-button";
import { useUIController } from "../contexts/ui-controller";

export const HostsPage = () => {
  const { setShowNewHostForm } = useUIController();
  return (
    <div class="p-4 w-fill-available h-fill-available  relative">
      <div class="flex">
        <h2>Hosts</h2>
        <BaseButton class="h-8">
          <img
            src="/icons/refresh.svg"
            alt="refresh"
          />
        </BaseButton>
        <BaseButton class="ml-auto text-primary-900" onClick={() => setShowNewHostForm(true)}>
          Create Host
        </BaseButton>
      </div>
      <BaseButton>
        <p>SupaClusta</p>
      </BaseButton>
      <br />
      <div class="p-1 rounded bg-primary-900 w-full">
        <div class="overflow-y-auto space-y-1 max-h-[calc(100vh-9rem)]">
          <For each={fakeData}>
            {(hosts) => (
              <HostsDisplay Hosts={hosts} />
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

const HostsDisplay = (props: { Hosts: typeof fakeData[0] }) => {
  return (
    <div class="bg-primary-100 p-2 first:rounded-t last:rounded-b">
      <div class="flex items center justify-start">
        {/* Col 1 */}
        <div class="flex flex-col">
          <h4>{props.Hosts.name}</h4>
          <span class="mt-auto">Updated: <b>{dayjs(props.Hosts.updatedAt).fromNow()}</b></span>
          <span>Created: <b>{dayjs(props.Hosts.createdAt).fromNow()}</b></span>
          <span>Cluster: <b>{props.Hosts.cluster}</b></span>
        </div>

        {/* Col 2 */}
        <div class="ml-4 flex flex-col">
          <span>Status: <b class="text-green-400">{props.Hosts.status}</b></span>
          <span>Type: <b>{props.Hosts.type}</b></span>
          <span>Pods:  <b>{props.Hosts.totalPods}</b></span>
          <span>CPU ult: <b>{props.Hosts.usedCPUs}/{props.Hosts.totalCPUs}</b></span>
          <span>RAM usage: <b>{props.Hosts.usedRAM}/{props.Hosts.totalRAM} GiB</b></span>
        </div>
        {/* Col 3 */}
        <div class="ml-auto flex self-center">
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
    name: 'Host1',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    cluster: 'SupaClusta',
    type: 'controller',
    status: 'Healthy',
    hostIP: '192.168.1.1',
    totalPods: 10,
    totalCPUs: 200,
    usedCPUs: 7,
    totalRAM: 32,
    usedRAM: 0.9,
  },
  {
    id: "2",
    name: 'Host2',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    cluster: 'SupaClusta',
    type: 'worker',
    status: 'Healthy',
    hostIP: '192.168.1.2',
    totalPods: 10,
    totalCPUs: 200,
    usedCPUs: 7,
    totalRAM: 32,
    usedRAM: 0.9,
  },
  {
    id: "3",
    name: 'Host3',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    cluster: 'SupaClusta',
    type: 'worker',
    status: 'Healthy',
    hostIP: '192.168.1.3',
    totalPods: 10,
    totalCPUs: 200,
    usedCPUs: 7,
    totalRAM: 32,
    usedRAM: 0.9,
  },
  {
    id: "4",
    name: 'Host4',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    cluster: 'SupaClusta',
    type: 'worker',
    status: 'Healthy',
    hostIP: '192.168.1.4',
    totalPods: 10,
    totalCPUs: 200,
    usedCPUs: 7,
    totalRAM: 32,
    usedRAM: 0.9,
  },
  {
    id: "5",
    name: 'Host5',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    cluster: 'SupaClusta',
    type: 'worker',
    status: 'Healthy',
    hostIP: '192.168.1.5',
    totalPods: 10,
    totalCPUs: 200,
    usedCPUs: 7,
    totalRAM: 32,
    usedRAM: 0.9,
  },
  {
    id: "6",
    name: 'Host6',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    cluster: 'SupaClusta',
    type: 'worker',
    status: 'Healthy',
    hostIP: '192.168.1.6',
    totalPods: 10,
    totalCPUs: 200,
    usedCPUs: 7,
    totalRAM: 32,
    usedRAM: 0.9,
  },
]