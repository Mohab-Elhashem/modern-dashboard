"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "./ui/field"
import { Input } from "./ui/input"
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

const formSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters!" }).max(50),
    email: z.string().email({ message: "Email is incorrect!" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }).max(15),
    location: z.string().min(2, { message: "Location is required" }),
    role: z.enum(["admin", "user", "system"], { message: "Please select a valid role" }),
})

type FormValues = z.infer<typeof formSchema>

interface EditUserProps {
    initialData?: FormValues
    onSave?: (data: FormValues) => void
}

const EditUser = ({ initialData, onSave }: EditUserProps) => {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            username: "",
            email: "",
            phone: "",
            location: "",
            role: "user",
        },
    })

    useEffect(() => {

        if (initialData) {
            reset(initialData)
        }
    }, [initialData, reset])

    const onSubmit = async (data: FormValues) => {
        console.log("Updated Data:", data)
        if (onSave) {
            await onSave(data)
        }
    }

    const handleReset = () => {
        reset(
            initialData || {
                username: "",
                email: "",
                phone: "",
                location: "",
                role: "user",
            }
        )
    }

    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle className="mb-4">Edit User</SheetTitle>
                <SheetDescription>
                    Update the users personal info and click save when youre done.
                </SheetDescription>
            </SheetHeader>

            <div className="p-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldSet>
                        <FieldLegend>Profile Details</FieldLegend>
                        <FieldDescription>This appears on invoices and emails.</FieldDescription>

                        <FieldGroup>
                            {/* Username */}
                            <Field>
                                <FieldLabel htmlFor="username">Username</FieldLabel>
                                <Input
                                    id="username"
                                    autoComplete="off"
                                    placeholder="Enter your username"
                                    {...register("username")}
                                />
                                {errors.username && <FieldError>{errors.username.message}</FieldError>}
                            </Field>

                            {/* Email */}
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="off"
                                    placeholder="Enter your email"
                                    {...register("email")}
                                />
                                {errors.email && <FieldError>{errors.email.message}</FieldError>}
                            </Field>

                            {/* Phone */}
                            <Field>
                                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                                <Input
                                    id="phone"
                                    autoComplete="off"
                                    placeholder="Enter your phone"
                                    {...register("phone")}
                                />
                                {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
                            </Field>

                            {/* Location */}
                            <Field>
                                <FieldLabel htmlFor="location">Location</FieldLabel>
                                <Input
                                    id="location"
                                    autoComplete="off"
                                    placeholder="Enter your location"
                                    {...register("location")}
                                />
                                {errors.location && <FieldError>{errors.location.message}</FieldError>}
                            </Field>

                            {/* Role */}
                            <Field>
                                <FieldLabel htmlFor="role">Role</FieldLabel>
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger id="role">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="system">System</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.role && <FieldError>{errors.role.message}</FieldError>}
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>

                    <Button type="button" variant="outline" onClick={handleReset} className="w-full mt-4">
                        Clear
                    </Button>
                </form>
            </div>
        </SheetContent>
    )
}

export default EditUser