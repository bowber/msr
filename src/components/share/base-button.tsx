import clsx from "clsx";
import { throttle } from "lodash";
import { Component } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export interface BaseButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  scaleOnClick?: boolean;
  onClick?: (e: MouseEvent) => void;
  onclick?: (e: MouseEvent) => void;
  throttleDelay?: number;
}
export const BaseButton: Component<BaseButtonProps> = (props) => {
  const handleClick = (e: MouseEvent) => {
    props.onClick?.(e)
    props.onclick?.(e)
  }
  return (
    <button
      {...props}
      class={clsx(
        !props.disabled && "hover:contrast-75 active:contrast-125 pointer-events-auto",
        props.scaleOnClick && "active:scale-90",
        props.class
      )}
      onClick={throttle(handleClick, props.throttleDelay ?? 100)}
    >
      {props.children}
    </button>
  )
}