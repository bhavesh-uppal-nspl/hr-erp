import React, { useState } from "react";
import "./Footer.css";
import CustomPopup from "../Popup/CustomPopup";
import ContactForm from "./ContactForm";

const Footer = () => {
  let [openPopup, setOpenPopup] = useState(false);

  return (
    <>
      <footer className="footer-wrapper">
        {/* <div className="footer-container">

          <div className="footer-section">
            <h4>About HR ERP</h4>
            <p>
              HR ERP is a modern workforce management platform designed to
              streamline HR operations, employee tracking, and productivity
              reporting.
            </p>
          </div>


          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/features">Features</a>
              </li>
              <li>
                <a href="/pricing">Pricing</a>
              </li>
              <li>
                <a href="/faq">FAQs</a>
              </li>
            </ul>
          </div>

  
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="/terms">Terms of Service</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="/cookies">Cookie Policy</a>
              </li>
            </ul>
          </div>

 
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li>
                <a href="/support">Help Center</a>
              </li>
              <li onClick={() => setOpenPopup(true)}>
                <a>Contact Us</a>
              </li>
              <li>
                <a href="/system-status">System Status</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-icons">
              <a href="#">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#">
                <i className="bi bi-github"></i>
              </a>
            </div>
            <p className="version-info">Version 1.0.0</p>
          </div>
        </div> */}

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} HR ERP · Built with ❤️ in India ·
            All rights reserved.
          </p>
        </div>
      </footer>
      <CustomPopup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        title="Contact Us"
        children={<ContactForm />}
      />
    </>
  );
};

export default Footer;
