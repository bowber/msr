import { confirm, ConfirmDialogOptions } from '@tauri-apps/plugin-dialog'

export const askConfirmation = async (
    onConfirm: () => void,
    title = 'Are you sure?',
    opts?: ConfirmDialogOptions
) => {
  if (await confirm(title, opts)) {
    onConfirm()
  }
}
