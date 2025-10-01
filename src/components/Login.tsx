import { useState} from 'react'
import KhaoCook5 from '../pictures/KhaoCook5.png'
import './Login.css'

export default function Login() {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

    const handleLogin = () => {
        console.log('Login:', { username, password })
    }
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
                    <div className="form-content">
                        <div className="input-group">
                            <input 
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="input-group">
                            <input 
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"                            
                            />
                            <div className="forget-password">
                                <a href="#">Forget Password?</a>
                            </div>
                        </div>

                        <button onClick={handleLogin} className="login-button">
                            Log In
                        </button>

                        <p className="signup-text">
                            Don't have an account?{' '}
                            <a href='#' className="signup-Link">Sign Up</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

