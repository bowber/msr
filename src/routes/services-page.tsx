import dayjs from "dayjs";
import { For } from "solid-js";
import { BaseButton } from "../components/share/base-button";
import { setShowNewServiceForm } from "../contexts/ui-controller";

export const ServicesPage = () => {
  return (
    <div class="p-4 w-fill-available h-fill-available  relative">
      <div class="flex">
        <h2>Services</h2>
        <BaseButton class="h-8">
          <img
            src="/icons/refresh.svg"
            alt="refresh"
          />
        </BaseButton>
        <BaseButton class="ml-auto text-primary-900" onClick={() => setShowNewServiceForm(true)}>
          Create Service
        </BaseButton>
      </div>
      <BaseButton>
        <p>SupaClusta</p>
      </BaseButton>
      <br />
      <div class="p-1 rounded bg-primary-900 w-full">
        <div class="overflow-y-auto space-y-1 max-h-[calc(100vh-9rem)]">
          <For each={fakeData}>
            {(services) => (
              <ServicesDisplay services={services} />
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

const ServicesDisplay = (props: { services: typeof fakeData[0] }) => {
  return (
    <div class="bg-primary-100 p-2 first:rounded-t last:rounded-b">
      <div class="flex items center justify-start">
        {/* Col 1 */}
        <div class="flex flex-col">
          <h4>{props.services.name}</h4>
          <span class="mt-auto">Updated: <b>{dayjs(props.services.updatedAt).fromNow()}</b></span>
          <span>Created: <b>{dayjs(props.services.createdAt).fromNow()}</b></span>
          <span>Cluster: <b>{props.services.cluster}</b></span>
        </div>

        {/* Col 2 */}
        <div class="ml-4 flex flex-col">
          <span>Status: <b class="text-green-400">{props.services.status}</b></span>
          <span>Replicas:  <b>{props.services.replicas}</b></span>
          <span>Autoscaling:  <b>{props.services.minReplicas} - {props.services.maxReplicas} replicas</b></span>
          <span>CPU ult: <b>{props.services.usedCPUs}/{props.services.requestedCPUs} Max {props.services.maxCPUs} vCPU</b></span>
          <span>RAM usage: <b>{props.services.usedRAM}/{props.services.requestedRAM} Max {props.services.maxRAM} GiB</b></span>
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
    name: 'Service1',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    cluster: 'SupaClusta',
    status: 'Healthy',
    replicas: 10,
    minReplicas: 10,
    maxReplicas: 20,
    requestedCPUs: 10,
    usedCPUs: 7,
    maxCPUs: 12,
    requestedRAM: 32,
    maxRAM: 32,
    usedRAM: 0.9,
  },
  {
    id: "2",
    name: 'Service2',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    cluster: 'SupaClusta',
    status: 'Healthy',
    replicas: 10,
    minReplicas: 10,
    maxReplicas: 20,
    requestedCPUs: 10,
    usedCPUs: 7,
    maxCPUs: 12,
    requestedRAM: 32,
    maxRAM: 32,
    usedRAM: 0.9,
  },
  {
    id: "3",
    name: 'Service3',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    cluster: 'SupaClusta',
    status: 'Healthy',
    replicas: 10,
    minReplicas: 10,
    maxReplicas: 20,
    requestedCPUs: 10,
    usedCPUs: 7,
    maxCPUs: 12,
    requestedRAM: 32,
    maxRAM: 32,
    usedRAM: 0.9,
  },
  {
    id: "4",
    name: 'Service4',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    cluster: 'SupaClusta',
    status: 'Healthy',
    replicas: 10,
    minReplicas: 10,
    maxReplicas: 20,
    requestedCPUs: 10,
    usedCPUs: 7,
    maxCPUs: 12,
    requestedRAM: 32,
    maxRAM: 32,
    usedRAM: 0.9,
  },
  {
    id: "5",
    name: 'Service5',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    cluster: 'SupaClusta',
    status: 'Healthy',
    replicas: 10,
    minReplicas: 10,
    maxReplicas: 20,
    requestedCPUs: 10,
    usedCPUs: 7,
    maxCPUs: 12,
    requestedRAM: 32,
    maxRAM: 32,
    usedRAM: 0.9,
  },
  {
    id: "6",
    name: 'Service6',
    updatedAt: '2021-10-10',
    createdAt: '2021-10-10',
    cluster: 'SupaClusta',
    status: 'Healthy',
    replicas: 10,
    minReplicas: 10,
    maxReplicas: 20,
    requestedCPUs: 10,
    usedCPUs: 7,
    maxCPUs: 12,
    requestedRAM: 32,
    maxRAM: 32,
    usedRAM: 0.9,
  },
]