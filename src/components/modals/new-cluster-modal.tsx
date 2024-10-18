import { useLocation } from "@solidjs/router";
import { Modal } from "../share/modal"
import { BaseButton } from "../share/base-button";
import { For } from "solid-js";

export const NewClusterModal = () => {
  const location = useLocation();
  return (
    <Modal
      isOpen={location.hash === "#new"}
      onClose={() => window.history.back()}
    >
      <div class="bg-white w-full h-full rounded-lg p-4 overflow-y-auto relative">
        <h3>New Cluster</h3>

        <p class="mt-2">Name</p>
        <input type="text" class="w-full border-2 p-1 rounded-lg" />

        <p class="mt-2">Hosts</p>
        <BaseButton class="w-full border-2 p-1 rounded-lg" >
          + Add host
        </BaseButton>
        <HostsList />
        <BaseButton class="sticky bg-primary-900 text-white bottom-0 border-2 px-2 py-1 mt-4 rounded-lg">
          Create
        </BaseButton>
      </div>
    </Modal>
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