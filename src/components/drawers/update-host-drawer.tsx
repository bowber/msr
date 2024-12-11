import { useUIController } from "../../contexts/ui-controller";
import { Drawer } from "../share/drawer";
import { Button } from "../share/button";
import { Input } from "../share/input";
import { Select } from "../share/select";
import { getHosts, pingHost, updateHost, updateHostSchema } from "../../commands/hosts";
import toast from "solid-toast";
import { useClusters } from "../../contexts/clusters";
import { createQuery } from "@tanstack/solid-query";
import { Show } from "solid-js";
import { useTauri } from "../../contexts/tauri";
import { createForm } from "../share/form";

export const UpdateHostDrawer = () => {
  const { updatingHostId, setShowUpdateHostForm } = useUIController()

  const { formError, formErrorMap, submitHandlerBuilder } = createForm(() => ({
    resetKey: updatingHostId(),
    schema: updateHostSchema,
    preProcess: (data) => {
      return {
        ...data,
        id: updatingHostId()
      }
    }
  }))

  const tauriCtx = useTauri();
  const clustersCtx = useClusters();

  const host = createQuery(() => ({
    queryKey: ["host", updatingHostId()],
    queryFn: () => getHosts({
      host_id: updatingHostId()
    }).then((hosts) => hosts[0]),
    enabled: updatingHostId() !== undefined
  }))

  const hostStatus = createQuery(() => ({
    queryKey: ["host-status", {
      host: `${host.data?.ssh_user + '@'}${host.data?.address}`
    }],
    queryFn: () => pingHost({
      host: `${host.data?.ssh_user + '@'}${host.data?.address}`
    }),
    enabled: host.data !== undefined
  }))

  const handleSubmit = submitHandlerBuilder(async (data) => {
    const id = updatingHostId()
    if (id === undefined) return;
    toast.loading("Updating host...", { id: "update-host" })
    updateHost(data).then(() => {
      toast.success("Host updated", { id: "update-host" })
      setShowUpdateHostForm()
    }).catch(() => {
      toast.error("Failed to update host", { id: "update-host" })
    })

  })

  return (
    <Drawer
      isOpen={!!updatingHostId()}
      onClose={() => setShowUpdateHostForm()}
    >
      <form
        class="bg-primary-200 w-fill-available h-fill-available p-4 overflow-y-auto relative"
        onSubmit={handleSubmit}
      >
        <h3>Host Details</h3>

        <p class="mt-2">Name</p>
        <Input type="text" class="w-full" name="name" value={host.data?.name} />
        <span class="text-red-500">{formErrorMap().get("name")?.message}</span>
        <p class="mt-2">IP</p>
        <Input
          type="text"
          class="w-full"
          name="address"
          value={host.data?.address}
        />
        <span class="text-red-500">{formErrorMap().get("address")?.message}</span>

        <p class="mt-2">SSH Username</p>
        <Input
          type="text"
          class="w-full"
          name="ssh_user"
          value={host.data?.ssh_user}
          pattern="^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}\$)$"
        />
        <span class="text-red-500">{formErrorMap().get("ssh_user")?.message}</span>

        <p class="mt-2">Role</p>
        <Select
          options={tauriCtx.hostRoles.data ?? []}
          class="w-full"
          name="role"
          defaultValue={host.data?.role}
          emptyOption="#No role"
          showEmptyOption
          onInput={(v) => console.log(v.currentTarget.value)}
        />
        <span class="text-red-500">{formErrorMap().get("role")?.message}</span>

        <p class="mt-2">Assign to cluster (optional)</p>
        <Select
          options={clustersCtx.clusters.data?.map((c) => c.id.toString()) ?? []}
          class="w-full"
          name="cluster_id"
          emptyOption="#No Cluster"
          defaultValue={host.data?.cluster_id?.toString()}
          showEmptyOption
          format={(v) => clustersCtx.clustersMap().get(v)?.name ?? "#No Cluster"}
          onInput={(v) => console.log(v.currentTarget.value)}
        />
        <span class="text-red-500">{formErrorMap().get("cluster_id")?.message}</span>

        <p class="mt-2">Status: {" "}
          <Show when={hostStatus.isLoading} >
            <span class="font-bold">Loading...</span>
          </Show>
          <Show when={hostStatus.data} >
            <span class="font-bold text-green-500">{hostStatus.data}</span>
          </Show>
          <Show when={hostStatus.error} >
            <span class="font-bold text-red-500">Error - {hostStatus.error?.message}</span>
          </Show>
        </p>

        <Show when={hostStatus.error} >
          <span class="block">
            Note: Make sure you have connected and added your local key to this host using ssh-copy-id.
          </span>
        </Show>

        <Show when={formError()} >
          <span class="block text-red-500">
            Some data is invalid. Please correct the errors and try again.
          </span>
        </Show>

        <Button class="sticky mt-8 bottom-2">
          Save
        </Button>
      </form>
    </Drawer>
  )
}
