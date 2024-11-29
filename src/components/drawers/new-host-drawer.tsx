import { useUIController } from "../../contexts/ui-controller";
import { Drawer } from "../share/drawer";
import { Button } from "../share/button";
import { FilePathInput, Input, PasswordInput } from "../share/input";
import { Select } from "../share/select";
import { addHost } from "../../commands/hosts";
import toast from "solid-toast";
import { homeDir, join } from '@tauri-apps/api/path';
import { useHosts } from "../../contexts/hosts";
import { useClusters } from "../../contexts/clusters";
import { createMemo } from "solid-js";

export const NewHostDrawer = () => {
  const { isShowNewHostForm, setShowNewHostForm } = useUIController()
  const hostsCtx = useHosts();
  const clustersCtx = useClusters();

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const target = e.target as HTMLFormElement
    const formData = new FormData(target)
    const name = formData.get('name') as string
    const address = formData.get('address') as string
    const ssh_key_path = formData.get('ssh_key_path') as string
    const ssh_user = formData.get('ssh_user') as string
    const ssh_password = formData.get('ssh_password') as string
    toast.loading("Adding host...", { id: "add-host" })
    addHost({ name, address, ssh_key_path, ssh_user, ssh_password })
      .then(() => {
        toast.success("Host added", { id: "add-host" })
        hostsCtx.hosts.refetch()
        setShowNewHostForm(false)
      })
      .catch((e) => {
        toast.error("Failed to add host: " + e.message, { id: "add-host" })
        console.error(e)
      })

  }
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

        <p class="mt-2">IP</p>
        <Input type="text" class="w-full" name="address" />

        <p class="mt-2">SSH Username</p>
        <Input type="text" class="w-full" name="ssh_user" />

        <p class="mt-2">SSH Password</p>
        <PasswordInput class="w-full" name="ssh_password" />

        <p class="mt-2">SSH Key</p>
        <FilePathInput
          class="w-full"
          placeholder="Select SSH Key"
          name="ssh_key_path"
          openDialogOptions={async () => ({
            defaultPath: await join(await homeDir(), ".ssh"),
            filters: [{ name: 'SSH Key', extensions: ['pub'] }]
          })}
        />
        <p class="mt-2">Assign to cluster (optional)</p>

        <Select
          options={clustersCtx.clusters.data?.map((c) => c.id.toString()) ?? []}
          class="w-full"
          format={(v) => clustersCtx.clustersMap().get(v)?.name ?? "Unknown"}
          onInput={(v) => console.log(v.currentTarget.value)}
        />
        <Button class="sticky mt-8 bottom-2">
          Create
        </Button>
      </form>
    </Drawer>
  )
}

