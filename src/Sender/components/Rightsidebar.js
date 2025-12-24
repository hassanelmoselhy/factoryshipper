import { FaHome, FaShoppingCart, FaTasks, FaWallet, FaSignOutAlt, FaClipboardList } from "react-icons/fa";
import Sidebar from "../../Components/Sidebar";

export const senderSidebarData = [
    { icon: <FaHome />, name: "الرئيسية", path: "/home" },
    // { icon: <FaShoppingCart />, name: " الطلبات", path: "/shipments" },
    { icon: <FaClipboardList />, name: "الأوردرات", path: "/orders" },
    { icon: <FaTasks />, name: "المهام", path: "/actions" },
    { icon: <FaWallet />, name: "المحفظة", path: "/wallet" },
    { icon: <FaSignOutAlt />, name: "تسجيل الخروج", path: "/" },
  ];


export default function Rightsidebar() {
  return (
    <Sidebar
      title="Stake Express"
      subtitle="لوحة المرسل"
      menuItems={senderSidebarData}
    />
  );
}
