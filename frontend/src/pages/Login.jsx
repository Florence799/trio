import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config';

// Import official assets
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
      <div className="background-animations">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="mesh-overlay"></div>
      </div>
      
      {/* Centered Glassmorphism Login Card */}
      <div className="glass-card">
        <div className="branding">
          <img src={logoImg} alt="SCET Logo" className="logo-img" />
          <div className="college-info">
            <h6 className="college-name" style={{ fontSize: '0.9rem' }}>SWARNANDHRA COLLEGE OF ENGINEERING & TECHNOLOGY</h6>
            <p className="college-dept">LMS Portal</p>
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

      <style>{`
        .login-wrapper {
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          font-family: 'Poppins', sans-serif;
          background: #0F0C29;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .background-animations {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
          background: linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%);
        }

        .mesh-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(ellipse at center, black, transparent 80%);
          animation: meshMove 20s linear infinite;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.4;
        }

        .orb-1 {
          width: 450px;
          height: 450px;
          background: rgba(99, 102, 241, 0.3);
          top: -10%;
          left: -5%;
          animation: orbFloat 15s ease-in-out infinite alternate, orbPulse 10s ease-in-out infinite alternate;
        }

        .orb-2 {
          width: 550px;
          height: 550px;
          background: rgba(168, 85, 247, 0.2);
          bottom: -10%;
          right: -5%;
          animation: orbFloat 20s ease-in-out infinite alternate-reverse, orbPulse 12s ease-in-out infinite alternate;
        }

        .orb-3 {
          width: 350px;
          height: 350px;
          background: rgba(79, 70, 229, 0.25);
          top: 30%;
          right: 15%;
          animation: orbFloat 18s ease-in-out infinite alternate, orbPulse 8s ease-in-out infinite alternate;
        }

        @keyframes meshMove {
          from { background-position: 0 0; }
          to { background-position: 50px 50px; }
        }

        @keyframes orbFloat {
          from { transform: translate(0, 0) rotate(0deg); }
          to { transform: translate(40px, 60px) rotate(15deg); }
        }

        @keyframes orbPulse {
          from { opacity: 0.3; transform: scale(1); }
          to { opacity: 0.6; transform: scale(1.15); }
        }

        .glass-card {
          width: 90%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 40px 80px rgba(0,0,0,0.45);
          padding: 45px;
          position: relative;
          z-index: 2;
          animation: fadeInUp 1s cubic-bezier(0.22, 1, 0.36, 1);
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
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .form-group-custom:nth-child(1) { animation-delay: 0.3s; }
        .form-group-custom:nth-child(2) { animation-delay: 0.4s; }

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
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: 0.5s;
        }

        .login-btn:hover {
          background: #0056E0;
          transform: translateY(-1px);
        }

        .forgot-link {
          text-align: right;
          margin-top: 20px;
          opacity: 0;
          animation: fadeInUp 0.8s forwards;
          animation-delay: 0.6s;
        }

        .forgot-link a {
          color: white;
          text-decoration: none;
          font-size: 0.8rem;
          opacity: 0.8;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;
