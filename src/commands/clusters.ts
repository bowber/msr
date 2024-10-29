import { invoke } from '@tauri-apps/api'
import { z } from 'zod'

export const getClusters = async () => {
  return await invoke('get_clusters').then(z.string().parse)
}
export const getHosts = async () => {
  return await invoke('get_hosts').then(z.string().parse)
}
