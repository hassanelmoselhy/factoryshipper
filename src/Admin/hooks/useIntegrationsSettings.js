import { useState } from 'react';

const useIntegrationsSettings = () => {
    const [integrationSettings, setIntegrationSettings] = useState({
        apiKey: '••••••••••••••••••••••••••••••',
        webhookUrl: 'https://api.stakeexpress.com/webhooks',
        smsProvider: 'Twilio',
        emailProvider: 'SendGrid',
        paymentGateway: 'Stripe',
        mapsProvider: 'Google Maps',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIntegrationSettings((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    const testConnections = () => {
        console.log('Testing connections...');
        alert('اختبار الاتصالات...');
    };

    const saveIntegrationSettings = () => {
        console.log('Saving integration settings:', integrationSettings);
    };

    return {
        integrationSettings,
        handleChange,
        testConnections,
        saveIntegrationSettings,
    };
};

export default useIntegrationsSettings;