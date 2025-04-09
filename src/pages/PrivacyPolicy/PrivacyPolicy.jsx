import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy-container">
            <div className="privacy-policy-header">
                <h1>Privacy Policy</h1>
                <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="privacy-policy-content">
                <section className="policy-section">
                    <h2>1. Introduction</h2>
                    <p>
                        At MedAccess, we are committed to protecting your privacy and ensuring the security of your personal information. 
                        This Privacy Policy explains how we collect, use, and safeguard your data when you use our healthcare services.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>2. Information We Collect</h2>
                    <p>We collect the following types of information:</p>
                    <ul>
                        <li>Personal identification information (name, email, phone number)</li>
                        <li>Medical history and health information</li>
                        <li>Appointment scheduling details</li>
                        <li>Payment information</li>
                        <li>Usage data and cookies</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>3. How We Use Your Information</h2>
                    <p>We use your information to:</p>
                    <ul>
                        <li>Provide and improve our healthcare services</li>
                        <li>Schedule and manage appointments</li>
                        <li>Process payments and insurance claims</li>
                        <li>Send important updates and notifications</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>4. Data Security</h2>
                    <p>
                        We implement appropriate security measures to protect your personal information from unauthorized access, 
                        alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>5. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal information</li>
                        <li>Request corrections to your data</li>
                        <li>Request deletion of your data</li>
                        <li>Opt-out of marketing communications</li>
                        <li>File a complaint about our data practices</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>6. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy or our data practices, please contact us at:
                        <br />
                        Email: privacy@medaccess.com
                        <br />
                        Phone: (555) 123-4567
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy; 