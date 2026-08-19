"use client"
import { LogOut, Moon, Settings, Sun, User } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuSeparator } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { useTheme } from "next-themes"
import { SidebarTrigger } from "./ui/sidebar"

const Navbar = () => {

    const { setTheme } = useTheme()

    return (
        <nav className="flex justify-between items-center p-4 sticky top-0 bg-background z-10">

            {/* left side*/}
            <SidebarTrigger/>

            {/* right side*/}
            <div className="flex items-center gap-4">
                <Link href="/">Dashboard</Link>

                {/* user theme */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Dropdown Menu */}
                <DropdownMenu>
                    {/* outside button */}
                    <DropdownMenuTrigger asChild>
                        <Avatar>
                            <AvatarImage src="/logo.webp" alt="User" />
                            <AvatarFallback>User</AvatarFallback>
                            <span className="sr-only">Open Menu</span>
                        </Avatar>
                    </DropdownMenuTrigger>

                    {/* body of dropdown */}
                    <DropdownMenuContent sideOffset={10}>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><User className="h-[1.2rem] w-[1.2rem] mr-2" /> Profile</DropdownMenuItem>
                        <DropdownMenuItem><Settings className="h-[1.2rem] w-[1.2rem] mr-2" /> Settings</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive"><LogOut className="h-[1.2rem] w-[1.2rem] mr-2" /> Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}
export default Navbar