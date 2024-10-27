import { isShowNewHostForm, setShowNewHostForm } from "../../contexts/ui-controller";
import { Drawer } from "../share/drawer";
import { Button } from "../share/button";
import { Input } from "../share/input";
import { Select } from "../share/select";

export const NewHostDrawer = () => {
  return (
    <Drawer
      isOpen={isShowNewHostForm()}
      onClose={() => setShowNewHostForm(false)}
    >
      <div class="bg-primary-200 w-fill-available h-fill-available p-4 overflow-y-auto relative">
        <h3>New Host</h3>

        <p class="mt-2">Name</p>
        <Input type="text" class="w-full" />

        <p class="mt-2">IP</p>
        <Input type="text" class="w-full" />

        <p class="mt-2">SSH Key</p>
        <Select
          options={fakeSSHKeys}
          class="w-full"
          format={(v) => "formated-text-" + v}
          onInput={(v) => console.log(v.currentTarget.value)}
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
      </div>
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

