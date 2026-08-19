"use client";

import React, { useState, useEffect, useMemo } from "react";
import {format,addMonths,subMonths,startOfMonth,endOfMonth,startOfWeek,endOfWeek,eachDayOfInterval,isSameMonth,isToday,isSameDay,} from "date-fns";
import { ChevronLeft, ChevronRight, Trash2, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
}

export default function CustomCalendarPage() {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [draggedOverDay, setDraggedOverDay] = useState<string | null>(null);

    // Load from local storage
    useEffect(() => {
        const savedEvents = localStorage.getItem("app_calendar_events");
        let formattedEvents: CalendarEvent[] = [];
        if (savedEvents) {
            try {
                const parsed = JSON.parse(savedEvents);
                formattedEvents = parsed.map(
                    (item: { id: string; title: string; date: string }) => ({
                        ...item,
                        date: new Date(item.date),
                    })
                );
            } catch (error) {
                console.error("localStorage error data", error);
            }
        }
        // check data
        queueMicrotask(() => {
            if (formattedEvents.length > 0) {
                setEvents(formattedEvents);
            }
            setIsLoaded(true);
        });
    }, []);

    // Save to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("app_calendar_events", JSON.stringify(events));
        }
    }, [events, isLoaded]);

    // Group identical events by title
    const groupedEvents = useMemo(() => {
        const map = new Map<string, CalendarEvent[]>();
        events.forEach((ev) => {
            const key = ev.title.trim().toLowerCase();
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key)!.push(ev);
        });

        return Array.from(map.entries()).map(([_ , items]) => ({
            title: items[0].title,
            items,
        }));
    }, [events]);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handleToday = () => setCurrentMonth(new Date());

    // Add new note manually
    const handleDayClick = (day: Date) => {
        const formattedDate = format(day, "yyyy-MM-dd");
        const eventTitle = window.prompt(`Add Your Event (${formattedDate}):`);

        if (eventTitle && eventTitle.trim() !== "") {
            const newEvent: CalendarEvent = {
                id: crypto.randomUUID(),
                title: eventTitle.trim(),
                date: day,
            };

            setEvents((prev) =>
                [...prev, newEvent].sort((a, b) => a.date.getTime() - b.date.getTime())
            );
        }
    };

    // Start Dragging (Works both from Sidebar & directly from Calendar Day)
    const handleDragStartNote = (e: React.DragEvent, title: string) => {
        e.stopPropagation();
        e.dataTransfer.setData("noteTitle", title);
        e.dataTransfer.effectAllowed = "copy";
    };

    const handleDragOver = (e: React.DragEvent, dayIso: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        if (draggedOverDay !== dayIso) {
            setDraggedOverDay(dayIso);
        }
    };

    const handleDragLeave = () => {
        setDraggedOverDay(null);
    };

    const handleDrop = (e: React.DragEvent, targetDay: Date) => {
        e.preventDefault();
        setDraggedOverDay(null);

        const noteTitle = e.dataTransfer.getData("noteTitle");

        if (noteTitle) {
            const cleanTitle = noteTitle.trim();

            // Check if this note already exists on the target day
            const existsOnDay = events.some(
                (ev) =>
                    isSameDay(ev.date, targetDay) &&
                    ev.title.trim().toLowerCase() === cleanTitle.toLowerCase()
            );

            if (!existsOnDay) {
                const newEvent: CalendarEvent = {
                    id: crypto.randomUUID(),
                    title: cleanTitle,
                    date: targetDay,
                };

                setEvents((prev) =>
                    [...prev, newEvent].sort((a, b) => a.date.getTime() - b.date.getTime())
                );
            }
        }
    };

    // Remove a single instance
    const handleDeleteSingleEvent = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setEvents((prev) => prev.filter((event) => event.id !== id));
    };

    // Remove all instances of a title group
    const handleDeleteGroup = (title: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setEvents((prev) =>
            prev.filter(
                (event) => event.title.trim().toLowerCase() !== title.trim().toLowerCase()
            )
        );
    };

    return (
        <div className="min-h-screen p-6 font-sans select-none">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
                {/* Sidebar Notes */}
                <Card className="w-full lg:w-80 bg-primary-foreground p-6 rounded-2xl flex flex-col">
                    <h2 className="text-xl font-semibold mb-1 border-b pb-3">
                        Notes Table ({groupedEvents.length})
                    </h2>
                    <p className="text-xs text-muted-foreground mb-3">
                        Drag any note onto calendar days to duplicate or schedule it
                    </p>

                    <ScrollArea className="flex-1 pr-2">
                        <div className="space-y-3">
                            {groupedEvents.map((group) => (
                                <div
                                    key={group.title}
                                    draggable
                                    onDragStart={(e) => handleDragStartNote(e, group.title)}
                                    className="p-3 rounded-xl bg-primary-foreground border flex flex-col gap-2 border-r-4 border-r-sky-500 cursor-grab active:cursor-grabbing hover:border-sky-400/50 transition-all shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 truncate">
                                            <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <span className="text-sm font-semibold truncate">
                                                {group.title}
                                            </span>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => handleDeleteGroup(group.title, e)}
                                            className="h-7 w-7 text-zinc-400 hover:text-red-400 hover:bg-primary-foreground transition-colors shrink-0"
                                            title="Delete all dates"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Dates Badges */}
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {group.items.map((item) => (
                                            <span
                                                key={item.id}
                                                className="inline-flex items-center gap-1 text-[11px] font-medium bg-sky-500/15 text-sky-400 px-2 py-0.5 rounded-md border border-sky-500/30"
                                            >
                                                {format(item.date, "MMM dd, yyyy")}
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDeleteSingleEvent(item.id, e)}
                                                    className="hover:text-red-400 transition-colors"
                                                    title="Remove this date"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {groupedEvents.length === 0 && (
                                <p className="text-muted-foreground text-sm italic text-center py-10">
                                    No notes recorded
                                </p>
                            )}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Calendar Grid */}
                <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-primary-foreground p-4 rounded-2xl border">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePrevMonth}
                                className="hover:bg-primary-foreground"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleNextMonth}
                                className="hover:bg-primary-foreground"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleToday}
                                className="hover:bg-primary-foreground"
                            >
                                Today
                            </Button>
                        </div>

                        <h1 className="text-xl font-semibold">
                            {format(currentMonth, "MMMM yyyy")}
                        </h1>
                    </div>

                    {/* Grid */}
                    <Card className="bg-primary-foreground rounded-2xl p-4 overflow-hidden border">
                        <div className="grid grid-cols-7 border-b text-center font-semibold py-2 text-sm">
                            <div>Sun</div>
                            <div>Mon</div>
                            <div>Tue</div>
                            <div>Wed</div>
                            <div>Thu</div>
                            <div>Fri</div>
                            <div>Sat</div>
                        </div>

                        <div className="grid grid-cols-7 auto-rows-fr">
                            {days.map((day) => {
                                const dayIso = day.toISOString();
                                const isCurrentMonth = isSameMonth(day, currentMonth);
                                const isDayToday = isToday(day);
                                const isHovered = draggedOverDay === dayIso;

                                const dayEvents = events.filter((e) => isSameDay(e.date, day));

                                return (
                                    <div
                                        key={dayIso}
                                        onClick={() => handleDayClick(day)}
                                        onDragOver={(e) => handleDragOver(e, dayIso)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, day)}
                                        className={cn(
                                            "min-h-26.25 p-2 border-r border-b border-border/50 flex flex-col justify-between cursor-pointer transition-colors relative",
                                            !isCurrentMonth && "opacity-30 bg-muted/20",
                                            isDayToday && "bg-amber-500/10",
                                            isHovered && "bg-sky-500/20 border-2 border-sky-400"
                                        )}
                                    >
                                        <div className="flex justify-end">
                                            <span
                                                className={cn(
                                                    "text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full",
                                                    isDayToday && "bg-amber-500 text-black"
                                                )}
                                            >
                                                {format(day, "d")}
                                            </span>
                                        </div>

                                        <div className="space-y-1 mt-1 overflow-y-auto max-h-16.25 scrollbar-none">
                                            {dayEvents.map((ev) => (
                                                <div
                                                    key={ev.id}
                                                    draggable
                                                    onDragStart={(e) => handleDragStartNote(e, ev.title)}
                                                    className="bg-sky-600/90 hover:bg-sky-500 text-white text-[11px] font-semibold px-2 py-1 rounded transition-colors truncate cursor-grab active:cursor-grabbing flex items-center justify-between"
                                                    title={`${ev.title} (Drag to drop into another day)`}
                                                >
                                                    <span className="truncate">{ev.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}