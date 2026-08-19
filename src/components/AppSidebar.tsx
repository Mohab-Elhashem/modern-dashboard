"use client"

import {Calendar,ChevronDown,ChevronUp,CircleDollarSign,Home,MapPinSearch,Plus,Projector,Settings,User,User2,} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {Sidebar,SidebarContent,SidebarFooter,SidebarGroup,SidebarGroupAction,SidebarGroupContent,SidebarGroupLabel,SidebarHeader,SidebarMenu,
SidebarMenuBadge,SidebarMenuButton,SidebarMenuItem,SidebarMenuSub,SidebarMenuSubButton,SidebarMenuSubItem,SidebarSeparator,
useSidebar,} from "./ui/sidebar"
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,} from "./ui/dropdown-menu"
import {Collapsible,CollapsibleContent,CollapsibleTrigger,} from "./ui/collapsible"
import { cn } from "@/lib/utils"

const items = [
    { title: "Home", url: "/", icon: Home },
    { title: "User", url: "/users/craftsman", icon: User },
    { title: "Payments", url: "/payments", icon: CircleDollarSign },
    { title: "Calendar", url: "/calendar", icon: Calendar },
    { title: "Maps", url: "/maps", icon: MapPinSearch },
    { title: "Settings", url: "#", icon: Settings },
]

const AppSidebar = () => {
    const pathname = usePathname()
    // close sidebar at mobil
    const { isMobile, setOpenMobile } = useSidebar()
    const handleLinkClick = () => {
        if (isMobile) {
            setOpenMobile(false)
        }
    }

    return (
        <div>
            <Sidebar collapsible="icon">
                {/* Header */}
                <SidebarHeader className="py-4">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/">
                                    <Image src="/logo.webp" alt="logo" width={20} height={20} />
                                    <span>Craftsman</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarSeparator />

                {/* Main Content */}
                <SidebarContent>
                    {/* Main Navigation Group */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => {
                                    const isActive =
                                        item.url === "/"
                                            ? pathname === "/"
                                            : pathname.startsWith(item.url) && item.url !== "#";
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                                className={cn(
                                                    "my-1 transition-colors",
                                                    "data-[active=true]:bg-sky-500/15 data-[active=true]:text-sky-400 data-[active=true]:font-semibold"
                                                )}
                                            >
                                                <Link href={item.url} onClick={handleLinkClick}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>

                                            {item.title === "Inbox" && (
                                                <SidebarMenuBadge className="mt-1">24</SidebarMenuBadge>
                                            )}
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* Projects Group */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Projects</SidebarGroupLabel>
                        <SidebarGroupAction>
                            <Plus /> <span className="sr-only">Add Project</span>
                        </SidebarGroupAction>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link href="#">
                                            <Projector />
                                            <span>See All Projects</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* Collapsible Group */}
                    <Collapsible defaultOpen className="group/collapsible">
                        <SidebarGroup>
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger className="flex w-full items-center justify-between">
                                    <span>Collapse</span>
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <Link href="#">
                                                    <Projector />
                                                    <span>See All Projects</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>

                    {/* Sub Menu Group */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Sidebar Sub Menu</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link href="#">
                                            <span>See All Sub Items</span>
                                        </Link>
                                    </SidebarMenuButton>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton asChild>
                                                <Link href="#">
                                                    <Plus />
                                                    <span>Add Project</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>

                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton asChild>
                                                <Link href="#">
                                                    <Plus />
                                                    <span>Add Category</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                {/* Footer User Dropdown */}
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton>
                                        <User2 /> Craftsman <ChevronUp className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem>Account</DropdownMenuItem>
                                    <DropdownMenuItem>Settings</DropdownMenuItem>
                                    <DropdownMenuItem>Sign Out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </div>
    )
}

export default AppSidebar