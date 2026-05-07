import Image from "next/image";
import instagram_img from "@/public/instagram_icon.png";
import facebook_img from "@/public/facebook_icon.png";
import youtube_img from "@/public/youtube_icon.png";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar";

const projects = [
  {
    name: "Instagram",
    url: "#",
    icon: (
      <Image src={instagram_img} width={25} height={25} alt="Instagram Logo" />
    ),
  },
  {
    name: "Facebook",
    url: "#",
    icon: (
      <Image src={facebook_img} width={25} height={25} alt="Facebook Logo" />
    ),
  },
  {
    name: "Youtube",
    url: "#",
    icon: <Image src={youtube_img} width={25} height={25} alt="Youtube Logo" />,
  },
];

export function NavProjects() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Connect Channels</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                {item.icon}
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
