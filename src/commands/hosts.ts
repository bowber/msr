import { invoke } from '@tauri-apps/api/core'
import { z } from 'zod'
import { dateFromArraySchema, stringToNumberSchema } from '../utils/zod'

const getHostsOptionsSchema = z
  .object({
    cluster_id: stringToNumberSchema.optional(),
    host_id: z.number().optional(),
  })
  .optional()

type GetHostsOptions = z.infer<typeof getHostsOptionsSchema>

export const getHosts = async (options: GetHostsOptions = {}) => {
  const hosts = await invoke('get_hosts', {
    options: getHostsOptionsSchema.parse(options),
  })
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

export const newHostSchema = hostSchema
  .omit({
    id: true,
    updated_at: true,
    created_at: true,
  })
  .extend({
    cluster_id: stringToNumberSchema.optional(),
  })

export const updateHostSchema = newHostSchema
  .partial()
  .extend({ id: z.number() })

export const pingHostSchema = z.object({
  host: z.string(),
})

export type Host = z.infer<typeof hostSchema>
export type NewHostType = z.infer<typeof newHostSchema>
export type UpdateHostType = z.infer<typeof updateHostSchema>
export type PingHostConfig = z.infer<typeof pingHostSchema>

export const addHost = async (host: NewHostType) => {
  return await invoke('add_host', { host })
}

export const deleteHost = async (id: number) => {
  return await invoke('delete_host', { id })
}

export const updateHost = async (host: UpdateHostType) => {
  console.log('Updating host: ', host)
  return await invoke('update_host', { host })
}

export const pingHost = async (config: PingHostConfig) => {
  console.log('Pinging host: ', config)
  const status = await invoke('ping_ssh', { config })
  .catch((e) => {
    console.error(e)
    throw new Error(e??'Failed to ping host')
  })
  return z.string().parse(status)
}
