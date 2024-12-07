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

export const UpdateHostDrawer = () => {
  const { updatingHostId, setShowUpdateHostForm } = useUIController()
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

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const id = updatingHostId()
    if (id === undefined) return;
    const target = e.target as HTMLFormElement
    const formData = new FormData(target)
    const formatedData = Object.fromEntries(formData.entries())
    console.debug({ formatedData })
    toast.loading("Updating host...", { id: "update-host" })
    updateHost(updateHostSchema.parse({
      ...formatedData,
      id
    }))
      .then(() => {
        toast.success("Host updated", { id: "update-host" })
        // TODO: Refetch hosts
        // hostsCxt.hosts.refetch()
        setShowUpdateHostForm()
      })
      .catch((e) => {
        toast.error("Failed to update host: " + e.message, { id: "update-host" })
        console.error(e)
      })

  }

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

        <p class="mt-2">IP</p>
        <Input type="text" class="w-full" name="address" value={host.data?.address} />

        <p class="mt-2">SSH Username</p>
        <Input type="text" class="w-full" name="ssh_user" value={host.data?.ssh_user} />

        <p class="mt-2">Assign to cluster (optional)</p>

        <Select
          options={clustersCtx.clusters.data?.map((c) => c.id.toString()) ?? []}
          class="w-full"
          name="cluster_id"
          format={(v) => clustersCtx.clustersMap().get(v)?.name ?? "Unknown"}
          onInput={(v) => console.log(v.currentTarget.value)}
        />
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
        <Button class="sticky mt-8 bottom-2">
          Save
        </Button>
      </form>
    </Drawer>
  )
}
