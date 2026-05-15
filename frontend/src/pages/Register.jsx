import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE } from '../config';

// Import official assets
import logoImg from '../assets/logo.jpeg';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const Register = () => {
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
    <div className="register-wrapper">
      <div className="background-animations">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="mesh-overlay"></div>
      </div>
      
      <div className="glass-card register-card-expanded">
        <div className="branding">
          <img src={logoImg} alt="Logo" className="logo-img" />
          <div className="college-info">
            <h6 className="college-name">SWARNANDHRA COLLEGE OF ENGINEERING & TECHNOLOGY</h6>
            <p className="college-dept">LMS Portal</p>
          </div>
        </div>

        <h4 className="section-title">Create Account As</h4>
        
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
        </div>

        {error && <Alert variant="danger" className="py-2 small text-center mb-3">{error}</Alert>}
        {success && <Alert variant="success" className="py-2 small text-center mb-3">{success}</Alert>}

        <Form onSubmit={handleRegister}>
          <Row>
            <Col md={6}>
              <div className="form-group-custom">
                <label>Full Name</label>
                <div className="input-box">
                  <i className="bi bi-person icon-left"></i>
                  <input type="text" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} required />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="form-group-custom">
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
              <div className="form-group-custom">
                <label>{role === 'Student' ? 'Registered Number' : (role === 'Faculty' ? 'Faculty ID' : 'Admin ID')}</label>
                <div className="input-box">
                  <i className="bi bi-card-text icon-left"></i>
                  <input type="text" name="registeredNumber" placeholder="ID Number" value={formData.registeredNumber} onChange={handleChange} required />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="form-group-custom">
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
                <div className="form-group-custom">
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
                  <div className="form-group-custom">
                    <label>Section</label>
                    <input type="text" name="section" className="form-input-plain" placeholder="e.g. A" value={formData.section} onChange={handleChange} required />
                  </div>
                </Col>
              )}
            </Row>
          )}

          <div className="form-group-custom">
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

          <button type="submit" className="register-btn-gradient">REGISTER</button>
        </Form>

        <div className="divider"><span>OR</span></div>

        <button className="google-btn">
          <i className="bi bi-google"></i> Sign up with Google
        </button>

        <p className="login-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>

      <style>{`
        .register-wrapper {
          width: 100vw;
          min-height: 100vh;
          overflow-y: auto;
          font-family: 'Poppins', sans-serif;
          background: #0a192f;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 40px 20px;
        }

        .background-animations { position: absolute; inset: 0; overflow: hidden; z-index: 1; background: linear-gradient(135deg, #0a192f 0%, #112240 50%, #0a192f 100%); }
        .mesh-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px); background-size: 50px 50px; mask-image: radial-gradient(ellipse at center, black, transparent 80%); animation: meshMove 20s linear infinite; }
        .orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.6; }
        .orb-1 { width: 500px; height: 500px; background: rgba(99, 102, 241, 0.4); top: -10%; left: -5%; animation: orbFloat 15s infinite alternate, orbPulse 10s infinite alternate; }
        .orb-2 { width: 600px; height: 600px; background: rgba(168, 85, 247, 0.3); bottom: -10%; right: -5%; animation: orbFloat 20s infinite alternate-reverse, orbPulse 12s infinite alternate; }
        .orb-3 { width: 400px; height: 400px; background: rgba(79, 70, 229, 0.35); top: 30%; right: 15%; animation: orbFloat 18s infinite alternate, orbPulse 8s infinite alternate; }

        @keyframes meshMove { from { background-position: 0 0; } to { background-position: 50px 50px; } }
        @keyframes orbFloat { from { transform: translate(0, 0) rotate(0deg); } to { transform: translate(40px, 60px) rotate(15deg); } }
        @keyframes orbPulse { from { opacity: 0.4; transform: scale(1); } to { opacity: 0.8; transform: scale(1.2); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .register-card-expanded {
          width: 100%;
          max-width: 650px;
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

        .branding { display: flex; align-items: center; gap: 12px; margin-bottom: 25px; }
        .logo-img { width: 45px; height: 45px; object-fit: contain; }
        .college-name { color: white; font-weight: 700; margin: 0; font-size: 0.8rem; line-height: 1.2; }
        .college-dept { color: rgba(255,255,255,0.7); font-size: 0.65rem; margin: 0; font-weight: 500; }

        .section-title { color: white; font-size: 1rem; font-weight: 600; margin-bottom: 20px; text-align: center; }

        .role-selection { display: flex; gap: 15px; margin-bottom: 30px; }
        .role-card { flex: 1; background: rgba(255,255,255,0.05); border: 2px solid transparent; border-radius: 16px; padding: 20px 10px; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: 0.3s; position: relative; }
        .role-card:hover { background: rgba(255,255,255,0.1); transform: translateY(-5px); }
        .role-card.active { background: rgba(99, 102, 241, 0.1); border-color: #6366f1; }
        .role-icon { font-size: 2.2rem; color: #a855f7; margin-bottom: 10px; }
        .role-card.active .role-icon { color: #6366f1; }
        .role-card span { color: white; font-size: 0.85rem; font-weight: 600; }
        .checkmark { position: absolute; bottom: 10px; right: 10px; color: #6366f1; font-size: 0.9rem; }

        .form-group-custom { margin-bottom: 15px; }
        .form-group-custom label { color: rgba(255,255,255,0.7); font-size: 0.75rem; margin-bottom: 6px; display: block; }
        .input-box { position: relative; display: flex; align-items: center; }
        .icon-left { position: absolute; left: 12px; color: #64748B; }
        .input-box input, .form-input-plain, .form-select-custom { width: 100%; padding: 10px 35px; border-radius: 10px; border: none; background: white; color: #0F172A; font-size: 0.9rem; font-weight: 500; }
        .form-input-plain, .form-select-custom { padding: 10px 15px; }
        .pass-toggle { position: absolute; right: 10px; background: none; border: none; color: #64748B; cursor: pointer; }

        .register-btn-gradient { width: 100%; padding: 12px; border-radius: 10px; border: none; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; font-weight: 700; font-size: 0.9rem; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3); transition: 0.3s; cursor: pointer; margin-top: 10px; }
        .register-btn-gradient:hover { transform: translateY(-2px); boxShadow: 0 15px 30px rgba(99, 102, 241, 0.4); }

        .divider { text-align: center; position: relative; margin: 20px 0; }
        .divider::before { content: ""; position: absolute; left: 0; top: 50%; width: 44%; height: 1px; background: rgba(255,255,255,0.1); }
        .divider::after { content: ""; position: absolute; right: 0; top: 50%; width: 44%; height: 1px; background: rgba(255,255,255,0.1); }
        .divider span { color: rgba(255,255,255,0.4); font-size: 0.7rem; font-weight: 600; }

        .google-btn { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color: white; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s; cursor: pointer; }
        .google-btn:hover { background: rgba(255,255,255,0.1); }

        .login-text { text-align: center; margin-top: 25px; font-size: 0.8rem; color: rgba(255,255,255,0.6); }
        .login-text a { color: white; font-weight: 700; text-decoration: none; }
      `}</style>
    </div>
  );
};

export default Register;
