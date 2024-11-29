import clsx from "clsx";
import { Component, createSignal, Show } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { open, OpenDialogOptions } from '@tauri-apps/plugin-dialog';
import { BaseButton } from "./base-button";

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
}
export const Input: Component<InputProps> = (props) => {
  return (
    <input
      {...props}
      class={clsx(
        'border-2 border-primary-900 p-1 rounded-lg text-center',
        props.class
      )}
    >
      {props.children}
    </input>
  )
}

export const PasswordInput: Component<InputProps> = (props) => {
  const [showPassword, setShowPassword] = createSignal(false)
  return (
    <div class="relative">
      <Input
        type={showPassword() ? "text" : "password"}
        {...props}
      />
      <BaseButton
        type="button"
        onPointerDown={() => setShowPassword(true)}
        onPointerUp={() => setShowPassword(false)}
        class="absolute right-2 top-1/2 -translate-y-1/2 z-10"
      >
        <img src="/icons/eye.svg" alt="show password" class="h-full" />
      </BaseButton>
    </div>
  )
}

interface FilePathInputProps extends InputProps {
  openDialogOptions?: () => OpenDialogOptions | Promise<OpenDialogOptions>
}
export const FilePathInput: Component<FilePathInputProps> = (props) => {
  const [value, setValue] = createSignal("")
  return (
    <Input
      class={clsx(
        "cursor-pointer",
        props.class
      )}
      readOnly
      value={value()}
      onClick={async (e) => {
        const file = await open({
          multiple: false,
          directory: false,
          ...(await props.openDialogOptions?.())
        });
        setValue(file ?? "")
      }}
      placeholder="Select Path"
      {...props}
    />
  )
}