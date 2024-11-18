import { useUIController } from "../../contexts/ui-controller";
import { Drawer } from "../share/drawer";
import { Button } from "../share/button";
import { Input } from "../share/input";
import { Select } from "../share/select";
import { CPUOptions, RAMOptions } from "../../utils/service";

export const NewServiceDrawer = () => {
  const { isShowNewServiceForm, setShowNewServiceForm } = useUIController()
  return (
    <Drawer
      isOpen={isShowNewServiceForm()}
      onClose={() => setShowNewServiceForm(false)}
    >
      <div class="bg-primary-200 w-fill-available h-fill-available p-4 overflow-y-auto relative">
        <h3>New Service</h3>

        <h6 class="mt-4">Name</h6>
        <Input type="text" class="w-full" />

        <h6 class="mt-4">Repository</h6>
        <Button class="w-full" variant="secondary" >Connect to <b>Github/Gitea</b></Button>

        <h6 class="mt-4">Port</h6>
        <Input type="number" class="w-full" value={8080} />

        <h6 class="mt-4">Assign to cluster (optional)</h6>
        <Select
          options={fakeClusterIds}
          class="w-full"
          format={(v) => "formated-text-" + v}
          onInput={(v) => console.log(v.currentTarget.value)}
        />
        <h6 class="mt-4">Auto scaling</h6>
        <div class="flex gap-4">
          <span class="mt-auto">Min replicas</span>
          <span class="mt-auto ml-auto">Max replicas</span>
        </div>
        <div class="flex gap-4">
          <Input type="number" class="w-1/2" placeholder="min replicas" value={0} />
          <Input type="number" class="w-1/2" placeholder="max replicas" value={1} />
        </div>

        <h6 class="mt-4">System</h6>
        <div class="flex gap-4">
          <span class="mt-auto">CPU</span>
          <span class="mt-auto ml-auto">RAM</span>
        </div>
        <div class="flex gap-4">
          <Select
            options={CPUOptions}
            class="w-1/2"
            onInput={(v) => console.log(v.currentTarget.value)}
          />
          <Select
            options={RAMOptions}
            class="w-1/2"
            onInput={(v) => console.log(v.currentTarget.value)}
          />
        </div>

        <h6 class="mt-4">Namespace</h6>
        <Select
          options={namespacesList}
          class="w-full"
          format={(v) => v === "#new"
            ? <>
              New namespace <br />
              (recommended for standalone services)
            </>
            : "formated-text-" + v
          }
          onInput={(v) => console.log(v.currentTarget.value)}
        />

        <Button class="sticky mt-8 bottom-2">
          Create
        </Button>
      </div>
    </Drawer>
  )
}


const namespacesList = [
  '#new',
  'namespace-1',
  'namespace-2',
  'namespace-3',
  'namespace-4',
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

