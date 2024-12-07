import { BaseButton } from "../share/base-button";
import { createSignal, For, Show } from "solid-js";
import { useUIController } from "../../contexts/ui-controller";
import { Drawer } from "../share/drawer";
import { Button } from "../share/button";
import { Input } from "../share/input";
import { createQuery } from "@tanstack/solid-query";
import { getHosts, Host } from "../../commands/hosts";
import { createForm } from "../share/form";
import { addCluster, newClusterSchema } from "../../commands/clusters";
import { A } from "@solidjs/router";
import toast from "solid-toast";

export const NewClusterDrawer = () => {
  const { isShowNewClusterForm, setShowNewClusterForm } = useUIController()
  const [selectedHosts, setSelectedHosts] = createSignal<Record<string, boolean>>({})

  const idleHosts = createQuery(() => ({
    queryKey: ["idle-hosts", isShowNewClusterForm()],
    queryFn: () => getHosts({
      cluster_id: undefined
    }),
    enabled: isShowNewClusterForm(),
    select: (data) => data.filter((host) => host.cluster_id === undefined)
  }))

  const { formError, formErrorMap, submitHandlerBuilder } = createForm(() => ({
    // resetKey: isShowNewClusterForm(),
    schema: newClusterSchema,
    preProcess: (data) => {
      return {
        ...data,
        hostIds: Object.entries(selectedHosts()).filter(([_, value]) => value).map(([key, _]) => Number(key)
        )
      }
    },
  }))

  const handleSubmit = submitHandlerBuilder((data) => {
    toast.loading("Adding cluster...", { id: "add-cluster" })
    addCluster(data, data.hostIds)
      .then(() => {
        toast.success("Cluster added", { id: "add-cluster" })
        setShowNewClusterForm(false)
      })
      .catch((e) => {
        toast.error("Failed to add cluster: " + e.message, { id: "add-cluster" })
        console.error(e)
      })
  })

  return (
    <Drawer
      isOpen={isShowNewClusterForm()}
      onClose={() => setShowNewClusterForm(false)}
    >
      <form
        class="bg-primary-200 w-fill-available h-fill-available p-4 overflow-y-auto relative"
        onSubmit={handleSubmit}
      >
        <h3>New Cluster</h3>

        <p class="mt-2">Name</p>
        <Input type="text" class="w-full" name="name" required />
        <span class="text-red-500">{formErrorMap().get("name")?.message}</span>

        <p class="mt-2">LoadBalancer IP</p>
        <Input type="text" class="w-full" name="lb_address" required />
        <span class="text-red-500">{formErrorMap().get("lb_address")?.message}</span>

        <p class="mt-2">Hosts</p>
        {/* <p>{JSON.stringify(
          selectedHosts(),
          null,
          2
        )}</p> */}
        <Show when={idleHosts.data}>
          {(data) => (
            <div class="px-4">
              <For each={data()}>
                {host => (
                  <HostDisplay
                    host={host}
                    checked={() => selectedHosts()[host.id]}
                    setChecked={(value) => {
                      setSelectedHosts((prev) => ({ ...prev, [host.id]: value }))
                    }}

                  />
                )}
              </For>
            </div>
          )}
        </Show>
        <span class="text-red-500">{formErrorMap().get("hostIds")?.message}</span>
        <Show when={formError()} >
          <span class="block text-red-500">
            Some data is invalid. Please correct the errors and try again.
          </span>
        </Show>
        <Button class="sticky mt-4 bottom-0">
          Create
        </Button>
      </form>
    </Drawer>
  )
}


const HostDisplay = (props: {
  host: Host,
  setChecked: (value: boolean) => void,
  checked: () => boolean
}) => {
  return (
    <BaseButton
      type="button"
      class="flex items-center justify-start w-full"
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        props.setChecked(!props.checked())
      }}
    >
      <Input
        type="checkbox"
        class="mr-2 pointer-events-none"
        checked={props.checked()}
      />
      <span class="w-28 text-ellipsis break-all line-clamp-1 pointer-events-none">{props.host.name}</span>
      <A href={`/hosts?hostId=${props.host.id}`}>
        <img src="/icons/edit.svg" alt="edit" />
      </A>
      <BaseButton class="ml-auto">
        <span class="text-primary-900">{props.host.role}</span>
      </BaseButton>
      <BaseButton>
        <img src="/icons/x.svg" alt="remove" />
      </BaseButton>
    </BaseButton>
  )
}