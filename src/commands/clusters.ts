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

export const newClusterSchema = clusterSchema
  .omit({
    id: true,
    updated_at: true,
    created_at: true,
  })
  .extend({
    lb_address: z.string().ip(),
    hostIds: z.array(z.number()).min(1, 'Please select at least one host'),
  })

export const updateClusterSchema = newClusterSchema
  .partial()
  .extend({ id: z.number() })

export type Cluster = z.infer<typeof clusterSchema>

export const addCluster = async (
  cluster: Omit<Cluster, 'id' | 'updated_at' | 'created_at'>,
  hostIds: number[]
) => {
  console.log('addCluster', cluster, hostIds)
  return await invoke('add_cluster', {
    cluster,
    hostIds,
  })
}

export const deleteCluster = async (id: number) => {
  return await invoke('delete_cluster', { id })
}

export const updateCluster = async (
  cluster: Partial<Cluster> & { id: Cluster['id'] },
  hostIds: number[]
) => {
  return await invoke('update_cluster', { cluster, hostIds })
}
