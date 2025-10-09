import { useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'
import KhaoCook5 from '../../assets/images/KhaoCook5.png'
import './Login.css'

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/'); // ไปหน้าแรกหลังจากล็อกอินสำเร็จ
        } catch (err) {
            setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        } finally {
            setLoading(false);
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

