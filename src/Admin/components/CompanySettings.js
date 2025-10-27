import React from 'react';
import useCompanySettings from '../hooks/useCompanySettings';
import { Building } from 'lucide-react';
import '../pages/css/SettingsPage.css';

const CompanySettings = () => {
    const { companyInfo, handleCompanyInfoChange } = useCompanySettings();

    return (
        <div className="settings-card">
            <div className="card-header">
                <h3>معلومات الشركة <span className="icon"><Building /></span></h3>
            </div>
            <p className="card-description">البيانات الأساسية للشركة وإعدادات العلامة التجارية</p>

            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="companyName">اسم الشركة</label>
                    <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={companyInfo.companyName}
                        onChange={handleCompanyInfoChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">رقم الهاتف</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={companyInfo.phoneNumber}
                        onChange={handleCompanyInfoChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">عنوان البريد الإلكتروني</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={companyInfo.email}
                        onChange={handleCompanyInfoChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="website">الموقع الإلكتروني</label>
                    <input
                        type="text"
                        id="website"
                        name="website"
                        value={companyInfo.website}
                        onChange={handleCompanyInfoChange}
                    />
                </div>
                <div className="form-group full-width">
                    <label htmlFor="address">العنوان</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={companyInfo.address}
                        onChange={handleCompanyInfoChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="timezone">المنطقة الزمنية</label>
                    <select
                        id="timezone"
                        name="timezone"
                        value={companyInfo.timezone}
                        onChange={handleCompanyInfoChange}
                    >
                        <option value="Africa/Cairo (GMT+2)">Africa/Cairo (GMT+2)</option>
                        <option value="Europe/London (GMT+0)">Europe/London (GMT+0)</option>
                        <option value="America/New_York (GMT-5)">America/New_York (GMT-5)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="currency">العملة الافتراضية</label>
                    <select
                        id="currency"
                        name="currency"
                        value={companyInfo.currency}
                        onChange={handleCompanyInfoChange}
                    >
                        <option value="Egyptian Pound (EGP)">جنيه مصري (EGP)</option>
                        <option value="Egyptian Pound (EGP)">دولار أمريكي (USD)</option>
                        <option value="Egyptian Pound (EGP)">يورو  (EUR)</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default CompanySettings;