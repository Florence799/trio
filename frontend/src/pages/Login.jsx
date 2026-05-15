import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config';

// Import official assets
import logoImg from '../assets/logo.jpeg';

const Login = () => {
  const [role, setRole] = useState('Student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const payload = identifier.includes('@') 
      ? { email: identifier, password, role } 
      : { registeredNumber: identifier, password, role };

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
      
      <div className="glass-card login-card-expanded">
        <div className="branding">
          <img src={logoImg} alt="Logo" className="logo-img" />
          <div className="college-info">
            <h6 className="college-name">SWARNANDHRA COLLEGE OF ENGINEERING & TECHNOLOGY</h6>
            <p className="college-dept">LMS Portal</p>
          </div>
        </div>

        <h4 className="section-title">Select Account Type</h4>
        
        {/* Account Selection Cards */}
        <div className="role-selection">
          <div 
            className={`role-card ${role === 'Student' ? 'active' : ''}`} 
            onClick={() => setRole('Student')}
          >
            <div className="role-icon">
              <i className="bi bi-mortarboard-fill"></i>
            </div>
            <span>Student</span>
            {role === 'Student' && <i className="bi bi-check-circle-fill checkmark"></i>}
          </div>

          <div 
            className={`role-card ${role === 'Faculty' ? 'active' : ''}`} 
            onClick={() => setRole('Faculty')}
          >
            <div className="role-icon">
              <i className="bi bi-person-workspace"></i>
            </div>
            <span>Faculty</span>
            {role === 'Faculty' && <i className="bi bi-check-circle-fill checkmark"></i>}
          </div>

          <div 
            className={`role-card ${role === 'Admin' ? 'active' : ''}`} 
            onClick={() => setRole('Admin')}
          >
            <div className="role-icon">
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <span>Admin</span>
            {role === 'Admin' && <i className="bi bi-check-circle-fill checkmark"></i>}
          </div>
        </div>

        {error && <div className="alert alert-danger py-2 small text-center mb-3">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group-custom">
            <label>Email or Registration Number</label>
            <div className="input-box">
              <i className="bi bi-envelope icon-left"></i>
              <input 
                type="text" 
                placeholder="Enter email or ID" 
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
                placeholder="Enter password" 
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

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="login-btn-gradient">LOGIN</button>
        </form>

        <div className="divider"><span>OR</span></div>

        <button className="google-btn">
          <i className="bi bi-google"></i> Sign in with Google
        </button>

        <p className="register-text">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>

      <style>{`
        .login-wrapper {
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          font-family: 'Poppins', sans-serif;
          background: #050510;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .background-animations { position: absolute; inset: 0; overflow: hidden; z-index: 1; background: linear-gradient(135deg, #050510 0%, #101030 50%, #050510 100%); }
        .mesh-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px); background-size: 50px 50px; mask-image: radial-gradient(ellipse at center, black, transparent 80%); animation: meshMove 20s linear infinite; }
        .orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.6; }
        .orb-1 { width: 500px; height: 500px; background: rgba(99, 102, 241, 0.4); top: -10%; left: -5%; animation: orbFloat 15s infinite alternate, orbPulse 10s infinite alternate; }
        .orb-2 { width: 600px; height: 600px; background: rgba(168, 85, 247, 0.3); bottom: -10%; right: -5%; animation: orbFloat 20s infinite alternate-reverse, orbPulse 12s infinite alternate; }
        .orb-3 { width: 400px; height: 400px; background: rgba(79, 70, 229, 0.35); top: 30%; right: 15%; animation: orbFloat 18s infinite alternate, orbPulse 8s infinite alternate; }

        @keyframes meshMove { from { background-position: 0 0; } to { background-position: 50px 50px; } }
        @keyframes orbFloat { from { transform: translate(0, 0) rotate(0deg); } to { transform: translate(40px, 60px) rotate(15deg); } }
        @keyframes orbPulse { from { opacity: 0.4; transform: scale(1); } to { opacity: 0.8; transform: scale(1.2); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .login-card-expanded {
          width: 95%;
          max-width: 500px;
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 40px 80px rgba(0,0,0,0.45);
          padding: 35px;
          position: relative;
          z-index: 2;
          animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .branding {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
        }

        .logo-img { width: 45px; height: 45px; object-fit: contain; }
        .college-name { color: white; font-weight: 700; margin: 0; font-size: 0.8rem; line-height: 1.2; }
        .college-dept { color: rgba(255,255,255,0.7); font-size: 0.65rem; margin: 0; font-weight: 500; }

        .section-title {
          color: white;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 20px;
          text-align: center;
        }

        .role-selection {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
        }

        .role-card {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 2px solid transparent;
          border-radius: 16px;
          padding: 20px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: 0.3s;
          position: relative;
        }

        .role-card:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-5px);
        }

        .role-card.active {
          background: rgba(99, 102, 241, 0.1);
          border-color: #6366f1;
        }

        .role-icon {
          font-size: 2.2rem;
          color: #a855f7;
          margin-bottom: 10px;
          transition: 0.3s;
        }

        .role-card.active .role-icon { color: #6366f1; }

        .role-card span {
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .checkmark {
          position: absolute;
          bottom: 10px;
          right: 10px;
          color: #6366f1;
          font-size: 0.9rem;
        }

        .form-group-custom {
          margin-bottom: 15px;
          opacity: 0;
          animation: fadeInUp 0.5s forwards;
        }
        .form-group-custom:nth-child(1) { animation-delay: 0.3s; }
        .form-group-custom:nth-child(2) { animation-delay: 0.4s; }

        .form-group-custom label { color: rgba(255,255,255,0.7); font-size: 0.75rem; margin-bottom: 6px; display: block; }
        .input-box { position: relative; display: flex; align-items: center; }
        .icon-left { position: absolute; left: 12px; color: #64748B; }
        .input-box input { width: 100%; padding: 10px 35px; border-radius: 10px; border: none; background: white; color: #0F172A; font-size: 0.9rem; font-weight: 500; }
        .pass-toggle { position: absolute; right: 10px; background: none; border: none; color: #64748B; cursor: pointer; }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          font-size: 0.75rem;
        }
        .remember-me { color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 5px; cursor: pointer; }
        .form-options a { color: #a855f7; text-decoration: none; font-weight: 600; }

        .login-btn-gradient {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
          transition: 0.3s;
          cursor: pointer;
        }
        .login-btn-gradient:hover { transform: translateY(-2px); boxShadow: 0 15px 30px rgba(99, 102, 241, 0.4); }

        .divider {
          text-align: center;
          position: relative;
          margin: 20px 0;
        }
        .divider::before { content: ""; position: absolute; left: 0; top: 50%; width: 42%; height: 1px; background: rgba(255,255,255,0.1); }
        .divider::after { content: ""; position: absolute; right: 0; top: 50%; width: 42%; height: 1px; background: rgba(255,255,255,0.1); }
        .divider span { color: rgba(255,255,255,0.4); font-size: 0.7rem; font-weight: 600; }

        .google-btn {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: 0.3s;
          cursor: pointer;
        }
        .google-btn:hover { background: rgba(255,255,255,0.1); }

        .register-text { text-align: center; margin-top: 25px; font-size: 0.8rem; color: rgba(255,255,255,0.6); }
        .register-text a { color: white; font-weight: 700; text-decoration: none; }
      `}</style>
    </div>
  );
};

export default Login;
