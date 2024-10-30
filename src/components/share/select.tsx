import clsx from "clsx"
import { JSX } from "solid-js"

export interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[]
  defaultValue?: string
  format?: (option: string) => JSX.Element
  style?: JSX.CSSProperties
}

export const Select = (props: SelectProps) => {
  return (
    <select
      {...props}
      class={clsx(
        "border-2 border-primary-900 rounded-lg text-center ",
        props.class
      )}
      style={{
        "text-align-last": "center",
        ...props.style
      }}
    >
      {props.options.map(option => (
        <option value={option}>{props.format?.(option) ?? option}</option>
      ))}
    </select>
  )
}