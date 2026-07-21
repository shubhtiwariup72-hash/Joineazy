import React from 'react'
import './Contact.css'
import useCounter from '../hook/counter'
import withLoading from '../higerOrderComponent/withLoading'
import VSInput from '../components/VSInput.jsx'
import VSButton from '../components/Button.jsx'

const Contact = ({ data }) => {
  const { mobileNumber, email, address } = data
  const { count, increment, decrement } = useCounter(0)

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="contact-title">Contact Me</h2>
          <div className="contact-divider"></div>
          <p className="contact-subtitle">Get in touch or try out the interactive practice widget below.</p>
        </div>

        <div className="contact-grid">
          {/* Contact Details Card */}
          <div className="contact-card info-card">
            <h3>Get In Touch</h3>
            <div className="contact-methods">
              <div className="contact-method-item">
                <div className="method-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="method-details">
                  <span className="method-label">Phone</span>
                  <a href={`tel:${mobileNumber}`} className="method-value">{mobileNumber}</a>
                </div>
              </div>

              <div className="contact-method-item">
                <div className="method-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="method-details">
                  <span className="method-label">Email</span>
                  <a href={`mailto:${email}`} className="method-value">{email}</a>
                </div>
              </div>

              <div className="contact-method-item">
                <div className="method-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="method-details">
                  <span className="method-label">Address</span>
                  <span className="method-value">{address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Practice Counter Card */}
          <div className="contact-card widget-card">
            <h3>Weather</h3>
            <VSInput value={''} onChange={()=>{}} title="City Name" name="city" type="text" placeholder="Enter your city name" />
            <VSButton title={"Get Weather Details"} onClick={() => { }} style={{backgroundColor:'green'}}/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default withLoading(Contact)