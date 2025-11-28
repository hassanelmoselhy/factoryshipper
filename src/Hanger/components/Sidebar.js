import { FaClipboardList, FaCube, FaWarehouse, FaHistory, FaDollarSign, FaSignOutAlt } from "react-icons/fa";
import Sidebar from "../../Components/Sidebar";

export const hangerSidebarData = [
  { icon: <FaClipboardList />, name: "الرئيسيه", path: "/hanger/orders" },
  { icon: <FaCube />, name: "استلام الطلبات", path: "/hanger/scan" },
  { icon: <FaCube />, name: "إخراج الطلبات", path: "/hanger/release-orders" },
  { icon: <FaWarehouse />, name: "المخزون", path: "/hanger/warehouseList" },
  { icon: <FaHistory />, name: "العمليات", path: "/hanger/operations" },
  { icon: <FaClipboardList />, name: "مراجعة الطلبات", path: "/hanger/requests-review" },
  { icon: <FaDollarSign />, name: "الخزنة", path: "/hanger/safe" },
  { icon: <FaSignOutAlt />, name: "تسجيل الخروج", path: "/" },
];

export default function HangerSidebar() {
  return (
    <Sidebar
      title="Stake Express"
      subtitle="لوحة الهانجر"
      menuItems={hangerSidebarData}
    />
  );
}
