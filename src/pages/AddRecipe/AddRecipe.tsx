// src/pages/AddRecipe.tsx

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import './AddRecipe.css';
import { recipeService } from "../../services/recipeService";
import { useAuth } from "../../contexts/useAuth";

export default function AddRecipe() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        ingredients: '',
        steps: ''
    });
    const [image, setImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageClick = () => {
        // (Logic การคลิกรูปภาพเพื่ออัปโหลด - ย่อไว้เพื่อความกระชับ แต่ใช้งานได้เหมือนเดิม)
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => setImage(event.target?.result as string);
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. ตรวจสอบสถานะล็อกอิน
        if (!user || !user.id) {
            alert('กรุณาเข้าสู่ระบบก่อนเพิ่มสูตรอาหาร');
            navigate('/login');
            return;
        }

        // 2. ตรวจสอบข้อมูล
        if (!formData.name || !formData.ingredients || !formData.steps || !formData.category) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        // 3. เตรียมข้อมูลสำหรับส่ง API (ต้องตรงกับ NewRecipeInput ใน service)
        const newRecipe = {
            title: formData.name,
            description: `ส่วนผสม:\n${formData.ingredients}\n\nวิธีทำ:\n${formData.steps}`,
            image: image || '',
            category: formData.category, // 🔑 ใส่ category
            userId: user.id,
        };

        try {
            // 4. เรียก API (ไม่ต้อง cast as any แล้ว ถ้า structure ตรง)
            const createdRecipe = await recipeService.addRecipe(newRecipe);

            console.log('New Recipe Created:', createdRecipe);
            navigate('/', { state: { refresh: Date.now() } });
        } catch (error) {
            console.error('Error adding recipe:', error);
            alert('ไม่สามารถเพิ่มสูตรอาหารได้: ' + (error as Error).message);
        }
    };

    return (
        <div className="add-page">
            <div className="Addpage-container">
                <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

                <form className="form-container" onSubmit={handleSubmit}>
                    <div className={`image-upload ${image ? 'has-image' : ''}`} onClick={handleImageClick}>
                        {isUploading ? <div className="upload-text">กำลังอัพโหลด...</div> : 
                         image ? <img src={image} alt="preview" className="uploaded-image" /> : 
                         <><div className="upload-icon">+</div><div className="upload-text">เพิ่มรูปภาพ</div></>}
                    </div>

                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />

                    <div className="form-group">
                        <label className="form-label">ชื่อเมนูอาหาร</label>
                        <input type="text" name="name" className="form-input" placeholder="กรอกชื่อเมนูอาหาร" value={formData.name} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">ประเภท</label>
                        <input type="text" name="category" className="form-input" placeholder="กรอกประเภท" value={formData.category} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">วัตถุดิบ</label>
                        <textarea name="ingredients" className="form-input form-textarea" placeholder="กรอกวัตถุดิบ" value={formData.ingredients} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">วิธีทำ</label>
                        <textarea name="steps" className="form-input form-textarea" placeholder="กรอกวิธีทำ" value={formData.steps} onChange={handleInputChange} />
                    </div>

                    <button type="submit" className="submit-button">เพิ่มสูตรอาหาร</button>
                </form>
            </div>
        </div>
    );
}