import { useUIController } from "../../contexts/ui-controller";
import { Drawer } from "../share/drawer";
import { Button } from "../share/button";
import { Input } from "../share/input";
import { Select } from "../share/select";
import { addHost, newHostSchema } from "../../commands/hosts";
import toast from "solid-toast";
import { useClusters } from "../../contexts/clusters";

export const NewHostDrawer = () => {
  const { isShowNewHostForm, setShowNewHostForm } = useUIController()
  
  const clustersCtx = useClusters();

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const target = e.target as HTMLFormElement
    const formData = new FormData(target)
    const formatedData = Object.fromEntries(formData.entries())
    console.debug({formatedData})
    
    toast.loading("Adding host...", { id: "add-host" })
    addHost(newHostSchema.parse(formatedData))
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

        <p class="mt-2">Assign to cluster (optional)</p>

        <Select
          options={clustersCtx.clusters.data?.map((c) => c.id.toString()) ?? []}
          class="w-full"
          name="cluster_id"
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

