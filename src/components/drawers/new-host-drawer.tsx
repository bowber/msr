import { useUIController } from "../../contexts/ui-controller";
import { Drawer } from "../share/drawer";
import { Button } from "../share/button";
import { Input } from "../share/input";
import { Select } from "../share/select";
import { addHost, newHostSchema } from "../../commands/hosts";
import toast from "solid-toast";
import { useClusters } from "../../contexts/clusters";
import { useTauri } from "../../contexts/tauri";
import { createForm } from "../share/form";
import { Show } from "solid-js";

export const NewHostDrawer = () => {
  const { isShowNewHostForm, setShowNewHostForm } = useUIController()

  const tauriCtx = useTauri();
  const clustersCtx = useClusters();

  const { formError, formErrorMap, submitHandlerBuilder } = createForm(() => ({
    schema: newHostSchema,
  }))

  const handleSubmit = submitHandlerBuilder((data) => {
    toast.loading("Adding host...", { id: "add-host" })
    addHost(data)
      .then(() => {
        toast.success("Host added", { id: "add-host" })
        // TODO: Refetch hosts
        // hostsCtx.hosts.refetch()
        setShowNewHostForm(false)
      })
      .catch((e) => {
        toast.error("Failed to add host: " + e.message, { id: "add-host" })
        console.error(e)
      })
  })
  return (
    <Drawer
      isOpen={isShowNewHostForm()}
      onClose={() => setShowNewHostForm(false)}
    >
      <form
        class="bg-primary-200 w-fill-available h-fill-available p-4 overflow-y-auto relative"
        onSubmit={handleSubmit}
      >
        <h3>New Host</h3>

        <p class="mt-2">Name</p>
        <Input type="text" class="w-full" name="name" />
        <span class="text-red-500">{formErrorMap().get("name")?.message}</span>

        <p class="mt-2">IP</p>
        <Input type="text" class="w-full" name="address" />
        <span class="text-red-500">{formErrorMap().get("address")?.message}</span>

        <p class="mt-2">SSH Username</p>
        <Input type="text" class="w-full" name="ssh_user" />
        <span class="text-red-500">{formErrorMap().get("ssh_user")?.message}</span>

        <p class="mt-2">Role</p>
        <Select
          options={tauriCtx.hostRoles.data ?? []}
          class="w-full"
          name="role"
          onInput={(v) => console.log(v.currentTarget.value)}
        />
        <span class="text-red-500">{formErrorMap().get("role")?.message}</span>
        <p class="mt-2">Assign to cluster (optional)</p>
        <Select
          options={clustersCtx.clusters.data?.map((c) => c.id.toString()) ?? []}
          class="w-full"
          name="cluster_id"
          emptyOption="#No Cluster"
          showEmptyOption
          format={(v) => clustersCtx.clustersMap().get(v)?.name ?? "#No Cluster"}
          onInput={(v) => console.log(v.currentTarget.value)}
        />
        <span class="text-red-500">{formErrorMap().get("cluster_id")?.message}</span>

        <Show when={formError()} >
          <span class="block text-red-500">
            Some data is invalid. Please correct the errors and try again.
          </span>
        </Show>
        <Button class="sticky mt-8 bottom-2">
          Create
        </Button>
      </form>
    </Drawer>
  )
}

