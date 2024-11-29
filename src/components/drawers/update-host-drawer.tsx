import { useUIController } from "../../contexts/ui-controller";
import { Drawer } from "../share/drawer";
import { Button } from "../share/button";
import { FilePathInput, Input, PasswordInput } from "../share/input";
import { Select } from "../share/select";
import { updateHost, updateHostSchema } from "../../commands/hosts";
import toast from "solid-toast";
import { homeDir, join } from '@tauri-apps/api/path';
import { useHosts } from "../../contexts/hosts";
import { createMemo } from "solid-js";
import { useClusters } from "../../contexts/clusters";

export const UpdateHostDrawer = () => {
  const { updatingHostId, setShowUpdateHostForm } = useUIController()
  const hostsCxt = useHosts();
  const clustersCtx = useClusters();

  const host = createMemo(() => {
    return hostsCxt.hosts.data?.find(h => h.id === updatingHostId())
  })

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
        hostsCxt.hosts.refetch()
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
        <Input type="text" class="w-full" name="name" value={host()?.name} />

        <p class="mt-2">IP</p>
        <Input type="text" class="w-full" name="address" value={host()?.address} />

        <p class="mt-2">SSH Username</p>
        <Input type="text" class="w-full" name="ssh_user" value={host()?.ssh_user} />

        <p class="mt-2">SSH Password</p>
        <PasswordInput class="w-full" name="ssh_password" value={host()?.ssh_password} />

        <p class="mt-2">SSH Key</p>
        <FilePathInput
          class="w-full"
          placeholder="Select SSH Key"
          name="ssh_key_path"
          openDialogOptions={async () => ({
            defaultPath: await join(await homeDir(), ".ssh"),
            filters: [{ name: 'SSH Key', extensions: ['pub'] }]
          })}
          value={host()?.ssh_key_path}
        />
        <p class="mt-2">Assign to cluster (optional)</p>

        <Select
          options={clustersCtx.clusters.data?.map((c) => c.id.toString()) ?? []}
          class="w-full"
          name="cluster_id"
          format={(v) => clustersCtx.clustersMap().get(v)?.name ?? "Unknown"}
          onInput={(v) => console.log(v.currentTarget.value)}
        />
        <Button class="sticky mt-8 bottom-2">
          Save
        </Button>
      </form>
    </Drawer>
  )
}
