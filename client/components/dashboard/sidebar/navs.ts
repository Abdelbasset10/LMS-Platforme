import { BarChart, Compass, Layout, List } from "lucide-react";

export const studentRoutes = [
    {
        Icon : Layout,
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        Icon : Compass,
        label: "Browse",
        href: "/",
    },
]

export const teacherRoutes = [
    {
        Icon: List,
        label: "Courses",
        href: "/teacher/courses",
    },
    {
        Icon: BarChart,
        label: "Analytics",
        href: "/teacher/analytics",
    },
]