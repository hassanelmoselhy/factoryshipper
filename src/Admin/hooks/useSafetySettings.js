import { useState } from 'react';

const useSafetySettings = () => {
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        auditLogging: true,
        sessionTimeout: 30,
        passwordExpiry: 90,
        maxLoginAttempts: 5,
        ipWhitelist: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSecuritySettings((prevSettings) => ({
            ...prevSettings,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const saveSecuritySettings = () => {
        console.log('Saving security settings:', securitySettings);
    };

    return {
        securitySettings,
        handleChange,
        saveSecuritySettings,
    };
};

export default useSafetySettings;