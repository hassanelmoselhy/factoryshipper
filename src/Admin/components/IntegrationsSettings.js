import React from 'react';
import useIntegrationsSettings from '../hooks/useIntegrationsSettings';
import { Globe, Plug, Repeat } from 'lucide-react';
import '../pages/css/SettingsPage.css';


const IntegrationsSettings = () => {
    const { integrationSettings, handleChange, testConnections } = useIntegrationsSettings();

    return (
        <div className="settings-card">
            <div className="card-header">
                <h3>واجهات برمجة التطبيقات والتكاملات الخارجية <span className="icon"><Plug /></span></h3>
            </div>
            <p className="card-description">تكوين الخدمات الخارجية واتصالات واجهة برمجة التطبيقات</p>

            <div className="form-grid integration-grid">
                <div className="form-group">
                    <label htmlFor="apiKey">مفتاح API</label>
                    <input
                        type="password"
                        id="apiKey"
                        name="apiKey"
                        value={integrationSettings.apiKey}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="webhookUrl">عنوان URL للويب هوك (Webhook)</label>
                    <input
                        type="text"
                        id="webhookUrl"
                        name="webhookUrl"
                        value={integrationSettings.webhookUrl}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="smsProvider">مزود الرسائل القصيرة (SMS)</label>
                    <select
                        id="smsProvider"
                        name="smsProvider"
                        value={integrationSettings.smsProvider}
                        onChange={handleChange}
                    >
                        <option value="Twilio">Twilio</option>
                        <option value="Nexmo">Nexmo</option>
                        <option value="Nexmo">AWS SNS</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="emailProvider">مزود البريد الإلكتروني</label>
                    <select
                        id="emailProvider"
                        name="emailProvider"
                        value={integrationSettings.emailProvider}
                        onChange={handleChange}
                    >
                        <option value="SendGrid">SendGrid</option>
                        <option value="Mailgun">Mailgun</option>
                        <option value="Mailgun">AWS SES</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="paymentGateway">بوابة الدفع</label>
                    <select
                        id="paymentGateway"
                        name="paymentGateway"
                        value={integrationSettings.paymentGateway}
                        onChange={handleChange}
                    >
                        <option value="Stripe">Stripe</option>
                        <option value="PayPal">PayPal</option>
                        <option value="PayPal">Square</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="mapsProvider">مزود الخرائط</label>
                    <select
                        id="mapsProvider"
                        name="mapsProvider"
                        value={integrationSettings.mapsProvider}
                        onChange={handleChange}
                    >
                        <option value="Google Maps">Google Maps</option>
                        <option value="Mapbox">Mapbox</option>
                        <option value="Mapbox">OpenStreetMap</option>
                    </select>
                </div>
            </div>

            <div className="integration-actions">
                <button className="secondary-btn" onClick={testConnections}>
                    <span className="icon"><Repeat /></span>
                    اختبار الاتصالات
                </button>
                <button className="secondary-btn">
                    <span className="icon"><Globe /></span>
                    وثائق API
                </button>
            </div>
        </div>
    );
};

export default IntegrationsSettings;