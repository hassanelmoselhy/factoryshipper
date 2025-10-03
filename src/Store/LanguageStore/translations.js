const translations = {
  ar: {
    // Home
    home: "الرئيسي",
    accountBalance: "رصيد الحساب",
    availableBalance: "الرصيد المتاح للاستخدام",
    successRate: "معدل النجاح",
    inProgress: "قيد التنفيذ",
    totalOrders: "إجمالي الطلبات",
    ordersSummary: "ملخص حالة الأوردرات",
    today: "اليوم",
    week: "الأسبوع",
    month: "الشهر",
    grant: "منحة للعمل",
    successOrders: "الأوردرات الناجحة",
    pendingDecision: "انتظار القرار",

    // Orders
    orders: "الطلبات",
    searchOrder: "ابحث برقم الطلب أو اسم العميل...",
    all: "الكل",
    delivered: "تم التوصيل",
    customerProduct: "منتج للعميل",
    waitingDecision: "انتظار القرار",
    noOrders: "لا توجد طلبات مطابقة",
    postpone: "تأجيل الأوردر",
    redeliver: "إعادة توصيل الأوردر",
    editData: "تعديل البيانات",
    printPolicy: "طباعة بوليسة",
    cancel: "إلغاء",
    client: "العميل",
    phone: "الهاتف",
    address: "العنوان",
    date: "التاريخ", 
    
    deferOrder: "تأجيل الأوردر",
    redeliverOrder: "إعادة توصيل الأوردر",
    editOrder: "تعديل البيانات",
    cancelOrder: "إلغاء",
  

    // Map statuses
    statusMap: {
      delivered: { ar: "تم التوصيل", en: "Delivered" },
      customerProduct: { ar: "منتج للعميل", en: "Customer Product" },
      inProgress: { ar: "قيد التنفيذ", en: "In Progress" },
      waitingDecision: { ar: "انتظار القرار", en: "Pending Decision" },
    },
        // Map types ✅
    typeMap: {
      fast: { ar: "سريع", en: "Fast" },
      normal: { ar: "عادي", en: "Normal" },
    },


     // Actions
    newRequest: "طلب استلام جديد",
    advancedFilter: "فلترة متقدمة",
    searchTask: "البحث برقم المهمة، اسم المرسل، رقم الهاتف أو العنوان...",
    tasks: "المهام",

    // Missions Table
    missionId: "رقم المهمة",
    missionName: "اسم المهمة",
    createDate: "تاريخ الإنشاء",
    lastUpdate: "آخر تحديث",
    ordersCount: "عدد الطلبات",

    taskId: "رقم المهمة",
    senderName: "اسم المرسل",
    pickupDateTime: "تاريخ ووقت الاستلام",
    pickupAddress: "عنوان الاستلام",
    phoneNumber: "رقم الهاتف",
    delegateName: "اسم المندوب",
    taskStatus: "حالة المهمة",
    actions: "الإجراءات",
    cancelTask: "إلغاء",
    editTask: "تعديل الموعد",
    details: "تفاصيل",
    undefinedDelegate: "غير محدد",
     requestId: "معرّف الطلب",
    requestName: "اسم الطلب",
  },

  en: {
    // Home
    home: "Home",
    accountBalance: "Account Balance",
    availableBalance: "Available Balance",
    successRate: "Success Rate",
    inProgress: "In Progress",
    totalOrders: "Total Orders",
    ordersSummary: "Orders Summary",
    today: "Today",
    week: "Week",
    month: "Month",
    grant: "Grant",
    successOrders: "Successful Orders",
    pendingDecision: "Pending Decision",

    // Orders
    orders: "Orders",
    searchOrder: "Search by order ID or customer name...",
    all: "All",
    delivered: "Delivered",
    customerProduct: "Customer Product",
    waitingDecision: "Pending Decision",
    noOrders: "No matching orders",
    postpone: "Postpone Order",
    redeliver: "Redeliver Order",
    editData: "Edit Data",
    printPolicy: "Print Policy",
    cancel: "Cancel",
    client: "Client",
    phone: "Phone",
    address: "Address",
    date: "Date",
    deferOrder: "Defer Order",
    redeliverOrder: "Redeliver Order",
    editOrder: "Edit Order",
    cancelOrder: "Cancel",

    // Map statuses
    statusMap: {
      delivered: { ar: "تم التوصيل", en: "Delivered" },
      customerProduct: { ar: "منتج للعميل", en: "Customer Product" },
      inProgress: { ar: "قيد التنفيذ", en: "In Progress" },
      waitingDecision: { ar: "انتظار القرار", en: "Pending Decision" },
    },
    
    // Map types ✅
    typeMap: {
      fast: { ar: "سريع", en: "Fast" },
      normal: { ar: "عادي", en: "Normal" },
    },

   // Actions
    newRequest: "New Pickup Request",
    advancedFilter: "Advanced Filter",
    searchTask: "Search by task ID, sender name, phone, or address...",
    tasks: "Tasks",

    // Missions Table
    missionId: "Mission ID",
    missionName: "Mission Name",
    createDate: "Create Date",
    lastUpdate: "Last Update",
    ordersCount: "Orders Count",

    taskId: "Task ID",
    senderName: "Sender",
       requestId: "Request ID",
    requestName: "Request Name",
    pickupDateTime: "Pickup Date & Time",
    pickupAddress: "Pickup Address",
    phoneNumber: "Phone Number",
    delegateName: "Delegate Name",
    taskStatus: "Task Status",
    actions: "Actions",
    cancelTask: "Cancel",
    editTask: "Edit Schedule",
    details: "Details",
    undefinedDelegate: "Undefined",
  },
};

export default translations;
