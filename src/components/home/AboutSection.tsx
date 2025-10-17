import React from 'react';
import './AboutSection.css';
import KhaoCook5 from '../../assets/images/KhaoCook5.png';

const AboutSection: React.FC = () => {
    return (
        <section className="about-section">
            <div className="about-content">
                <h2 className="about-title">About Us</h2>
                <p className="about-text">
                    KhaoCook เป็นแพลตฟอร์มแชร์สูตรอาหารที่ให้คุณค้นพบ แชร์ 
                    และสร้างสรรค์เมนูอาหารที่คุณชื่นชอบ ร่วมกับชุมชนคนรักการทำอาหาร
                    มากกว่า 10,000 คน
                </p>
            </div>
            <div className="about-image">
                <img src={KhaoCook5} alt="KhaoCook Logo" className="about-logo" />
            </div>
        </section>
    );
};

export default AboutSection;