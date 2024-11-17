
import { invoke } from '@tauri-apps/api/core'
import { z } from 'zod'

export const getClusters = async () => {
  return await invoke('get_clusters').then(z.array(z.any()).parse)
}
