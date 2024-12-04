import clsx from "clsx"
import { createEffect, JSX, Show } from "solid-js"

export interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[]
  defaultValue?: string
  format?: (option: string) => JSX.Element
  style?: JSX.CSSProperties
  variant?: "secondary"
  emptyOption?: string
  showEmptyOption?: boolean
}

export const Select = (props: SelectProps) => {
  let select: HTMLSelectElement | undefined;

  createEffect(() => {
    if (select === undefined) return;
    if (props.defaultValue) {
      select.value = props.defaultValue
    }
  })

  return (
    <select
      {...props}
      ref={select}
      class={clsx(
        "text-center",
        props.variant === undefined && "border-2 border-primary-900 rounded-lg",
        props.variant === "secondary" && "bg-transparent p-1 appearance-none",
        props.class,
      )}
      style={{
        "text-align-last": "center",
        ...props.style
      }}
    >
      <Show when={props.showEmptyOption}>
        <option value=''>{props.format?.(props.emptyOption ?? "") ?? props.emptyOption}</option>
      </Show>
      {props.options.map(option => (
        <option value={option}>{props.format?.(option) ?? option}</option>
      ))}
    </select>
  )
}