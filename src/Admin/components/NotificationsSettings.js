import React from 'react';
import useNotificationsSettings from '../hooks/useNotificationsSettings';
import { Bell } from 'lucide-react';
import '../pages/css/SettingsPage.css';

const NotificationsSettings = () => {
    const { notificationPreferences, handleToggleChange } = useNotificationsSettings();

    const ToggleSwitch = ({ id, name, label, description, checked, onChange }) => (
        <div className="toggle-group">
            <div className="toggle-text">
                <label htmlFor={id}>{label}</label>
                <p>{description}</p>
            </div>
            <label className="switch">
                <input
                    type="checkbox"
                    id={id}
                    name={name}
                    checked={checked}
                    onChange={onChange}
                />
                <span className="slider round"></span>
            </label>
        </div>
    );

    return (
        <div className="settings-card">
            <div className="card-header">
                <h3>تفضيلات الإشعارات <span className="icon"><Bell /></span></h3>
            </div>
            <p className="card-description">تكوين كيفية ومتى تتلقى الإشعارات</p>

            <div className="notification-grid">
                <div className="notification-section">
                    <h4>قنوات الاتصال</h4>
                    <ToggleSwitch
                        id="emailNotifications"
                        name="emailNotifications"
                        label="إشعارات البريد الإلكتروني"
                        description="تلقي الإشعارات عبر البريد الإلكتروني"
                        checked={notificationPreferences.emailNotifications}
                        onChange={handleToggleChange}
                    />
                    <ToggleSwitch
                        id="smsNotifications"
                        name="smsNotifications"
                        label="إشعارات الرسائل القصيرة (SMS)"
                        description="تلقي التنبيهات الهامة عبر الرسائل القصيرة"
                        checked={notificationPreferences.smsNotifications}
                        onChange={handleToggleChange}
                    />
                    <ToggleSwitch
                        id="pushNotifications"
                        name="pushNotifications"
                        label="إشعارات الدفع (Push Notifications)"
                        description="إشعارات الدفع للمتصفح والجوال"
                        checked={notificationPreferences.pushNotifications}
                        onChange={handleToggleChange}
                    />
                </div>

                <div className="notification-section">
                    <h4>أنواع الإشعارات</h4>
                    <ToggleSwitch
                        id="orderUpdates"
                        name="orderUpdates"
                        label="تحديثات الطلبات"
                        description="الطلبات الجديدة، تغييرات الحالة، التسليمات"
                        checked={notificationPreferences.orderUpdates}
                        onChange={handleToggleChange}
                    />
                    <ToggleSwitch
                        id="delayAlerts"
                        name="delayAlerts"
                        label="تنبيهات التأخير"
                        description="إشعارات للتسليمات المتأخرة أو التي بها مشاكل"
                        checked={notificationPreferences.delayAlerts}
                        onChange={handleToggleChange}
                    />
                    <ToggleSwitch
                        id="performanceReports"
                        name="performanceReports"
                        label="تقارير الأداء"
                        description="ملخصات الأداء اليومية والأسبوعية والشهرية"
                        checked={notificationPreferences.performanceReports}
                        onChange={handleToggleChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default NotificationsSettings;