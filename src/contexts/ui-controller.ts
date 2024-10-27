import { createSignal } from 'solid-js'

// UI Show/Hide
export const [isShowNewClusterForm, setShowNewClusterForm] = createSignal(false)
export const [isShowNewHostForm, setShowNewHostForm] = createSignal(false)
export const [isShowNewServiceForm, setShowNewServiceForm] = createSignal(false)
export const [isShowNewNamespaceForm, setShowNewNamespaceForm] =
  createSignal(false)

// UI State
export const [isMaximized, setIsMaximized] = createSignal(false)

// Customizable Modals Data (undefined for not showing)
export const [confirmModalData, setConfirmModalData] = createSignal<{
  title: string
  message: string
  onConfirm: () => void
}>()
