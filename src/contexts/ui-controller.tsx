import { createContext, createSignal, ParentComponent, useContext } from 'solid-js'
interface ConfirmModalData {
  title: string
  message: string
  onConfirm: () => void
}
interface UIController {
  isShowNewClusterForm: () => boolean
  setShowNewClusterForm: (value: boolean) => void
  isShowNewHostForm: () => boolean
  isShowNewServiceForm: () => boolean
  setShowNewServiceForm: (value: boolean) => void
  isShowNewNamespaceForm: () => boolean
  setShowNewNamespaceForm: (value: boolean) => void
  setShowNewHostForm: (value: boolean) => void
  updatingHostId: () => number | undefined
  setShowUpdateHostForm: (id?: number) => void
  isMaximized: () => boolean
  setIsMaximized: (value: boolean) => void
  confirmModalData: () => ConfirmModalData | undefined
  setConfirmModalData: (value: ConfirmModalData) => void
}

const UIControllerContext = createContext<UIController | null>(null);

export const useUIController = () => {
  const context = useContext(UIControllerContext)
  if (!context)
    throw new Error(
      'useUIController must be used within a UIControllerProvider'
    )
  return context
}

export const UIControllerProvider: ParentComponent = (props) => {
  // UI Show/Hide
  const [isShowNewClusterForm, setShowNewClusterForm] = createSignal(false)
  const [isShowNewHostForm, setShowNewHostForm] = createSignal(false)
  const [updatingHostId, setShowUpdateHostForm] = createSignal<number>()
  const [isShowNewServiceForm, setShowNewServiceForm] = createSignal(false)
  const [isShowNewNamespaceForm, setShowNewNamespaceForm] = createSignal(false)

  // UI State
  const [isMaximized, setIsMaximized] = createSignal(false)

  // Customizable Modals Data (undefined for not showing)
  const [confirmModalData, setConfirmModalData] = createSignal<ConfirmModalData>()

  return (
    <UIControllerContext.Provider
      value={{
        isShowNewClusterForm,
        setShowNewClusterForm,
        isShowNewHostForm,
        setShowNewHostForm,
        updatingHostId,
        setShowUpdateHostForm,
        isShowNewServiceForm,
        setShowNewServiceForm,
        isShowNewNamespaceForm,
        setShowNewNamespaceForm,
        isMaximized,
        setIsMaximized,
        confirmModalData,
        setConfirmModalData
      }}
    >
      {props.children}
    </UIControllerContext.Provider>
  )
}
