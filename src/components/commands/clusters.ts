import { invoke } from '@tauri-apps/api'
import { z } from 'zod'

export const get_clusters = async () => {
  return await invoke('get_clusters').then(z.string().parse)
}
