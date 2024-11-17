import { invoke } from '@tauri-apps/api/core'
import { z } from 'zod'

export const getHosts = async () => {
  return await invoke('get_hosts').then(z.array(hostSchema).parse)
}

const hostSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  ssh_user: z.string(),
  ssh_key_path: z.string().optional(),
  ssh_password: z.string().optional(),
})

export type Host = z.infer<typeof hostSchema>

export const addHost = async (host: Omit<Host, 'id'>) => {
  return await invoke('add_host', { host })
}

export const deleteHost = async (id: number) => {
  return await invoke('delete_host', { id })
}

export const updateHost = async (host: Partial<Host> & { id: Host['id'] }) => {
  return await invoke('update_host', { host })
}
