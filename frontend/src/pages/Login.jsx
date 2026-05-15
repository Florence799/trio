import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config';

// Import official assets
import campusBg from '../assets/collegeimg.png';
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
    <div className="login-wrapper">
      <div className="split-container">
        
        {/* Left Side: Dark Navy Panel */}
        <div className="left-panel">
          <div className="wave-pattern"></div>
          
          {/* Glassmorphism Login Card */}
          <div className="glass-card">
            <div className="branding">
              <img src={logoImg} alt="SCET Logo" className="logo-img" />
              <div className="college-info">
                <h6 className="college-name">SWARNANDHRA</h6>
                <p className="college-dept">COLLEGE OF ENGINEERING</p>
              </div>
            </div>

            <h2 className="login-title">Login</h2>

            {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="form-group-custom">
                <label>Email</label>
                <div className="input-box">
                  <i className="bi bi-envelope icon-left"></i>
                  <input 
                    type="text" 
                    placeholder="Enter your email" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group-custom">
                <label>Password</label>
                <div className="input-box">
                  <i className="bi bi-lock icon-left"></i>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <button 
                    type="button" 
                    className="pass-toggle" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn">Login</button>
            </form>

            <div className="forgot-link">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </div>
        </div>

        {/* Right Side: Contained Campus Image */}
        <div className="right-panel-contained">
          <div className="boxed-image-container" style={{ backgroundImage: `url(${campusBg})` }}>
            <div className="hero-text-box">
              <h1>Learning and<br />Academic Support</h1>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .login-wrapper {
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          font-family: 'Poppins', sans-serif;
          background: #f8fafc;
        }

        .split-container {
          display: flex;
          width: 100%;
          height: 100%;
        }

        /* Left Panel Styles */
        .left-panel {
          flex: 0 0 38%;
          background: linear-gradient(135deg, #020E2B 0%, #06163A 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .wave-pattern {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 12px);
          opacity: 0.6;
        }

        .glass-card {
          width: 85%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 25px 50px rgba(0,0,0,0.4);
          padding: 45px;
          animation: fadeInLeft 0.8s ease-out;
        }

        .branding {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 35px;
        }

        .logo-img {
          width: 65px;
          height: 65px;
          object-fit: contain;
        }

        .college-name {
          color: white;
          font-weight: 700;
          margin: 0;
          font-size: 1.1rem;
          line-height: 1;
        }

        .college-dept {
          color: rgba(255,255,255,0.8);
          font-size: 0.75rem;
          margin: 0;
          font-weight: 500;
        }

        .login-title {
          color: white;
          font-weight: 600;
          margin-bottom: 25px;
          font-size: 1.6rem;
        }

        .form-group-custom {
          margin-bottom: 20px;
        }

        .form-group-custom label {
          color: rgba(255,255,255,0.7);
          font-size: 0.8rem;
          margin-bottom: 6px;
          display: block;
        }

        .input-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .icon-left {
          position: absolute;
          left: 15px;
          color: #64748B;
        }

        .input-box input {
          width: 100%;
          padding: 12px 40px;
          border-radius: 8px;
          border: none;
          background: white;
          color: #0F172A;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .pass-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
        }

        .login-btn {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: none;
          background: #0061FF;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          margin-top: 10px;
          transition: 0.3s;
          box-shadow: 0 4px 12px rgba(0, 97, 255, 0.3);
        }

        .login-btn:hover {
          background: #0056E0;
        }

        .forgot-link {
          text-align: right;
          margin-top: 20px;
        }

        .forgot-link a {
          color: white;
          text-decoration: none;
          font-size: 0.8rem;
          opacity: 0.8;
        }

        /* Right Panel Styles (Contained) */
        .right-panel-contained {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
        }

        .boxed-image-container {
          width: 100%;
          height: 480px; /* MATCHING HOME PAGE SIZE */
          background-size: cover;
          background-position: center;
          border-radius: 32px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.15);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          animation: fadeInScale 1s ease-out;
        }

        .hero-text-box {
          position: absolute;
          top: 20%;
          right: 8%;
          text-align: right;
        }

        .hero-text-box h1 {
          color: white; /* WHITE FOR VISIBILITY ON BOXED IMAGE */
          font-weight: 800;
          font-size: 3rem;
          line-height: 1.1;
          letter-spacing: -0.01em;
          text-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }

        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 992px) {
          .left-panel { flex: 1; }
          .right-panel-contained { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Login;
