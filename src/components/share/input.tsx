import clsx from "clsx";
import { Component } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

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