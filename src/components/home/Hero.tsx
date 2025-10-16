import React from 'react';
import './Hero.css';
import KhaoCook5 from '../../assets/images/KhaoCook5.png';

const Hero: React.FC = () => {
    return (
        <section className="hero">
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <img src={KhaoCook5} alt="KhaoCook Logo" className="hero-logo" />
            </div>
        </section>
    );
};

export default Hero;