import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Alert, Row, Col, Tabs, Tab } from 'react-bootstrap';
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
      
      <div className="glass-register-card">
        <div className="branding">
          <img src={logoImg} alt="SCET Logo" className="logo-img" />
          <div className="college-info">
            <h6 className="college-name">SWARNANDHRA</h6>
            <p className="college-dept">COLLEGE OF ENGINEERING</p>
          </div>
        </div>

        <h2 className="register-title">Create Account</h2>

        <Tabs
          activeKey={role}
          onSelect={(k) => { setRole(k); setError(''); }}
          className="mb-4 custom-tabs-register"
          fill
        >
          <Tab eventKey="Student" title="Student" />
          <Tab eventKey="Faculty" title="Faculty" />
        </Tabs>

        {error && <Alert variant="danger" className="py-2 small text-center mb-3">{error}</Alert>}
        {success && <Alert variant="success" className="py-2 small text-center mb-3">{success}</Alert>}

        <Form onSubmit={handleRegister}>
          <Row>
            <Col md={6}>
              <div className="form-group-custom">
                <label>Full Name</label>
                <div className="input-box">
                  <i className="bi bi-person icon-left"></i>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Enter full name" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="form-group-custom">
                <label>Email Address</label>
                <div className="input-box">
                  <i className="bi bi-envelope icon-left"></i>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Enter email" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div className="form-group-custom">
                <label>{role === 'Student' ? 'Registered Number' : 'Faculty ID'}</label>
                <div className="input-box">
                  <i className="bi bi-card-text icon-left"></i>
                  <input 
                    type="text" 
                    name="registeredNumber"
                    placeholder={role === 'Student' ? "23A91A0501" : "FAC123"}
                    value={formData.registeredNumber}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="form-group-custom">
                <label>Mobile Number</label>
                <div className="input-box">
                  <i className="bi bi-phone icon-left"></i>
                  <input 
                    type="tel" 
                    name="mobile"
                    placeholder="10 digit number" 
                    value={formData.mobile}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={role === 'Student' ? 6 : 12}>
              <div className="form-group-custom">
                <label>Department</label>
                <select 
                  name="department" 
                  className="form-select-custom"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
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
                  <input 
                    type="text" 
                    name="section"
                    className="form-input-plain"
                    placeholder="e.g. A" 
                    value={formData.section}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </Col>
            )}
          </Row>

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
              <button 
                type="button" 
                className="pass-toggle" 
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="register-btn">Register</button>
        </Form>

        <div className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>

      <style>{`
        .register-wrapper {
          width: 100vw;
          min-height: 100vh;
          overflow-y: auto;
          font-family: 'Poppins', sans-serif;
          background: #020E2B;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 40px 20px;
        }

        .background-animations {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
          background: linear-gradient(135deg, #020E2B 0%, #06163A 100%);
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
          filter: blur(80px);
          opacity: 0.4;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: rgba(0, 97, 255, 0.3);
          top: -10%;
          left: -5%;
          animation: orbFloat 15s ease-in-out infinite alternate;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: rgba(100, 255, 218, 0.15);
          bottom: -10%;
          right: -5%;
          animation: orbFloat 20s ease-in-out infinite alternate-reverse;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          background: rgba(124, 58, 237, 0.2);
          top: 40%;
          right: 20%;
          animation: orbFloat 18s ease-in-out infinite alternate;
        }

        @keyframes meshMove {
          from { background-position: 0 0; }
          to { background-position: 50px 50px; }
        }

        @keyframes orbFloat {
          from { transform: translate(0, 0) rotate(0deg); }
          to { transform: translate(30px, 50px) rotate(10deg); }
        }

        .glass-register-card {
          width: 100%;
          max-width: 600px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 25px 50px rgba(0,0,0,0.4);
          padding: 40px;
          position: relative;
          z-index: 2;
          animation: fadeInUp 0.8s ease-out;
        }

        .branding {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
        }

        .logo-img {
          width: 55px;
          height: 55px;
          object-fit: contain;
        }

        .college-name {
          color: white;
          font-weight: 700;
          margin: 0;
          font-size: 1rem;
          line-height: 1;
        }

        .college-dept {
          color: rgba(255,255,255,0.8);
          font-size: 0.7rem;
          margin: 0;
          font-weight: 500;
        }

        .register-title {
          color: white;
          font-weight: 600;
          margin-bottom: 20px;
          font-size: 1.5rem;
        }

        .custom-tabs-register .nav-link {
          color: rgba(255,255,255,0.6) !important;
          border: none !important;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .custom-tabs-register .nav-link.active {
          background: #0061FF !important;
          color: white !important;
          border-radius: 8px !important;
        }

        .form-group-custom {
          margin-bottom: 18px;
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
          left: 12px;
          color: #64748B;
          font-size: 0.95rem;
        }

        .input-box input, .form-input-plain {
          width: 100%;
          padding: 11px 40px;
          border-radius: 8px;
          border: none;
          background: white;
          color: #0F172A;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .form-input-plain {
          padding: 11px 15px;
        }

        .form-select-custom {
          width: 100%;
          padding: 11px 15px;
          border-radius: 8px;
          border: none;
          background: white;
          color: #0F172A;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
        }

        .pass-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
        }

        .register-btn {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: none;
          background: #0061FF;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          margin-top: 15px;
          transition: 0.3s;
          box-shadow: 0 4px 12px rgba(0, 97, 255, 0.3);
        }

        .register-btn:hover {
          background: #0056E0;
          transform: translateY(-1px);
        }

        .login-link {
          text-align: center;
          margin-top: 20px;
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
        }

        .login-link a {
          color: white;
          text-decoration: none;
          font-weight: 600;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Register;
