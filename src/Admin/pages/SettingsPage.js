import React, { useState } from 'react';
import './css/SettingsPage.css';

import CompanySettings from '../components/CompanySettings';
import NotificationsSettings from '../components/NotificationsSettings';
import SafetySettings from '../components/SafetySettings';
import IntegrationsSettings from '../components/IntegrationsSettings';
import { Save } from 'lucide-react';

const settingsTabsConfig = [
    { id: 'company', label: 'الشركة', component: CompanySettings },
    { id: 'notifications', label: 'الإشعارات', component: NotificationsSettings },
    { id: 'safety', label: 'الأمان', component: SafetySettings },
    { id: 'integrations', label: 'التكاملات', component: IntegrationsSettings }
];

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('company');

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const handleSaveChanges = () => {
        console.log(`Saving changes for the ${activeTab} tab.`);
        alert('تم حفظ التغييرات بنجاح!');
    };

    const ActiveTabComponent = settingsTabsConfig.find(tab => tab.id === activeTab)?.component;

    return (
        <div className="settings-page">
            <div className="settings-header">
                <div className="header-text">
                    <h1>إعدادات النظام</h1>
                    <p>تهيئة الإعدادات العامة والتفضيلات</p>
                </div>
                <button className="save-changes-btn" onClick={handleSaveChanges}>
                    حفظ جميع التغييرات
                    <span className="icon"><Save /></span>
                </button>
            </div>

                <div className="settings-tabs">
                    {settingsTabsConfig.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => handleTabChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="tab-content">
                    {ActiveTabComponent && <ActiveTabComponent />}
                </div>
            </div>
    );
};

export default SettingsPage;