import React from "react";
import { useRef } from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AddRecipe.css';
import { userService } from '../../services/userService';
import { recipeService } from "../../services/recipeService";
//import Header from "../../components/layout/Header/Header"

export default function AddRecipe() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [ formData, setFormData] = useState({
        name: '',
        category: '',
        ingredients: '',
        steps: ''
    });
    const [ image, setImage ] = useState<string | null>(null);
    const [ isUploading, setIsUploading ] = useState(false);

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

    const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // คำนวณขนาดใหม่โดยรักษาสัดส่วน
                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    //แปลงเป็น  base64 พร้อมคุณภาพ 0.8
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    }

    { /*const handleImageClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                // Resize the selected image before setting it to state
                resizeImage(file, 800, 800)
                    .then((dataUrl) => setImage(dataUrl))
                    .catch(() => {
                        // fallback to original file if resizing fails
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            setImage(event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                    });
            }
        };
        input.click();
    };
    */}

    const handleImageClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setIsUploading(true);
                try {
                    const dataUrl = await resizeImage(file, 800, 800);
                    setImage(dataUrl);
                } catch (error) {
                    console.error('Error resizing image:', error);
                    //fallback
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        setImage(event.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                } finally {
                    setIsUploading(false);
                }
            }
        };
        input.click();
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        //ตรวจสอบข้อมูลก่อน Submit
        if (!formData.name || !formData.ingredients || !formData.steps) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน')
            return;
        }

        //ดึง Username  จาก localStorage
        const currentUser = localStorage.getItem('username') || 'Kiyoomild';

        // ดึง avatar จาก localStorage (ถ้ามี) หรือใช้รุปภาพเริ่มต้น
        const userAvatar = userService.getUserAvatar(currentUser); // ใช้ userService
        
        // สร้าง id และ createdAt สำหรับเมนูใหม่
        const newRecipe = {
            id: Date.now().toString(),
            title: formData.name,
            description: `หมวดหมู่: ${formData.category}\n\nส่วนผสม:\n${formData.ingredients}\n\nวิธีทำ:\n${formData.steps}`,
            image: image || '',
            userId: currentUser,
            authorAvatar: userAvatar,
        };

        const createRecipe = recipeService.addRecipe(newRecipe)

        console.log('New Recipe:', createRecipe)
        console.log('Form Data:', formData);
        console.log('Image:', image);
        //alert('เพิ่มสูตรอาหารเรียบร้อยแล้ว!');
        
        // กลับไปหน้า Home
        navigate('/', { state: { refresh: Date.now() } });
    };


    return (
    <div className="add-page">
        <div className="Addpage-container">
            {/* Header */}
            {/* <Header /> */}

            {/* Back Button */}
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back
            </button>

            {/* Form - เพิ่ม <form> tag ที่นี่ */}
            <form className="form-container" onSubmit={handleSubmit}>
                {/* Image Upload */}
                <div 
                    className={`image-upload ${image ? 'has-image' : ''}`}
                    onClick={handleImageClick}
                >
                    {isUploading ? (
                        <div className="upload-text">กำลังอัพโหลด...</div>
                    ) : image ? (
                        <>
                            <img src={image} alt="preview" className="uploaded-image" />
                            <div className="image-info">คลิกเพื่อเปลี่ยนรูป</div>
                        </>
                    ) : (
                        <>
                            <div className="upload-icon">+</div>
                            <div className="upload-text">เพิ่มรูปภาพ</div>
                        </>
                    )}
                </div>

                {/* Input file ที่ซ่อนไว้ */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                {/* ชื่อเมนูอาหาร */}
                <div className="form-group">
                    <label className="form-label">ชื่อเมนูอาหาร</label>
                    <input
                        type="text"
                        name="name"
                        className="form-input"
                        placeholder="กรอกชื่อเมนูอาหาร"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>

                {/* ประเภท */}
                <div className="form-group">
                    <label className="form-label">ประเภท</label>
                    <input
                        type="text"
                        name="category"
                        className="form-input"
                        placeholder="กรอกประเภท"
                        value={formData.category}
                        onChange={handleInputChange}
                    />
                </div>

                {/* วัตถุดิบ */}
                <div className="form-group">
                    <label className="form-label">วัตถุดิบ</label>
                    <textarea
                        name="ingredients"
                        className="form-input form-textarea"
                        placeholder="กรอกวัตถุดิบ"
                        value={formData.ingredients}
                        onChange={handleInputChange}
                    />
                </div>

                {/* วิธีทำ */}
                <div className="form-group">
                    <label className="form-label">วิธีทำ</label>
                    <textarea
                        name="steps"
                        className="form-input form-textarea"
                        placeholder="กรอกวิธีทำ"
                        value={formData.steps}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Submit Button - เปลี่ยนเป็น type="submit" */}
                <button type="submit" className="submit-button">
                    เพิ่มสูตรอาหาร
                </button>
            </form>
        </div>
    </div>
)
}