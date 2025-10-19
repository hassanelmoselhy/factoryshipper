import React from 'react';
import useSafetySettings from '../hooks/useSafetySettings';
import { Shield } from 'lucide-react';
import '../pages/css/SettingsPage.css';

const SafetySettings = () => {
    const { securitySettings, handleChange } = useSafetySettings();

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
                <h3>الأمان والتحكم في الوصول<span className="icon"> <Shield /></span></h3>
            </div>
            <p className="card-description">إدارة سياسات الأمان وضوابط الوصول</p>

            <div className="security-grid">
                <div className="security-toggles">
                    <ToggleSwitch
                        id="twoFactorAuth"
                        name="twoFactorAuth"
                        label="المصادقة الثنائية (2FA)"
                        description="تتطلب المصادقة الثنائية لجميع حسابات المسؤولين"
                        checked={securitySettings.twoFactorAuth}
                        onChange={handleChange}
                    />
                    <ToggleSwitch
                        id="auditLogging"
                        name="auditLogging"
                        label="تسجيل التدقيق (Audit Logging)"
                        description="تسجيل جميع أنشطة النظام"
                        checked={securitySettings.auditLogging}
                        onChange={handleChange}
                    />
                </div>
                <div className="security-inputs">
                    <div className="form-group">
                        <label htmlFor="sessionTimeout">مهلة الجلسة (بالدقائق)</label>
                        <input
                            type="number"
                            id="sessionTimeout"
                            name="sessionTimeout"
                            value={securitySettings.sessionTimeout}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordExpiry">انتهاء صلاحية كلمة المرور (بالأيام)</label>
                        <input
                            type="number"
                            id="passwordExpiry"
                            name="passwordExpiry"
                            value={securitySettings.passwordExpiry}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="maxLoginAttempts">الحد الأقصى لمحاولات تسجيل الدخول</label>
                        <input
                            type="number"
                            id="maxLoginAttempts"
                            name="maxLoginAttempts"
                            value={securitySettings.maxLoginAttempts}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
            <div className="form-group full-width ip-whitelist-group">
                <label htmlFor="ipWhitelist">قائمة IP البيضاء</label>
                <textarea
                    id="ipWhitelist"
                    name="ipWhitelist"
                    rows="4"
                    value={securitySettings.ipWhitelist}
                    onChange={handleChange}
                    placeholder="أدخل عناوين IP أو نطاقاتها، سطر واحد لكل منها"
                ></textarea>
                <p className="hint">تقييد وصول المسؤول إلى عناوين IP محددة (اختياري)</p>
            </div>
        </div>
    );
};

export default SafetySettings;