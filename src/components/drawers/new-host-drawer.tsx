import { useUIController } from "../../contexts/ui-controller";
import { Drawer } from "../share/drawer";
import { Button } from "../share/button";
import { Input } from "../share/input";
import { Select } from "../share/select";
import { addHost } from "../../commands/hosts";
import toast from "solid-toast";

export const NewHostDrawer = () => {
  const { isShowNewHostForm, setShowNewHostForm } = useUIController()
  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const target = e.target as HTMLFormElement
    const formData = new FormData(target)
    const name = formData.get('name') as string
    const address = formData.get('address') as string
    const ssh_key_path = formData.get('ssh_key_path') as string
    const ssh_user = formData.get('ssh_user') as string
    toast.loading("Adding host...", { id: "add-host" })
    addHost({ name, address, ssh_key_path, ssh_user })
      .then(() => {
        toast.success("Host added", { id: "add-host" })
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

        <p class="mt-2">SSH Key</p>
        <Select
          options={fakeSSHKeys}
          class="w-full"
          format={(v) => "formated-text-" + v}
          onInput={(v) => console.log(v.currentTarget.value)}
          name="ssh_key_path"
        />
        <p class="mt-2">Assign to cluster (optional)</p>

        <Select
          options={fakeClusterIds}
          class="w-full"
          format={(v) => "formated-text-" + v}
          onInput={(v) => console.log(v.currentTarget.value)}
        />
        <Button class="sticky mt-8 bottom-2">
          Create
        </Button>
      </form>
    </Drawer>
  )
}


const fakeSSHKeys = [
  'ssh-key-1',
  'ssh-key-2',
  'ssh-key-3',
  'ssh-key-4',
]

const fakeClusterIds = [
  'cluster-1',
  'cluster-2',
  'cluster-3',
  'cluster-4',
  'cluster-5',
  'cluster-6',
  'cluster-7',
  'cluster-8',
  'cluster-9',
  'cluster-10',
  'cluster-11',
  'cluster-12',
  'cluster-13',
  'cluster-14',
  'cluster-15',
  'cluster-16',
  'cluster-17',
  'cluster-18',
  'cluster-19',
]

