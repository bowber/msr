import { invoke } from '@tauri-apps/api'
import { z } from 'zod'

export const getClusters = async () => {
  return await invoke('get_clusters').then(z.array(z.any()).parse)
}
