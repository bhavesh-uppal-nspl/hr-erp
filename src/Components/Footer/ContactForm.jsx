import React from 'react'
import "./ContactForm.css";

function ContactForm() {
    return (
        <div className="contact-form">
            <form onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Your Email" required />
                <textarea placeholder="Your Message" rows="3" required></textarea>
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

export default ContactForm