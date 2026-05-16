import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE } from '../config';

// Import official assets
import logoImg from '../assets/logo.jpeg';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const Register = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);
  const [role, setRole] = useState('Student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    registeredNumber: '',
    department: '',
    section: '',
    mobile: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!/^\d{10}$/.test(formData.mobile.trim())) {
      setError('Mobile number must contain exactly 10 digits.');
      return;
    }
    if (!PASSWORD_REGEX.test(formData.password)) {
      setError('Password must be at least 8 characters and include 1 uppercase letter, 1 number, and 1 special character.');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE}/api/auth/register`, { ...formData, role });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setSuccess(`${role} registered successfully! Redirecting...`);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className={`register-wrapper ${mounted ? 'rw-visible' : ''}`}>
      <div className="r-bg">
        <div className="r-aurora-gradient"></div>
        <div className="r-wave r-wave-1"></div>
        <div className="r-wave r-wave-2"></div>
        <div className="r-wave r-wave-3"></div>
        <div className="r-glow r-glow-1"></div>
        <div className="r-glow r-glow-2"></div>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="r-diamond" style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${6 + Math.random() * 8}s`,
          }} />
        ))}
      </div>
      
      <div className="glass-card register-card-expanded">
        <div className="r-aurora-border"></div>

        <div className="branding r-stagger" style={{'--i': 0}}>
          <div className="logo-wrap">
            <img src={logoImg} alt="Logo" className="logo-img" />
            <div className="logo-ring"></div>
          </div>
          <div className="college-info">
            <h6 className="college-name">SWARNANDHRA COLLEGE OF ENGINEERING & TECHNOLOGY</h6>
            <p className="college-dept">LMS Portal</p>
          </div>
        </div>

        <h4 className="section-title r-stagger" style={{'--i': 1}}>Create Account As</h4>
        
        <div className="role-selection r-stagger" style={{'--i': 2}}>
          {[{k:'Student',ic:'bi-mortarboard-fill'},{k:'Faculty',ic:'bi-person-workspace'}].map((r) => (
            <div key={r.k} className={`role-card ${role === r.k ? 'active' : ''}`} onClick={() => setRole(r.k)}>
              <div className="role-icon"><i className={`bi ${r.ic}`}></i></div>
              <span>{r.k}</span>
              {role === r.k && <i className="bi bi-check-circle-fill checkmark"></i>}
            </div>
          ))}
        </div>

        {error && <Alert variant="danger" className="py-2 small text-center mb-3 r-shake">{error}</Alert>}
        {success && <Alert variant="success" className="py-2 small text-center mb-3">{success}</Alert>}

        <Form onSubmit={handleRegister}>
          <Row>
            <Col md={6}>
              <div className="form-group-custom r-stagger" style={{'--i': 3}}>
                <label>Full Name</label>
                <div className="input-box">
                  <i className="bi bi-person icon-left"></i>
                  <input type="text" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} required />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="form-group-custom r-stagger" style={{'--i': 4}}>
                <label>Email Address</label>
                <div className="input-box">
                  <i className="bi bi-envelope icon-left"></i>
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div className="form-group-custom r-stagger" style={{'--i': 5}}>
                <label>{role === 'Student' ? 'Registered Number' : (role === 'Faculty' ? 'Faculty ID' : 'Admin ID')}</label>
                <div className="input-box">
                  <i className="bi bi-card-text icon-left"></i>
                  <input type="text" name="registeredNumber" placeholder="ID Number" value={formData.registeredNumber} onChange={handleChange} required />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="form-group-custom r-stagger" style={{'--i': 6}}>
                <label>Mobile Number</label>
                <div className="input-box">
                  <i className="bi bi-phone icon-left"></i>
                  <input type="tel" name="mobile" placeholder="10 digit number" value={formData.mobile} onChange={handleChange} required />
                </div>
              </div>
            </Col>
          </Row>

          {role !== 'Admin' && (
            <Row>
              <Col md={role === 'Student' ? 6 : 12}>
                <div className="form-group-custom r-stagger" style={{'--i': 7}}>
                  <label>Department</label>
                  <select name="department" className="form-select-custom" value={formData.department} onChange={handleChange} required>
                    <option value="">Select Dept</option>
                    {['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'].map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </Col>
              {role === 'Student' && (
                <Col md={6}>
                  <div className="form-group-custom r-stagger" style={{'--i': 8}}>
                    <label>Section</label>
                    <input type="text" name="section" className="form-input-plain" placeholder="e.g. A" value={formData.section} onChange={handleChange} required />
                  </div>
                </Col>
              )}
            </Row>
          )}

          <div className="form-group-custom r-stagger" style={{'--i': 9}}>
            <label>Password</label>
            <div className="input-box">
              <i className="bi bi-lock icon-left"></i>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Create password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
              <button type="button" className="pass-toggle" onClick={() => setShowPassword(!showPassword)}>
                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="register-btn-gradient r-stagger" style={{'--i': 10}}>
            <span className="btn-txt">REGISTER</span>
            <span className="btn-shimmer"></span>
          </button>
        </Form>

        <div className="divider r-stagger" style={{'--i': 11}}><span>OR</span></div>

        <button className="google-btn r-stagger" style={{'--i': 12}}>
          <i className="bi bi-google"></i> Sign up with Google
        </button>

        <p className="login-text r-stagger" style={{'--i': 13}}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>

      <style>{`
        .register-wrapper{width:100vw;min-height:100vh;overflow-y:auto;font-family:'Poppins',sans-serif;background:#041018;display:flex;align-items:center;justify-content:center;position:relative;padding:40px 20px}

        /* === AURORA BACKGROUND === */
        .r-bg{position:absolute;inset:0;overflow:hidden;z-index:1}
        .r-aurora-gradient{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(16,185,129,0.1),transparent 60%),radial-gradient(ellipse at 20% 80%,rgba(139,92,246,0.08),transparent 50%),linear-gradient(180deg,#041018,#071520)}
        .r-wave{position:absolute;width:200%;height:200px;left:-50%;border-radius:45%;opacity:0.06;animation-timing-function:ease-in-out;animation-iteration-count:infinite}
        .r-wave-1{bottom:10%;background:linear-gradient(135deg,#10b981,#06b6d4);animation:rwave 8s infinite}
        .r-wave-2{bottom:5%;background:linear-gradient(135deg,#8b5cf6,#10b981);animation:rwave 10s infinite reverse;opacity:0.04}
        .r-wave-3{bottom:15%;background:linear-gradient(135deg,#06b6d4,#8b5cf6);animation:rwave 12s infinite;opacity:0.03}
        @keyframes rwave{0%,100%{transform:rotate(0deg)}50%{transform:rotate(3deg)}}
        .r-glow{position:absolute;border-radius:50%;filter:blur(90px)}
        .r-glow-1{width:450px;height:450px;background:rgba(16,185,129,0.12);top:-10%;right:-5%;animation:rglow1 10s ease-in-out infinite alternate}
        .r-glow-2{width:400px;height:400px;background:rgba(139,92,246,0.1);bottom:-5%;left:-5%;animation:rglow2 13s ease-in-out infinite alternate}
        @keyframes rglow1{0%{transform:translate(0,0) scale(1)}100%{transform:translate(-20px,30px) scale(1.1)}}
        @keyframes rglow2{0%{transform:translate(0,0) scale(1)}100%{transform:translate(25px,-20px) scale(1.08)}}
        .r-diamond{position:absolute;width:8px;height:8px;background:rgba(16,185,129,0.3);transform:rotate(45deg);animation:rdFloat ease-in-out infinite;pointer-events:none}
        @keyframes rdFloat{0%,100%{transform:rotate(45deg) translateY(0);opacity:0.2}50%{transform:rotate(45deg) translateY(-30px);opacity:0.6}}

        /* === CARD - Drop from Top with Bounce === */
        @keyframes rcardDrop{0%{opacity:0;transform:translateY(-100px) scale(0.9)}50%{transform:translateY(12px) scale(1.02)}70%{transform:translateY(-5px) scale(0.99)}100%{opacity:1;transform:translateY(0) scale(1)}}
        .register-card-expanded{width:100%;max-width:650px;background:rgba(8,25,35,0.88);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-radius:20px;border:1px solid rgba(16,185,129,0.12);box-shadow:0 0 50px rgba(16,185,129,0.06),0 30px 60px rgba(0,0,0,0.4);padding:35px;position:relative;z-index:2;animation:rcardDrop 1.1s cubic-bezier(0.34,1.56,0.64,1) forwards;overflow:hidden}

        /* Aurora border */
        .r-aurora-border{position:absolute;inset:-1px;border-radius:21px;background:linear-gradient(135deg,rgba(16,185,129,0.4),rgba(139,92,246,0.3),rgba(6,182,212,0.3),rgba(16,185,129,0.4));background-size:200% 200%;z-index:-1;animation:rauroraShift 5s ease-in-out infinite;filter:blur(2px);pointer-events:none}
        @keyframes rauroraShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}

        /* === STAGGER - Slide from Right === */
        @keyframes rslideRight{from{opacity:0;transform:translateX(40px);filter:blur(3px)}to{opacity:1;transform:translateX(0);filter:blur(0)}}
        .r-stagger{opacity:0;animation:rslideRight 0.5s cubic-bezier(0.22,1,0.36,1) forwards;animation-delay:calc(0.25s + var(--i)*0.07s)}

        .r-shake{animation:rshake 0.5s ease}
        @keyframes rshake{15%{transform:translateX(-6px)}30%{transform:translateX(6px)}45%{transform:translateX(-4px)}60%{transform:translateX(4px)}75%,100%{transform:translateX(0)}}

        /* Logo - Breathing pulse */
        .logo-wrap{position:relative;width:45px;height:45px;flex-shrink:0}
        .logo-img{width:45px;height:45px;object-fit:contain;border-radius:50%;position:relative;z-index:1}
        .logo-ring{position:absolute;inset:-5px;border-radius:50%;border:2px solid rgba(16,185,129,0.4);animation:rlogoBreathe 3s ease-in-out infinite}
        @keyframes rlogoBreathe{0%,100%{transform:scale(1);opacity:0.5;box-shadow:0 0 8px rgba(16,185,129,0.15)}50%{transform:scale(1.08);opacity:1;box-shadow:0 0 25px rgba(16,185,129,0.3)}}

        .branding{display:flex;align-items:center;gap:12px;margin-bottom:25px}
        .college-name{color:#e2e8f0;font-weight:700;margin:0;font-size:0.8rem;line-height:1.2}
        .college-dept{color:rgba(16,185,129,0.8);font-size:0.65rem;margin:0;font-weight:600;letter-spacing:1px;text-transform:uppercase}
        .section-title{color:#e2e8f0;font-size:1rem;font-weight:600;margin-bottom:20px;text-align:center}

        /* Role cards - Aurora glow */
        .role-selection{display:flex;gap:15px;margin-bottom:30px}
        .role-card{flex:1;background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.1);border-radius:14px;padding:20px 10px;display:flex;flex-direction:column;align-items:center;cursor:pointer;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);position:relative;overflow:hidden}
        .role-card::after{content:'';position:absolute;bottom:0;left:50%;width:0;height:2px;background:linear-gradient(90deg,#10b981,#06b6d4);transition:all 0.4s;transform:translateX(-50%)}
        .role-card:hover::after{width:80%}
        .role-card:hover{transform:translateY(-6px) scale(1.04);border-color:rgba(16,185,129,0.25);box-shadow:0 15px 35px rgba(16,185,129,0.08)}
        .role-card.active{background:rgba(16,185,129,0.08);border-color:rgba(16,185,129,0.45);box-shadow:0 0 30px rgba(16,185,129,0.12)}
        .role-card.active::after{width:100%;height:3px}
        .role-icon{font-size:2.2rem;color:rgba(16,185,129,0.65);margin-bottom:10px;transition:all 0.4s}
        .role-card:hover .role-icon{transform:scale(1.2) translateY(-3px);color:rgba(16,185,129,0.9)}
        .role-card.active .role-icon{color:#10b981;filter:drop-shadow(0 0 10px rgba(16,185,129,0.4))}
        .role-card span{color:#e2e8f0;font-size:0.85rem;font-weight:600}
        .checkmark{position:absolute;bottom:10px;right:10px;color:#10b981;font-size:0.9rem;animation:rslideRight 0.3s ease forwards}

        /* Form - Emerald focus */
        .form-group-custom{margin-bottom:15px}
        .form-group-custom label{color:rgba(148,163,184,0.9);font-size:0.75rem;margin-bottom:6px;display:block;transition:color 0.3s}
        .input-box{position:relative;display:flex;align-items:center}
        .icon-left{position:absolute;left:12px;color:#475569;z-index:2;transition:all 0.3s}
        .input-box input,.form-input-plain,.form-select-custom{width:100%;padding:10px 35px;border-radius:10px;border:1px solid rgba(16,185,129,0.1);background:rgba(15,23,42,0.75);color:#e2e8f0;font-size:0.9rem;font-weight:500;transition:all 0.35s cubic-bezier(0.22,1,0.36,1)}
        .form-input-plain,.form-select-custom{padding:10px 15px}
        .input-box input:focus,.form-input-plain:focus,.form-select-custom:focus{outline:none;border-color:rgba(16,185,129,0.45);background:rgba(15,23,42,0.95);box-shadow:0 0 0 3px rgba(16,185,129,0.1),0 0 20px rgba(16,185,129,0.06);transform:translateY(-1px)}
        .input-box input::placeholder{color:#475569}
        .input-box:focus-within .icon-left{color:#10b981;filter:drop-shadow(0 0 4px rgba(16,185,129,0.3))}
        .form-group-custom:focus-within label{color:#10b981}
        .pass-toggle{position:absolute;right:10px;background:none;border:none;color:#475569;cursor:pointer;z-index:2;transition:all 0.3s}
        .pass-toggle:hover{color:#10b981}

        /* Button - Aurora gradient */
        .register-btn-gradient{width:100%;padding:12px;border-radius:10px;border:1px solid rgba(16,185,129,0.25);background:linear-gradient(135deg,rgba(16,185,129,0.18),rgba(139,92,246,0.12));color:#10b981;font-weight:700;font-size:0.9rem;letter-spacing:1.5px;transition:all 0.4s;cursor:pointer;position:relative;overflow:hidden;margin-top:10px}
        .register-btn-gradient:hover{background:linear-gradient(135deg,rgba(16,185,129,0.28),rgba(139,92,246,0.18));box-shadow:0 0 30px rgba(16,185,129,0.15),0 10px 30px rgba(0,0,0,0.2);transform:translateY(-2px);border-color:rgba(16,185,129,0.4)}
        .register-btn-gradient:active{transform:translateY(0) scale(0.98)}
        .btn-txt{position:relative;z-index:1}
        .btn-shimmer{position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(16,185,129,0.12),transparent);animation:rshimmer 3.5s infinite}
        @keyframes rshimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}

        .divider{text-align:center;position:relative;margin:20px 0}
        .divider::before{content:"";position:absolute;left:0;top:50%;width:44%;height:1px;background:linear-gradient(90deg,transparent,rgba(16,185,129,0.12))}
        .divider::after{content:"";position:absolute;right:0;top:50%;width:44%;height:1px;background:linear-gradient(270deg,transparent,rgba(16,185,129,0.12))}
        .divider span{color:rgba(148,163,184,0.5);font-size:0.7rem;font-weight:600}

        .google-btn{width:100%;padding:10px;border-radius:10px;border:1px solid rgba(16,185,129,0.08);background:rgba(16,185,129,0.03);color:#94a3b8;font-size:0.85rem;font-weight:600;display:flex;align-items:center;justify-content:center;gap:10px;transition:all 0.4s;cursor:pointer}
        .google-btn:hover{background:rgba(16,185,129,0.08);transform:translateY(-2px);border-color:rgba(16,185,129,0.2);color:#e2e8f0}

        .login-text{text-align:center;margin-top:25px;font-size:0.8rem;color:rgba(148,163,184,0.6)}
        .login-text a{color:#10b981;font-weight:700;text-decoration:none;transition:all 0.3s}
        .login-text a:hover{text-shadow:0 0 15px rgba(16,185,129,0.5);color:#34d399}
      `}</style>
    </div>
  );
};

export default Register;
