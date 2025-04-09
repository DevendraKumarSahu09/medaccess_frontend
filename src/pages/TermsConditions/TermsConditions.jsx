import React from 'react';
import './TermsConditions.css';

const TermsConditions = () => {
    return (
        <div className="terms-container">
            <div className="terms-header">
                <h1>Terms & Conditions</h1>
                <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="terms-content">
                <section className="terms-section">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using MedAccess services, you agree to be bound by these Terms and Conditions. 
                        If you do not agree to these terms, please do not use our services.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>2. Services Description</h2>
                    <p>
                        MedAccess provides healthcare services including but not limited to:
                    </p>
                    <ul>
                        <li>Online appointment scheduling</li>
                        <li>Telemedicine consultations</li>
                        <li>Medical record management</li>
                        <li>Prescription services</li>
                        <li>Health information access</li>
                    </ul>
                </section>

                <section className="terms-section">
                    <h2>3. User Responsibilities</h2>
                    <p>As a user of MedAccess, you agree to:</p>
                    <ul>
                        <li>Provide accurate and complete information</li>
                        <li>Maintain the confidentiality of your account</li>
                        <li>Use the services for lawful purposes only</li>
                        <li>Comply with all applicable laws and regulations</li>
                        <li>Not engage in any fraudulent or harmful activities</li>
                    </ul>
                </section>

                <section className="terms-section">
                    <h2>4. Medical Disclaimer</h2>
                    <p>
                        The information provided through our services is for informational purposes only and does not 
                        constitute medical advice. Always consult with a qualified healthcare professional for medical 
                        advice and treatment.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>5. Payment Terms</h2>
                    <p>
                        All payments for services must be made in accordance with our payment policies. We reserve the 
                        right to modify our fees and payment terms at any time with prior notice.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>6. Intellectual Property</h2>
                    <p>
                        All content, trademarks, and intellectual property on the MedAccess platform are owned by or 
                        licensed to us. You may not use, reproduce, or distribute any content without our express 
                        written permission.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>7. Limitation of Liability</h2>
                    <p>
                        MedAccess shall not be liable for any indirect, incidental, special, consequential, or punitive 
                        damages resulting from your use of or inability to use our services.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>8. Contact Information</h2>
                    <p>
                        For any questions regarding these Terms & Conditions, please contact us at:
                        <br />
                        Email: legal@medaccess.com
                        <br />
                        Phone: (555) 123-4567
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsConditions; 