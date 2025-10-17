import {
LayoutDashboard,
Package,
Users,
Building2,
LineSquiggle,
ShieldCheck,
DollarSign,
Calculator,
FileText,
Settings,
} from "lucide-react";
import Sidebar from "../../Components/Sidebar";

export const adminSidebarData = [
{ icon: <LayoutDashboard />, name: "لوحة التحكم", path: "/admin/dashboard" },
{ icon: <Package />, name: "الطلبات", path: "/admin/orders" },
{ icon: <Users />, name: "التجار", path: "/admin/merchants" },
{ icon: <Building2 />, name: "الفروع", path: "/admin/branches" },
{ icon: <LineSquiggle />, name: "المسارات والتتبع", path: "/admin/tracking-paths" },
{ icon: <ShieldCheck />, name: "الموظفون والأدوار", path: "/admin/employees-roles" },
{ icon: <DollarSign />, name: "الشؤون المالية", path: "/admin/finance" },
{ icon: <Calculator />, name: "تسعيرة الشحن", path: "/admin/shipping-pricing" },
{ icon: <FileText />, name: "السجلات والتاريخ", path: "/admin/history-logs" },
{ icon: <Settings />, name: "الإعدادات", path: "/admin/settings" },
];

export default function AdminSidebar() {
  return (
    <Sidebar
      title="Stake Express"
      subtitle="لوحة المتحكم"
      menuItems={adminSidebarData}
    />
  );
}
