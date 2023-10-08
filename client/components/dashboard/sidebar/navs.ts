import { BarChart, Compass, Layout, List } from "lucide-react";

export const studentRoutes = [
    {
        Icon : Layout,
        label: "Dashboard",
        href: "/",
    },
    {
        Icon : Compass,
        label: "Browse",
        href: "/search",
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