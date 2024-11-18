import { BaseButton } from "../share/base-button";
import { For } from "solid-js";
import { useUIController } from "../../contexts/ui-controller";
import { Drawer } from "../share/drawer";
import { Button } from "../share/button";
import { Input } from "../share/input";

export const NewClusterDrawer = () => {
  const { isShowNewClusterForm, setShowNewClusterForm } = useUIController()
  return (
    <Drawer
      isOpen={isShowNewClusterForm()}
      onClose={() => setShowNewClusterForm(false)}
    >
      <div class="bg-primary-200 w-fill-available h-fill-available p-4 overflow-y-auto relative">
        <h3>New Cluster</h3>

        <p class="mt-2">Name</p>
        <Input type="text" class="w-full" />

        <p class="mt-2">Hosts</p>
        <Button class="w-full" variant="secondary" >
          + Add host
        </Button>
        <HostsList />
        <Button class="sticky mt-4 bottom-0">
          Create
        </Button>
      </div>
    </Drawer>
  )
}

const fakeChosenHosts = [
  {
    id: "1",
    name: "Host1",
    type: "controller",
  },
  {
    id: "2",
    name: "Host2",
    type: "worker",
  },
  {
    id: "3",
    name: "Host3",
    type: "worker",
  },
  {
    id: "4",
    name: "Host4",
    type: "worker",
  },
  {
    id: "5",
    name: "Host5",
    type: "worker",
  }
]

const HostsList = () => {
  return (
    <div class="px-4">
      <For each={fakeChosenHosts}>
        {(host) => (
          <div class="flex items-center justify-start">
            <span class="w-28 text-ellipsis break-all line-clamp-1">{host.name}</span>
            <a href={`/hosts?hostId=${host.id}`}>
              <BaseButton>
                <img src="/icons/edit.svg" alt="edit" />
              </BaseButton>
            </a>
            <BaseButton class="ml-auto">
              <span class="text-primary-900">{host.type}</span>
            </BaseButton>
            <BaseButton>
              <img src="/icons/x.svg" alt="remove" />
            </BaseButton>
          </div>
        )}
      </For>
    </div>
  )
}