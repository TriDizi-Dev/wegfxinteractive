import React, { useState } from 'react';
import './Price.css';
import mobile from '../../assets/Pieimages/phone.png'; 
import Think from '../../assets/Pieimages/Think1b.png'// Import your image    
function Price() {
    return (
      <div className="cost">
       <header className="app-header">
          <span className="logo-placeholder">A Purple'd Advertising Company</span>
          <div className="user-profile">
            <span>Raj Kumar</span>
            <div className="avatar-circle">
              <svg viewBox="0 0 24 24" fill="currentColor" className="avatar-icon">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        </header>

      <main className="main-content">
        {/* <h1 className="main-title">Think</h1> */}
        <img src={Think} alt="Think1" className="logo" />

        <h2 className="section-heading">
          <span className="foundation-text">Foundation Thinkers</span> (Ages 5-8)
        </h2>

        <div className="content-area">
          <div className="image-section">
            {/* Replace with your actual image */}
            <img src={mobile} alt="Mobile Payment" className="payment-illustration" />
          </div>

          <div className="pricing-section">
            <div className="pricing-plans">
              <div className="price-card trial-pack">
                <p className="plan-label">Trial Pack</p>
                <h3 className="plan-name">Starter Plan</h3>
                <p className="price">₹<span className="price-value">99</span></p>
                <p className="duration">1 Week</p>
              </div>

              <div className="price-card recommended">
                <p className="plan-label">Recommended</p>
                <h3 className="plan-name">Pro Plan</h3>
                <p className="price">₹<span className="price-value">299</span></p>
                <p className="duration">1 Month</p>
              </div>

              <div className="price-card super-saver">
                <p className="plan-label">Super Saver</p>
                <h3 className="plan-name">Elite Plan</h3>
                <p className="price">₹<span className="price-value">799</span></p>
                <p className="duration">3 Months</p>
              </div>
            </div>

            <p className="flexible-options-text">Simple Prices flexible options</p>

            <ul className="payment-options">
              <li>• UPI / Google Pay / PhonePe</li>
              <li>• Debit & Credit Cards</li>
              <li>• Net Banking</li>
              <li>• Wallets (Paytm, Mobikwik)</li>
              <li>• QR Code for instant payment</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
    );
}
export default Price;