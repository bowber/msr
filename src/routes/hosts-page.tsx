import dayjs from "dayjs";
import { For, Show } from "solid-js";
import { BaseButton } from "../components/share/base-button";
import { useUIController } from "../contexts/ui-controller";
import { useHosts } from "../contexts/hosts";
import { deleteHost, Host } from "../commands/hosts";
import { askConfirmation } from "../utils/tauri";

export const HostsPage = () => {
  const { setShowNewHostForm } = useUIController();
  const hostsContext = useHosts();
  return (
    <div class="p-4 w-fill-available h-fill-available  relative">
      <div class="flex">
        <h2>Hosts</h2>
        <BaseButton class="h-8" onClick={() => hostsContext.hosts.refetch()}>
          <img
            src="/icons/refresh.svg"
            alt="refresh"
          />
        </BaseButton>
        <BaseButton class="ml-auto text-primary-900" onClick={() => setShowNewHostForm(true)}>
          Create Host
        </BaseButton>
      </div>
      <BaseButton>
        <p>SupaClusta</p>
      </BaseButton>
      <br />
      <Show when={Number(hostsContext.hosts.data?.length) > 0} fallback={<span>No host found</span>}>
        <div class="p-1 rounded bg-primary-900 w-full">
          <div class="overflow-y-auto space-y-1 max-h-[calc(100vh-9rem)]">
            <For each={hostsContext.hosts.data}>
              {(hosts) => (
                <HostDisplay host={hosts} />
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
}

const HostDisplay = (props: { host: Host }) => {
  const hostsCtx = useHosts();
  const ui = useUIController();
  return (
    <div class="bg-primary-100 p-2 first:rounded-t last:rounded-b">
      <div class="flex items center justify-start">
        {/* Col 1 */}
        <div class="flex flex-col">
          <h4>{props.host.name}</h4>
          <span class="mt-auto">Updated: <b>{dayjs(props.host.updated_at).fromNow()}</b></span>
          <span>Created: <b>{dayjs(props.host.created_at).fromNow()}</b></span>
          <span>Cluster: <b>{"NULL"}</b></span>
        </div>

        {/* Col 2 */}
        <div class="ml-4 flex flex-col">
          <span>Status: <b class="text-green-400">{"NULL"}</b></span>
          <span>Type: <b>{"NULL"}</b></span>
          <span>Pods:  <b>{"NULL"}</b></span>
          <span>CPU ult: <b>{"NULL"}/{"NULL"}</b></span>
          <span>RAM usage: <b>{"NULL"}/{"NULL"} GiB</b></span>
        </div>
        {/* Col 3 */}
        <div class="ml-auto flex self-center">
        </div>

        {/* Col 4 */}
        <div class="ml-auto flex self-center">
          <BaseButton class="h-8" onClick={() => ui.setShowUpdateHostForm(props.host.id)}>
            <img src="/icons/edit.svg" alt="edit" />
          </BaseButton>
          <BaseButton class="h-8">
            <img src="/icons/device-desktop-analytics.svg" alt="analytics" />
          </BaseButton>
          <BaseButton class="h-8" onClick={() => askConfirmation(
            () => deleteHost(props.host.id).then(() => hostsCtx.hosts.refetch()),
            `Delete ${props.host.name}?`,
            { kind: 'warning' }
          )}>
            <img src="/icons/x.svg" alt="delete" />
          </BaseButton>
        </div>
      </div>
    </div >
  );
}