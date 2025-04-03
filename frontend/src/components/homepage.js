import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Homepage.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
        <div ><img src="../image/logo.png" alt="Logo" className="logo" /></div>
    

      {/* 🎯 Hero Section */}
      <section className="hero">
        <h1>Seamless Charging, Anytime, Anywhere</h1>
        <p>Find and book the nearest EV charging stations effortlessly.</p>
        <button className="get-started-btn" onClick={() => navigate("/Login")}>
          Get Started 
        </button>
      </section>

      {/* ℹ️ About EV Connect */}
      <section className="about">
        <h2>About EV Connect</h2>
        <h5>EV Connect is a smart platform that helps electric vehicle (EV) users easily find, book, and pay for charging stations in real time. With an map interface, seamless slot reservations, and secure online payments, EV Connect ensures a hassle-free and efficient charging experience. Whether you're at home, work, or on a road trip, our platform keeps your EV powered up anytime, anywhere!!</h5>
        <div className="features">
          <div className="feature-card">📍 Locate Charging Stations</div>
          <div className="feature-card">📅 Book Slots with Ease</div>
          <div className="feature-card">🔋 Optimize Charging Efficiency</div>
        </div>
        
        <h2>Why Choose Us?</h2>
        <div className="benefits">
          <div className="benefit-card">🌍 Eco-Friendly</div>
          <div className="benefit-card">🚀 Fast & Reliable</div>
          <div className="benefit-card">🔐 Secure Payments</div>
          <div className="benefit-card">📍 Smart Location Services</div>
        </div>
      </section>

      {/* 🔗 Call to Action */}
      <section className="cta">
        <h2>Ready to Charge?</h2>
      </section>
    </div>
  );
};

export default Home;
