import { invoke } from '@tauri-apps/api/core'
import { z } from 'zod'

export const setupTauri = async () => {
  return await invoke('setup').then(z.null().parse)
}
