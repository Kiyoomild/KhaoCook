import React from 'react';
import './AboutSection.css';

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
                <div className="about-placeholder">ส่วนรูปภาพ</div>
            </div>
        </section>
    );
};

export default AboutSection;