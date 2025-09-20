// src/utils/auth.js

export const scheduleRefreshToken = (expiresOn) => {
  if (!expiresOn) return;

  const expireTime = new Date(expiresOn).getTime();
  const now = Date.now();
  const timeLeft = expireTime - now;

  if (timeLeft <= 0) {
    console.warn("⚠️ Token already expired!");
    return;
  }

  // نجدد قبل انتهاء التوكن بدقيقة
  const refreshTime = timeLeft - 60 * 1000;

  setTimeout(() => {
    console.log("🔄 Refreshing token...");
    // هنا المفروض تعمل Request للـ API عشان تجيب توكن جديد
    // مثال:
    // fetch("/api/auth/refresh", { method: "POST" })
    //   .then(res => res.json())
    //   .then(data => { console.log("New token", data); })
  }, refreshTime);

  console.log(`✅ Refresh scheduled in ${refreshTime / 1000} seconds`);
};
