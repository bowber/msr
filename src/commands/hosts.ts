import { invoke } from '@tauri-apps/api/core'
import { z } from 'zod'
import { dateFromArraySchema } from '../utils/zod'

export const getHosts = async () => {
  const hosts = await invoke('get_hosts')
  console.debug('Original hosts: ', hosts)
  return z.array(hostSchema).parse(hosts)
}

const hostSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  ssh_user: z.string(),
  ssh_key_path: z.string().optional(),
  ssh_password: z.string().optional(),
  cluster_id: z.number().optional(),
  updated_at: dateFromArraySchema,
  created_at: dateFromArraySchema,
})

export type Host = z.infer<typeof hostSchema>

export const addHost = async (
  host: Omit<Host, 'id' | 'updated_at' | 'created_at'>
) => {
  return await invoke('add_host', { host })
}

export const deleteHost = async (id: number) => {
  return await invoke('delete_host', { id })
}

export const updateHost = async (host: Partial<Host> & { id: Host['id'] }) => {
  console.log('Updating host: ', host)
  return await invoke('update_host', { host })
}
