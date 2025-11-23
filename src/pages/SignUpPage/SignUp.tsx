import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import KhaoCook5 from '../../assets/images/KhaoCook5.png';
import './SignUp.css';

const SignUpPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [avatarURL, setAvatarURL] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

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
            const user = await signup(email, password, username);

            if (!user) {
                throw new Error('ไม่สามารถสร้างบัญชีผู้ใช้ได้');
            }

            // กำหนด Avatar URL
            const avatar = avatarURL || userService.getUserAvatar(username);

            //บันทึกลง LocalStorage
            localStorage.setItem('username', username);
            localStorage.setItem('userAvatar', avatar);

            //เพิ่ม user เข้า userService
            userService.addUser({
                username: username,
                avatar: avatar,
                email: email
            });

            console.log('สมัครสมาชิกสำเร็จ:', { username, avatar });
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

                        {/*Email*/}
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

                        {/*Password*/}
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

                        {/*Confirm Passwod*/}
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

                        {/*Avatar URL (Optional)*/}
                        <div className="input-group">
                            <input
                            type="url"
                            className="input-field"
                            placeholder="Avatar URL (Optional)"
                            value={avatarURL}
                            onChange={(e) => setAvatarURL(e.target.value)}
                            />
                            <small className="input-hint">
                                ใส่รูปโปรไฟล์ของคุณ
                            </small>
                        </div>

                        {/*Submit Button*/}
                        <button
                            type="submit"
                            className="signup-button"
                            disabled={loading}
                        >
                            {loading ? 'กำลังสมัครสมาชิก...' : 'Sign Up'}
                        </button>

                        <p className="login-text">
                            Already have an account?{' '}
                            <a href="/login" className="login-link">
                                Login
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
    
};

export default SignUpPage;