import React from 'react';
import './CookiePolicy.css';

const CookiePolicy = () => {
    return (
        <div className="cookie-policy-container">
            <div className="cookie-policy-header">
                <h1>Cookie Policy</h1>
                <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="cookie-policy-content">
                <section className="cookie-section">
                    <h2>1. What Are Cookies?</h2>
                    <p>
                        Cookies are small text files that are placed on your device when you visit our website. 
                        They help us provide you with a better experience and enable certain functionality.
                    </p>
                </section>

                <section className="cookie-section">
                    <h2>2. Types of Cookies We Use</h2>
                    <p>We use the following types of cookies:</p>
                    <ul>
                        <li>
                            <strong>Essential Cookies:</strong> Required for the website to function properly
                        </li>
                        <li>
                            <strong>Analytics Cookies:</strong> Help us understand how visitors use our website
                        </li>
                        <li>
                            <strong>Functionality Cookies:</strong> Remember your preferences and settings
                        </li>
                        <li>
                            <strong>Security Cookies:</strong> Help protect your account and data
                        </li>
                    </ul>
                </section>

                <section className="cookie-section">
                    <h2>3. How We Use Cookies</h2>
                    <p>We use cookies to:</p>
                    <ul>
                        <li>Remember your login status</li>
                        <li>Store your preferences</li>
                        <li>Analyze website traffic</li>
                        <li>Improve our services</li>
                        <li>Ensure security</li>
                    </ul>
                </section>

                <section className="cookie-section">
                    <h2>4. Third-Party Cookies</h2>
                    <p>
                        Some cookies are placed by third-party services that appear on our pages. These may include:
                    </p>
                    <ul>
                        <li>Analytics services (e.g., Google Analytics)</li>
                        <li>Payment processors</li>
                        <li>Social media platforms</li>
                    </ul>
                </section>

                <section className="cookie-section">
                    <h2>5. Managing Cookies</h2>
                    <p>
                        You can control and/or delete cookies as you wish. You can delete all cookies that are 
                        already on your computer and you can set most browsers to prevent them from being placed. 
                        However, if you do this, you may have to manually adjust some preferences every time you 
                        visit our site and some services and functionalities may not work.
                    </p>
                </section>

                <section className="cookie-section">
                    <h2>6. Changes to This Policy</h2>
                    <p>
                        We may update this Cookie Policy from time to time. We will notify you of any changes by 
                        posting the new policy on this page and updating the "Last Updated" date.
                    </p>
                </section>

                <section className="cookie-section">
                    <h2>7. Contact Us</h2>
                    <p>
                        If you have any questions about our Cookie Policy, please contact us at:
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

export default CookiePolicy; 