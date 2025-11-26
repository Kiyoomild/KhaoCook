import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import KhaoCook5 from '../../assets/images/KhaoCook5.png';
import './Login.css';

const LoginPage: React.FC = () => {
    // **Error แก้ไข: useState ถูกนำเข้าจาก 'react' แล้ว**
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // **Error แก้ไข: ใช้ setError ที่ประกาศไว้**
        setLoading(true); // **Error แก้ไข: ใช้ setLoading ที่ประกาศไว้**

        try {
            // Context จะเรียก API Login จริง
            const user = await login(email, password); 

            const username = user.username; 
            const avatar = user.avatar_url; 

            // 2. บันทึกข้อมูลที่ได้จาก Backend ลง localStorage โดยตรง
            localStorage.setItem('username', username);
            localStorage.setItem('userAvatar', avatar);


            console.log('Login successful:', { username, avatar });
            navigate('/');

        } catch (err) {
    console.error('Login failed:', err); // <-- เรียกใช้ตัวแปร err
    setError('เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่านอีกครั้ง');
} finally {
            setLoading(false); // **Error แก้ไข: ใช้ setLoading ที่ประกาศไว้**
        }
    };

    return (
        <div className="login-container">
            <div className="left-side">
                <img src={KhaoCook5} alt="KhaoCook Logo" className="logo-image" />
            </div>
            <div className="right-side">
                <div className="form-container">
                    <h2 className="form-title">
                        Let's Join <br /> Us !!
                    </h2>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <form className="form-content" onSubmit={handleLogin}>
                        <div className="input-group">
                            <input
                                type="email"
                                className="input-field"
                                placeholder="Username / Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                className="input-field"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="forgot-password">
                                <a href="/forgot-password">Forgot Password?</a>
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? 'กำลังเข้าสู่ระบบ...' : 'Log in'}
                        </button>
                        <p className="signup-text">
                            Don't have an account?{' '}
                            <a href="/signup" className="signup-link">
                                Signup
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;