import AppLineChart from "@/components/AppLineChart";
import CardList from "@/components/CardList"
import EditUser from "@/components/EditUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { BadgeCheck, Candy, Citrus, Shield } from "lucide-react"


interface UserPageProps {
    params: Promise<{
        user: string
    }>
}

const UserIcons = [
    { id: "1", title: "Verified User", paragraph: "This user has been verified by the admin.", icon: BadgeCheck, bgColor: "bg-blue-500 border-blue-500/50" },
    { id: "2", title: "Admin", paragraph: "Admin users have access to all features and can manage users.", icon: Shield, bgColor: "bg-green-800/30 border-blue-800/50" },
    { id: "3", title: "Awarded", paragraph: "This user has been awarded for their contributions.", icon: Candy, bgColor: "bg-yellow-500 border-yellow-500/50" },
    { id: "4", title: "Popular", paragraph: "This user has been popular in the community.", icon: Citrus, bgColor: "bg-red-500 border-red-500/50" },
];
const UserInfo = [
    { id: "1", title: "Craftsman", rol: "Username:" },
    { id: "2", title: "Craftsman@gmail.com", rol: "Email:" },
    { id: "3", title: "01080592398", rol: "Phone:" },
    { id: "4", title: "Egypt", rol: "Location:" },
    { id: "5", title: "Admin", rol: "Role:" }
]



const User = async({params}:UserPageProps) => {
    const { user } = await params
    return (
        <div>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/users">Users</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{user}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* container */}
            <div className="mt-4 flex flex-col xl:flex-row gap-8">
                {/* left */}
                <div className="w-full xl:w-1/3 space-y-6">
                    {/* user badge */}
                    <div className="bg-primary-foreground rounded-lg p-4">
                        <h2 className="text-xl font-semibold">User Badges</h2>
                        <div className="flex gap-4 mt-4">
                            {
                                UserIcons.map((item) => (
                                    <HoverCard key={item.id}>
                                        <HoverCardTrigger>
                                            <item.icon size={36} className={`rounded-full ${item.bgColor} p-2 border`} />
                                        </HoverCardTrigger>
                                        <HoverCardContent>
                                            <h3 className="font-bold mb-2">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground">{item.paragraph}</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                ))
                            }
                        </div>
                    </div>
                    {/* information */}
                    <div className="bg-primary-foreground rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">User Information</h2>
                            <div>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button>Add User</Button>
                                    </SheetTrigger>
                                    <EditUser />
                                </Sheet>
                            </div>
                        </div>
                        <div className="space-y-4 mt-4">
                            <div className="flex flex-col gap-2 mb-8">
                                <p className="text-sm text-muted-foreground">Profile Completion</p>
                                <Progress value={70} />
                            </div>
                            {
                                UserInfo.map((item) => (
                                    <div key={item.id} className="flex items-center gap-2">
                                        <span className="font-bold">{item.rol}</span>
                                        <span>{item.title}.</span>
                                    </div>
                                ))
                            }
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">Joined on 2026.01.01</p>
                    </div>
                    {/* card list */}
                    <div className="bg-primary-foreground rounded-lg p-4">
                        <CardList title={"Recent Transactions"} />
                    </div>
                </div>
                {/* right */}
                <div className="w-full xl:w-2/3 space-y-6">
                    {/* user */}
                    <div className="bg-primary-foreground rounded-lg p-4">
                        <div className="flex items-center gap-2 space-y-2">
                            <Avatar className="size-12">
                                <AvatarImage src="/logo.webp" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-semibold">{user}</h2>
                        </div>
                        <p className="text-sm text-muted-foreground ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi blanditiis, asperiores quia veritatis est, explicabo dicta modi nesciunt voluptatum perferendis ea. Consectetur rem consequatur, cum quod odit fuga. Illo officia voluptatum dignissimos eum saepe qui eaque et, obcaecati possimus in, fugiat optio id libero, maxime sequi dolorem molestias iure odit!</p>
                    </div>
                    {/* chart */}
                    <div className="bg-primary-foreground rounded-lg p-4">
                        <h2 className="text-xl font-semibold">User Activity</h2>
                        <AppLineChart/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default User
