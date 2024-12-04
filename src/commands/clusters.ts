import { invoke } from '@tauri-apps/api/core'
import { z } from 'zod'
import { dateFromArraySchema } from '../utils/zod'

export const getClusters = async () => {
  const clusters = await invoke('get_clusters')
  console.debug('Original clusters: ', clusters)
  return z.array(clusterSchema).parse(clusters)
}

const clusterSchema = z.object({
  id: z.number(),
  name: z.string(),
  lb_address: z.string(),
  updated_at: dateFromArraySchema,
  created_at: dateFromArraySchema,
})

export type Cluster = z.infer<typeof clusterSchema>

export const addCluster = async (
  cluster: Omit<Cluster, 'id' | 'updated_at' | 'created_at'>
) => {
  return await invoke('add_cluster', { cluster })
}

export const deleteCluster = async (id: number) => {
  return await invoke('delete_cluster', { id })
}

export const updateCluster = async (
  cluster: Partial<Cluster> & { id: Cluster['id'] }
) => {
  return await invoke('update_cluster', { cluster })
}

export const applyCluster = async (cluster_id: number, host_ids: number[]) => {
  return await invoke('apply_cluster', { cluster_id, host_ids })
}
