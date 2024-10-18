import { createSignal, onCleanup } from 'solid-js'
import { makePersisted } from '@solid-primitives/storage'

export const [isMaximized, setIsMaximized] = createSignal(false)
export const [isSidebarOpen, setIsSidebarOpen] = makePersisted(
  createSignal(true),
  { name: 'isSidebarOpen' }
)
