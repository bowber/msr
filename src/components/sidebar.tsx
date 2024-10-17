import { useLocation } from "@solidjs/router";
import clsx from "clsx";
import { createEffect } from "solid-js";

export const Sidebar = () => {
  return (
    <div
      class="w-12 h-svh bg-primary-200 border-r-1 border-primary-300"
    >
      {/* Handle */}
      <div class="flex flex-col items-end justify-start ">
        <NavLink icon="/icons/gizmo.svg" link="/" tooltip="Clusters" />
        <NavLink icon="/icons/server.svg" link="/hosts" tooltip="Hosts" />
        <NavLink icon="/icons/sphere.svg" link="/services" tooltip="Services" />
        <NavLink icon="/icons/robot.svg" link="/script-runner" tooltip="Scripts Runner" />
        <NavLink icon="/icons/network.svg" link="/network" tooltip="Network" />
      </div>
    </div>
  );
}

export const NavLink = (props: { icon: string, tooltip: string, link: string }) => {
  const location = useLocation();
  const isActive = () => location.pathname === props.link;
  createEffect(() => {
    console.log(location.pathname, props.link, isActive());
  });
  return (
    <a
      class={clsx(
        "w-32 h-12 px-3 flex items-center justify-between gap-4 hover:bg-primary-300 active:invert duration-300 rounded-r-xl hover:translate-x-20",
        isActive() && "bg-primary-300"
      )}
      title={props.tooltip}
      href={props.link}
    >
      <span class="leading-tight">{props.tooltip}</span>
      <img src={props.icon} alt={props.tooltip} />
    </a>
  );
}