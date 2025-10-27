import { useState } from 'react';

const useNotificationsSettings = () => {
    const [notificationPreferences, setNotificationPreferences] = useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        orderUpdates: true,
        delayAlerts: true,
        performanceReports: false,
    });

    const handleToggleChange = (e) => {
        const { name, checked } = e.target;
        setNotificationPreferences((prevPrefs) => ({
            ...prevPrefs,
            [name]: checked,
        }));
    };

    const saveNotificationSettings = () => {
        console.log('Saving notification settings:', notificationPreferences);
    };

    return {
        notificationPreferences,
        handleToggleChange,
        saveNotificationSettings,
    };
};

export default useNotificationsSettings;