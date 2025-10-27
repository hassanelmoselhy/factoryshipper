import { useState } from 'react';

const useCompanySettings = () => {
    const [companyInfo, setCompanyInfo] = useState({
        companyName: 'Stake Express',
        phoneNumber: '+20 123 456 7890',
        email: 'admin@stakeexpress.com',
        website: 'www.stakeexpress.com',
        address: 'القاهرة, مصر',
        timezone: 'Africa/Cairo (GMT+2)',
        currency: 'Egyptian Pound (EGP)',
    });

    const handleCompanyInfoChange = (e) => {
        const { name, value } = e.target;
        setCompanyInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const saveCompanySettings = () => {
        console.log('Saving company settings:', companyInfo);
    };

    return {
        companyInfo,
        handleCompanyInfoChange,
        saveCompanySettings,
    };
};

export default useCompanySettings;