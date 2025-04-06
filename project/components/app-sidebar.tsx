"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  EarthLock,
  WalletCards, 
  Headset,
  CircleHelp,
  ArrowLeftRight,
  LayoutDashboard,
  Rocket,
  } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"



export function AppSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: Session }) {
const data = {
  user: {
    name: session.user.name,
    email: session.user.email,
    avatar: session.user.image,
  },
  teams: [
    {
      name: "Lock n' Go",
      logo: Rocket,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
    },
    {
      title: "Transactions",
      url: "#",
      icon: ArrowLeftRight,
      isActive: true,
      items: [
        {
          title: "Create A Transaction",
          url: "#",
        },
        {
          title: "Join A Transaction",
          url: "#",
        },
        {
          title: "View Transactions",
          url: "#",
        },
      ],
    },
    {
      title: "My Banks",
      url: "#",
      icon: WalletCards,
      items: [
        {
          title: "Add Bank",
          url: "#",
        },
        {
          title: "View Banks",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Assistance Center",
      url: "#",
      icon: Headset,
    },
    {
      name: "Help Center",
      url: "#",
      icon: CircleHelp,
    },
    {
      name: "User Settings",
      url: "#",
      icon: Settings2,
    },
  ],
}


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
