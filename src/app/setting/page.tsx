"use client";

import React, { useState } from "react";
import { User, Moon, Bell, Globe, Camera, Save } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useTheme } from "next-themes";
import Swal from "sweetalert2";

const profileSchema = z.object({
    fullName: z
        .string()
        .min(3, { message: "Name must be at least 3 characters" }),
    email: z
        .email({ message: "Invalid email address" }),
    phone: z
        .string()
        .min(11, { message: "Phone number must be at least 11 digits" })
        .regex(/^[0-9+]+$/, { message: "Invalid phone number" }),
    location: z
        .string()
        .min(3, { message: "Location is required" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
    const [role] = useState<string>("Admin");
    const [notifications, setNotifications] = useState<boolean>(true);
    const [language, setLanguage] = useState<string>("English");
    const { theme, setTheme } = useTheme();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: "Craftsman",
            email: "craftsman@gmail.com",
            phone: "01080592398",
            location: "Egypt",
        },
    });

    const fullNameValue = useWatch({
        control,
        name: "fullName",
        defaultValue: "Craftsman",
    });

    const onSubmit = () => {
        // console.log("Validated Form Data:", finalData);
        Swal.fire({
            title: "Success!",
            text: "Information Saved Successfully",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#2563eb",
            customClass: {
                popup: "rounded-2xl dark:bg-slate-900 dark:text-white",
                title: "text-xl font-semibold",
                confirmButton: "px-5 py-2.5 rounded-xl font-medium text-sm shadow-sm",
            },
        });
    };

    return (
        <div className="p-6 rounded-lg min-h-screen space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold">Account Settings</h1>
                <p className="text-sm text-slate-500">
                    Manage your profile details and app preferences.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Profile Settings */}
                <div className="bg-primary-foreground p-6 rounded-2xl border shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Profile Information</h2>
                            <p className="text-xs text-slate-500">
                                Update your personal details and public profile.
                            </p>
                        </div>
                    </div>

                    {/* Avatar Section */}
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-slate-800 text-white flex items-center justify-center text-2xl font-bold border-2 select-none">
                                {fullNameValue.charAt(0).toUpperCase() || "U"}
                            </div>
                            <button
                                type="button"
                                className="absolute bottom-0 right-0 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow transition-all"
                                title="Change Avatar"
                            >
                                <Camera className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div>
                            <h3 className="font-medium">{fullNameValue}</h3>
                            <p className="text-xs text-slate-500">{role}</p>
                        </div>
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-medium mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                {...register("fullName")}
                                className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-background ${errors.fullName
                                    ? "border-red-500 focus:ring-red-500/20"
                                    : "focus:ring-blue-500/20 focus:border-blue-500"
                                    }`}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className="block text-xs font-medium mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                {...register("email")}
                                className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-background ${errors.email
                                    ? "border-red-500 focus:ring-red-500/20"
                                    : "focus:ring-blue-500/20 focus:border-blue-500"
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-xs font-medium mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                {...register("phone")}
                                className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-background ${errors.phone
                                    ? "border-red-500 focus:ring-red-500/20"
                                    : "focus:ring-blue-500/20 focus:border-blue-500"
                                    }`}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-xs font-medium mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                {...register("location")}
                                className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-background ${errors.location
                                    ? "border-red-500 focus:ring-red-500/20"
                                    : "focus:ring-blue-500/20 focus:border-blue-500"
                                    }`}
                            />
                            {errors.location && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.location.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* App Preferences */}
                <div className="bg-primary-foreground p-6 rounded-2xl border shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4">
                        <div className="p-2 bg-slate-800 text-white rounded-lg">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">App Preferences</h2>
                            <p className="text-xs text-slate-500">
                                Customize appearance and system settings.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
                        {/* Dark Mode Toggle */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3">
                                <Moon className="w-4 h-4" />
                                <div>
                                    <p className="text-sm font-medium">Dark Mode</p>
                                    <p className="text-xs text-slate-500">
                                        Switch between light and dark theme.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="w-11 h-6 flex items-center rounded-full p-1 bg-slate-200 dark:bg-blue-600 transition-colors duration-300"
                                aria-label="Toggle theme"
                            >
                                <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 dark:translate-x-5 translate-x-0" />
                            </button>
                        </div>

                        {/* Email Notifications Toggle */}
                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-3">
                                <Bell className="w-4 h-4" />
                                <div>
                                    <p className="text-sm font-medium">Email Notifications</p>
                                    <p className="text-xs text-slate-500">
                                        Receive system updates and activity alerts.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setNotifications(!notifications)}
                                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${notifications ? "bg-blue-600" : "bg-slate-200"
                                    }`}
                            >
                                <div
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${notifications ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Language Selection */}
                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-3">
                                <Globe className="w-4 h-4" />
                                <div>
                                    <p className="text-sm font-medium">Language</p>
                                    <p className="text-xs text-slate-500">
                                        Select dashboard language.
                                    </p>
                                </div>
                            </div>
                            <select
                                value={language}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                    setLanguage(e.target.value)
                                }
                                className="px-3 py-1.5 rounded-lg border text-xs font-medium bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="English">English</option>
                                <option value="Arabic">العربية</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        className="px-4 py-2 rounded-xl text-sm font-medium border hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}