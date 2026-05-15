import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config';

// Import official assets
import campusBg from '../assets/collegeimage.jpeg';
import logoImg from '../assets/logo.jpeg';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const payload = identifier.includes('@') 
      ? { email: identifier, password } 
      : { registeredNumber: identifier, password };

    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, payload);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      {/* Left Panel */}
      <div className="login-left-panel">
        <div className="wave-overlay"></div>
        
        {/* Glass Card */}
        <div className="glass-login-card">
          <div className="college-branding">
            <img src={logoImg} alt="SCET Logo" className="login-logo-img" />
            <div className="college-name-text">
              <div className="name-main">SWARNANDHRA</div>
              <div className="name-sub">COLLEGE OF ENGINEERING</div>
            </div>
          </div>

          <h2 className="login-heading">Login</h2>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="input-group-custom">
              <label>Email</label>
              <div className="input-with-icon">
                <i className="bi bi-envelope"></i>
                <input 
                  type="text" 
                  placeholder="Enter your email" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-group-custom">
              <label>Password</label>
              <div className="input-with-icon">
                <i className="bi bi-lock"></i>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="toggle-password" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-btn">Login</button>
          </form>

          <div className="forgot-pass-container">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right-panel" style={{ backgroundImage: `url(${campusBg})` }}>
        <div className="right-text-content">
          <h1>Learning and<br />Academic Support</h1>
        </div>
      </div>

      <style>{`
        .login-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          font-family: 'Poppins', sans-serif;
        }

        /* Left Panel */
        .login-left-panel {
          flex: 0 0 36%;
          background: linear-gradient(135deg, #020E2B 0%, #06163A 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .wave-overlay {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 12px);
          opacity: 0.6;
        }

        /* Glass Card */
        .glass-login-card {
          width: 85%;
          maxWidth: 420px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
          padding: 40px;
          position: relative;
          z-index: 3;
          animation: fadeInLeft 0.8s ease-out;
        }

        .college-branding {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
        }

        .login-logo-img {
          width: 70px;
          height: 70px;
          object-fit: contain;
        }

        .name-main {
          color: white;
          font-weight: 800;
          font-size: 1.1rem;
          line-height: 1.2;
        }

        .name-sub {
          color: rgba(255,255,255,0.8);
          font-weight: 600;
          font-size: 0.8rem;
        }

        .login-heading {
          color: white;
          font-weight: 700;
          margin-bottom: 25px;
          font-size: 1.8rem;
        }

        /* Form Styling */
        .input-group-custom {
          margin-bottom: 20px;
        }

        .input-group-custom label {
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
          margin-bottom: 8px;
          display: block;
          font-weight: 600;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-icon i {
          position: absolute;
          left: 15px;
          color: #64748B;
          font-size: 1.1rem;
        }

        .input-with-icon input {
          width: 100%;
          padding: 14px 45px;
          border-radius: 10px;
          border: none;
          background: white;
          color: #0F172A;
          font-weight: 500;
          font-size: 1rem;
        }

        .toggle-password {
          position: absolute;
          right: 15px;
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
        }

        .login-submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: none;
          background: #0061FF;
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          margin-top: 15px;
          cursor: pointer;
          transition: background 0.3s;
          box-shadow: 0 10px 20px rgba(0, 97, 255, 0.3);
        }

        .login-submit-btn:hover {
          background: #0056E0;
        }

        .forgot-pass-container {
          text-align: right;
          margin-top: 20px;
        }

        .forgot-pass-container a {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 0.85rem;
        }

        /* Right Panel */
        .login-right-panel {
          flex: 1;
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          filter:'brightness(1.02)';
        }

        .right-text-content {
          position: absolute;
          top: 25%;
          right: 8%;
          text-align: right;
          z-index: 2;
        }

        .right-text-content h1 {
          color: #06163A;
          font-weight: 900;
          font-size: 4rem;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @media (max-width: 992px) {
          .login-left-panel { flex: 1; }
          .login-right-panel { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Login;
