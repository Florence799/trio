import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Alert, Row, Col, Tabs, Tab } from 'react-bootstrap';
import {
  Box,
  Typography,
  TextField,
  Button as MuiButton,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Email from '@mui/icons-material/Email';
import Person from '@mui/icons-material/Person';
import Badge from '@mui/icons-material/Badge';
import Phone from '@mui/icons-material/Phone';
import axios from 'axios';
import { API_BASE } from '../config';

// Import official assets
import campusBg from '../assets/collegeimg.png';
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
      <div className="split-container">
        
        {/* Left Side: Form Panel */}
        <div className="form-panel">
          <div className="wave-pattern"></div>
          
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
        </div>

        {/* Right Side: Contained Campus Image */}
        <div className="right-panel-contained">
          <div className="boxed-image-container" style={{ backgroundImage: `url(${campusBg})` }}>
            <div className="hero-text-box">
              <h1>Join Our<br />Academic Community</h1>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .register-wrapper {
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

        /* Form Panel Styles */
        .form-panel {
          flex: 0 0 45%;
          background: linear-gradient(135deg, #020E2B 0%, #06163A 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          overflow-y: auto;
          padding: 40px 20px;
        }

        .wave-pattern {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 12px);
          opacity: 0.6;
        }

        .glass-register-card {
          width: 100%;
          max-width: 550px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 25px 50px rgba(0,0,0,0.4);
          padding: 35px;
          animation: fadeInLeft 0.8s ease-out;
        }

        .branding {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
        }

        .logo-img {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }

        .college-name {
          color: white;
          font-weight: 700;
          margin: 0;
          font-size: 0.95rem;
          line-height: 1;
        }

        .college-dept {
          color: rgba(255,255,255,0.8);
          font-size: 0.65rem;
          margin: 0;
          font-weight: 500;
        }

        .register-title {
          color: white;
          font-weight: 600;
          margin-bottom: 20px;
          font-size: 1.4rem;
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
          margin-bottom: 15px;
        }

        .form-group-custom label {
          color: rgba(255,255,255,0.7);
          font-size: 0.75rem;
          margin-bottom: 5px;
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
          font-size: 0.9rem;
        }

        .input-box input, .form-input-plain {
          width: 100%;
          padding: 10px 35px;
          border-radius: 8px;
          border: none;
          background: white;
          color: #0F172A;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .form-input-plain {
          padding: 10px 15px;
        }

        .form-select-custom {
          width: 100%;
          padding: 10px 15px;
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
          height: 600px; 
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
          bottom: 10%;
          right: 8%;
          text-align: right;
        }

        .hero-text-box h1 {
          color: white;
          font-weight: 800;
          font-size: 2.8rem;
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
          .form-panel { flex: 1; }
          .right-panel-contained { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Register;
