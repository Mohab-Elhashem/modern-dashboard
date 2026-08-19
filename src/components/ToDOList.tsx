"use client"
import { Checkbox } from "./ui/checkbox"
import { Card } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

const tasks = [
    { id: "task-1", label: "task-1", isChecked: true },
    { id: "task-2", label: "task-2", isChecked: true },
    { id: "task-3", label: "task-3", isChecked: false },
    { id: "task-4", label: "task-4", isChecked: false },
    { id: "task-5", label: "task-5", isChecked: true },
    { id: "task-6", label: "task-6", isChecked: true },
    { id: "task-7", label: "task-7", isChecked: false },
    { id: "task-8", label: "task-8", isChecked: true },
    { id: "task-9", label: "task-9", isChecked: true },
    { id: "task-10", label: "task-10", isChecked: false },
];

const ToDoList = () => {

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [open, setOpen] = useState(false)

    return (
        <div>
            <h2 className="text-lg font-medium mb-6">Todo List</h2>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button className="w-full">
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                        }}
                        className="rounded-lg border"
                    />
                </PopoverContent>
            </Popover>
            <ScrollArea className="max-h-100 mt-4 overflow-y-auto">
                <div className="flex flex-col gap-4">
                    {
                        tasks.map((task) => (
                            <Card key={task.id} className="p-4">
                                <div className="flex items-center gap-4">
                                    <Checkbox id={task.id} checked={task.isChecked}/>
                                    <label htmlFor={task.id} className="text-sm text-muted-foreground">{task.label}</label>
                                </div>
                            </Card>
                        ))
                    }
                </div>
            </ScrollArea>
        </div>
    )
}


export default ToDoList