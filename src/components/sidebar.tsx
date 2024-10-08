export const Sidebar = () => {
  return (
    <div
      class="w-12 h-full bg-primary-200"
    >
      {/* Handle */}
      <div class="flex flex-col pace-y-1 items-center justify-center ">
        <NavLink icon="/icons/server.svg" link="/hosts" tooltip="Hosts" />
        <NavLink icon="/icons/sphere.svg" link="/services" tooltip="Services" />
        <NavLink icon="/icons/robot.svg" link="/script-runner" tooltip="Scripts Runner" />
        <NavLink icon="/icons/network.svg" link="/network" tooltip="Network" />
      </div>
    </div>
  );
}

export const NavLink = (props: { icon: string, tooltip: string, link: string }) => {
  return (
    <a
      class="w-12 h-12 flex items-center justify-center hover:bg-primary-300"
      title={props.tooltip}
      href={props.link}
    >
      <img src={props.icon} alt={props.tooltip} />
    </a>
  );
}