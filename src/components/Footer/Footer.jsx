import React from 'react';
import './Footer.css';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-left">
                    <h2 className="footer-logo">MedAccess</h2>
                    <div className="footer-social">
                        <a href="#" className="social-btn" aria-label="Facebook">
                            <Facebook size={20}/>
                            <span className="tooltip">Follow on Facebook</span>
                        </a>
                        <a href="#" className="social-btn" aria-label="Twitter">
                            <Twitter size={20}/>
                            <span className="tooltip">Follow on Twitter</span>
                        </a>
                        <a href="#" className="social-btn" aria-label="Instagram">
                            <Instagram size={20}/>
                            <span className="tooltip">Follow on Instagram</span>
                        </a>
                        <a href="#" className="social-btn" aria-label="LinkedIn">
                            <Linkedin size={20}/>
                            <span className="tooltip">Connect on LinkedIn</span>
                        </a>
                        {/* <a href="#" className="social-btn" aria-label="YouTube">
                            <i className="fab fa-youtube"></i>
                            <span className="tooltip">Subscribe on YouTube</span>
                        </a> */}
                    </div>
                </div>

                <div className="footer-nav">
                    <nav>
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/services" className="nav-link">Services</Link>
                        <Link to="/contact" className="nav-link">Contact</Link>
                    </nav>
                </div>

                <div className="footer-right">
                    <Link to="/contact" className="contact-btn">
                        <span>Contact Us</span>
                        <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="copyright">
                    <p className='allrights'>© {currentYear} MedAccess. All Rights Reserved.</p>
                </div>
                <div className="footer-info">
                    <Link to="/terms" className="footer-link">Terms & Conditions</Link>
                    <span className="separator">|</span>
                    <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                    <span className="separator">|</span>
                    <Link to="/cookies" className="footer-link">Cookie Policy</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
