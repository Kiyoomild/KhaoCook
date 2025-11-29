import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import KhaoCook5 from '../../assets/images/KhaoCook5.png';
import './SignUp.css';

const SignUpPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [avatarImage, setAvatarImage] = useState<string>(''); // เปลี่ยนเป็น base64 string
    const [avatarPreview, setAvatarPreview] = useState<string>(''); // สำหรับ preview
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    // จัดการเมื่อเลือกรูปภาพ
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // เช็คขนาดไฟล์ (ไม่เกิน 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError('ขนาดไฟล์ต้องไม่เกิน 2MB');
                return;
            }

            // เช็คประเภทไฟล์
            if (!file.type.startsWith('image/')) {
                setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setAvatarImage(base64String);
                setAvatarPreview(base64String);
                setError(''); // ล้าง error
            };
            reader.readAsDataURL(file);
        }
    };

    // ลบรูปภาพ
    const handleRemoveImage = () => {
        setAvatarImage('');
        setAvatarPreview('');
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }

        if (password.length < 6) {
            setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
            return;
        }

        setLoading(true);

        try {
            const user = await signup(username, email, password);

            if (!user) {
                throw new Error('ไม่สามารถสร้างบัญชีผู้ใช้ได้');
            }

            // กำหนด Avatar (ใช้ที่ upload หรือ default)
            const avatar = avatarImage || userService.getUserAvatar(username);

            // บันทึกลง LocalStorage
            localStorage.setItem('username', username);
            localStorage.setItem('userAvatar', avatar);

            // เพิ่ม user เข้า userService
            userService.addUser({
                username: username,
                avatar: avatar,
                email: email
            });

            console.log('สมัครสมาชิกสำเร็จ:', { username, avatar: avatar.substring(0, 50) + '...' });
            alert('สมัครสมาชิกสำเร็จ!');
            navigate('/');
        } catch (err: any) {
            console.error('ข้อผิดพลาดในการสมัครสมาชิก:', err);
            setError(err.message || 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="left-side">
                <img src={KhaoCook5} alt="KhaoCook Logo" className="logo-image" />
            </div>
            <div className="right-side">
                <div className="form-container">
                    <h2 className="form-title">
                        Create Your <br /> Account
                    </h2>

                    {error && <div className="error-message">{error}</div>}

                    <form className="form-content" onSubmit={handleSignUp}>
                        {/* Username */}
                        <div className="input-group">
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <input
                                type="email"
                                className="input-field"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <input
                                type="password"
                                className="input-field"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="input-group">
                            <input
                                type="password"
                                className="input-field"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Avatar Upload */}
                        <div className="input-group">
                            <label className="avatar-label">รูปโปรไฟล์ (Optional)</label>
                            
                            {/* Preview รูปภาพ */}
                            {avatarPreview && (
                                <div className="avatar-preview-container">
                                    <img 
                                        src={avatarPreview} 
                                        alt="Avatar Preview" 
                                        className="avatar-preview"
                                    />
                                    <button
                                        type="button"
                                        className="remove-avatar-btn"
                                        onClick={handleRemoveImage}
                                    >
                                        ✕ ลบรูป
                                    </button>
                                </div>
                            )}

                            {/* Upload Button */}
                            {!avatarPreview && (
                                <label className="upload-avatar-btn">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                    📷 เลือกรูปโปรไฟล์
                                </label>
                            )}

                            <small className="input-hint">
                                ขนาดไฟล์ไม่เกิน 2MB (ถ้าไม่ใส่จะใช้รูปเริ่มต้น)
                            </small>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="signup-button"
                            disabled={loading}
                        >
                            {loading ? 'กำลังสมัครสมาชิก...' : 'Sign Up'}
                        </button>

                        <p className="login-text">
                            Already have an account?{' '}
                            <Link to="/login" className="login-link">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;