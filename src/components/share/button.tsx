import clsx from "clsx";
import { Component } from "solid-js";
import { BaseButton, BaseButtonProps } from "./base-button";

export interface ButtonProps extends BaseButtonProps {
  variant?: "primary" | "secondary" | "danger"
};
export const Button: Component<ButtonProps> = (props) => {

  return (
    <BaseButton
      {...props}
      class={clsx(
        "border-2 py-1 px-2 rounded-lg",
        (props.variant === "primary" || !props.variant) && "bg-primary-900 text-white border-primary-900",
        props.variant === "secondary" && "bg-white text-primary-900 border-primary-900",
        props.variant === "danger" && "bg-red-900 text-white border-red-900",
        props.class
      )}
    >
      {props.children}
    </BaseButton>

  )
}