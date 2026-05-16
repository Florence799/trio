import React, { useState, useEffect } from 'react';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

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
    <div className={`login-wrapper ${mounted ? 'lw-visible' : ''}`}>
      <div className="l-bg">
        <div className="l-gradient"></div>
        <div className="l-circuit-grid"></div>
        <div className="l-scan-line"></div>
        <div className="l-orb l-orb-1"></div>
        <div className="l-orb l-orb-2"></div>
        {[...Array(18)].map((_, i) => (
          <div key={i} className="l-star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${1.5 + Math.random() * 2}s`,
          }} />
        ))}
      </div>
      
      <div className="glass-card login-card-expanded">
        <div className="l-neon-border"></div>
        <div className="l-card-scanline"></div>

        <div className="branding l-stagger" style={{'--i': 0}}>
          <div className="logo-wrap">
            <img src={logoImg} alt="Logo" className="logo-img" />
            <div className="logo-ring"></div>
          </div>
          <div className="college-info">
            <h6 className="college-name">SWARNANDHRA COLLEGE OF ENGINEERING & TECHNOLOGY</h6>
            <p className="college-dept">LMS Portal</p>
          </div>
        </div>

        <h4 className="section-title l-stagger" style={{'--i': 1}}>Select Account Type</h4>
        
        <div className="role-selection l-stagger" style={{'--i': 2}}>
          {[{k:'Student',ic:'bi-mortarboard-fill'},{k:'Faculty',ic:'bi-person-workspace'},{k:'Admin',ic:'bi-shield-lock-fill'}].map((r) => (
            <div key={r.k} className={`role-card ${role === r.k ? 'active' : ''}`} onClick={() => setRole(r.k)}>
              <div className="role-icon"><i className={`bi ${r.ic}`}></i></div>
              <span>{r.k}</span>
              {role === r.k && <i className="bi bi-check-circle-fill checkmark"></i>}
            </div>
          ))}
        </div>

        {error && <div className="alert alert-danger py-2 small text-center mb-3 l-shake">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group-custom l-stagger" style={{'--i': 3}}>
            <label>Email or Registration Number</label>
            <div className="input-box">
              <i className="bi bi-envelope icon-left"></i>
              <input type="text" placeholder="Enter email or ID" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
            </div>
          </div>

          <div className="form-group-custom l-stagger" style={{'--i': 4}}>
            <label>Password</label>
            <div className="input-box">
              <i className="bi bi-lock icon-left"></i>
              <input type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="pass-toggle" onClick={() => setShowPassword(!showPassword)}>
                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
              </button>
            </div>
          </div>

          <div className="form-options l-stagger" style={{'--i': 5}}>
            <label className="remember-me"><input type="checkbox" /> Remember me</label>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="login-btn-gradient l-stagger" style={{'--i': 6}}>
            <span className="btn-txt">LOGIN</span>
            <span className="btn-shimmer"></span>
          </button>
        </form>

        <div className="divider l-stagger" style={{'--i': 7}}><span>OR</span></div>

        <button className="google-btn l-stagger" style={{'--i': 8}}>
          <i className="bi bi-google"></i> Sign in with Google
        </button>

        <p className="register-text l-stagger" style={{'--i': 9}}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>

      <style>{`
        .login-wrapper{width:100vw;height:100vh;overflow:hidden;font-family:'Poppins',sans-serif;background:#050d1a;display:flex;align-items:center;justify-content:center;position:relative;perspective:1200px}

        /* === NEON CYBER BACKGROUND === */
        .l-bg{position:absolute;inset:0;overflow:hidden;z-index:1}
        .l-gradient{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(6,182,212,0.15),transparent 55%),radial-gradient(ellipse at 70% 80%,rgba(99,102,241,0.12),transparent 50%),linear-gradient(180deg,#050d1a,#0a1628)}
        .l-circuit-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(6,182,212,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.06) 1px,transparent 1px);background-size:40px 40px;mask-image:radial-gradient(ellipse at center,black 30%,transparent 75%);animation:lgridDrift 25s linear infinite}
        .l-scan-line{position:absolute;left:0;width:100%;height:2px;background:linear-gradient(90deg,transparent,rgba(6,182,212,0.6),rgba(6,182,212,0.9),rgba(6,182,212,0.6),transparent);animation:lscanDown 4s ease-in-out infinite;z-index:2;filter:blur(0.5px);box-shadow:0 0 15px rgba(6,182,212,0.4)}
        .l-orb{position:absolute;border-radius:50%;filter:blur(80px)}
        .l-orb-1{width:400px;height:400px;background:rgba(6,182,212,0.2);top:-5%;left:-5%;animation:lorb1 12s ease-in-out infinite alternate}
        .l-orb-2{width:350px;height:350px;background:rgba(99,102,241,0.18);bottom:0;right:-5%;animation:lorb2 15s ease-in-out infinite alternate}
        .l-star{position:absolute;width:3px;height:3px;background:white;border-radius:50%;animation:ltwinkle ease-in-out infinite;pointer-events:none}

        @keyframes lgridDrift{from{background-position:0 0}to{background-position:40px 40px}}
        @keyframes lscanDown{0%{top:-2px;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:100%;opacity:0}}
        @keyframes lorb1{0%{transform:translate(0,0) scale(1)}100%{transform:translate(30px,40px) scale(1.15)}}
        @keyframes lorb2{0%{transform:translate(0,0) scale(1)}100%{transform:translate(-25px,-35px) scale(1.1)}}
        @keyframes ltwinkle{0%,100%{opacity:0;transform:scale(0.5)}50%{opacity:1;transform:scale(1.2)}}

        /* === CARD - 3D Slide from Left === */
        @keyframes lcardSlideIn{0%{opacity:0;transform:rotateY(12deg) translateX(-80px) scale(0.92)}60%{transform:rotateY(-2deg) translateX(8px) scale(1.01)}100%{opacity:1;transform:rotateY(0) translateX(0) scale(1)}}
        .login-card-expanded{width:95%;max-width:500px;background:rgba(8,20,40,0.85);backdrop-filter:blur(25px);-webkit-backdrop-filter:blur(25px);border-radius:20px;border:1px solid rgba(6,182,212,0.15);box-shadow:0 0 40px rgba(6,182,212,0.08),0 30px 60px rgba(0,0,0,0.5);padding:35px;position:relative;z-index:2;animation:lcardSlideIn 1s cubic-bezier(0.22,1,0.36,1) forwards;overflow:hidden}

        /* Neon border */
        .l-neon-border{position:absolute;inset:-1px;border-radius:21px;background:conic-gradient(from 0deg,rgba(6,182,212,0.5),rgba(99,102,241,0.4),rgba(6,182,212,0.1),rgba(99,102,241,0.4),rgba(6,182,212,0.5));z-index:-1;animation:lneonSpin 6s linear infinite;filter:blur(2px);pointer-events:none}
        @keyframes lneonSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

        /* Card scanline inside */
        .l-card-scanline{position:absolute;left:0;width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(6,182,212,0.15),transparent);animation:lcardScan 3s linear infinite;pointer-events:none;z-index:10}
        @keyframes lcardScan{0%{top:0}100%{top:100%}}

        /* === STAGGER - Slide from Left === */
        @keyframes lslideLeft{from{opacity:0;transform:translateX(-40px);filter:blur(3px)}to{opacity:1;transform:translateX(0);filter:blur(0)}}
        .l-stagger{opacity:0;animation:lslideLeft 0.5s cubic-bezier(0.22,1,0.36,1) forwards;animation-delay:calc(0.2s + var(--i)*0.09s)}

        .l-shake{animation:lshake 0.5s ease}
        @keyframes lshake{15%{transform:translateX(-6px)}30%{transform:translateX(6px)}45%{transform:translateX(-4px)}60%{transform:translateX(4px)}75%,100%{transform:translateX(0)}}

        /* Logo - Neon pulse instead of spin */
        .logo-wrap{position:relative;width:45px;height:45px;flex-shrink:0}
        .logo-img{width:45px;height:45px;object-fit:contain;border-radius:50%;position:relative;z-index:1}
        .logo-ring{position:absolute;inset:-5px;border-radius:50%;border:2px solid rgba(6,182,212,0.5);animation:llogoPulse 2s ease-in-out infinite}
        @keyframes llogoPulse{0%,100%{box-shadow:0 0 5px rgba(6,182,212,0.2);transform:scale(1)}50%{box-shadow:0 0 20px rgba(6,182,212,0.5),0 0 40px rgba(6,182,212,0.15);transform:scale(1.05)}}

        .branding{display:flex;align-items:center;gap:12px;margin-bottom:25px}
        .college-name{color:#e2e8f0;font-weight:700;margin:0;font-size:0.8rem;line-height:1.2}
        .college-dept{color:rgba(6,182,212,0.8);font-size:0.65rem;margin:0;font-weight:600;letter-spacing:1px;text-transform:uppercase}
        .section-title{color:#e2e8f0;font-size:1rem;font-weight:600;margin-bottom:20px;text-align:center}

        /* Role cards - Neon hover */
        .role-selection{display:flex;gap:15px;margin-bottom:30px}
        .role-card{flex:1;background:rgba(6,182,212,0.04);border:1px solid rgba(6,182,212,0.1);border-radius:14px;padding:20px 10px;display:flex;flex-direction:column;align-items:center;cursor:pointer;transition:all 0.4s cubic-bezier(0.22,1,0.36,1);position:relative;overflow:hidden}
        .role-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(6,182,212,0.08),transparent);opacity:0;transition:opacity 0.4s}
        .role-card:hover::before{opacity:1}
        .role-card:hover{transform:translateY(-5px);border-color:rgba(6,182,212,0.3);box-shadow:0 0 20px rgba(6,182,212,0.1),0 10px 30px rgba(0,0,0,0.2)}
        .role-card.active{background:rgba(6,182,212,0.08);border-color:rgba(6,182,212,0.5);box-shadow:0 0 30px rgba(6,182,212,0.15),inset 0 0 20px rgba(6,182,212,0.03)}
        .role-icon{font-size:2.2rem;color:rgba(6,182,212,0.7);margin-bottom:10px;transition:all 0.4s}
        .role-card:hover .role-icon{transform:scale(1.15);color:rgba(6,182,212,0.9);filter:drop-shadow(0 0 8px rgba(6,182,212,0.4))}
        .role-card.active .role-icon{color:#06b6d4;filter:drop-shadow(0 0 12px rgba(6,182,212,0.5))}
        .role-card span{color:#e2e8f0;font-size:0.85rem;font-weight:600}
        .checkmark{position:absolute;bottom:10px;right:10px;color:#06b6d4;font-size:0.9rem;animation:lslideLeft 0.3s ease forwards}

        /* Form - Neon focus */
        .form-group-custom{margin-bottom:15px}
        .form-group-custom label{color:rgba(148,163,184,0.9);font-size:0.75rem;margin-bottom:6px;display:block;transition:color 0.3s}
        .input-box{position:relative;display:flex;align-items:center}
        .icon-left{position:absolute;left:12px;color:#475569;z-index:2;transition:all 0.3s}
        .input-box input{width:100%;padding:10px 35px;border-radius:10px;border:1px solid rgba(6,182,212,0.12);background:rgba(15,23,42,0.8);color:#e2e8f0;font-size:0.9rem;font-weight:500;transition:all 0.35s cubic-bezier(0.22,1,0.36,1)}
        .input-box input:focus{outline:none;border-color:rgba(6,182,212,0.5);background:rgba(15,23,42,0.95);box-shadow:0 0 0 3px rgba(6,182,212,0.1),0 0 20px rgba(6,182,212,0.08);transform:translateY(-1px)}
        .input-box input::placeholder{color:#475569}
        .input-box:focus-within .icon-left{color:#06b6d4;filter:drop-shadow(0 0 4px rgba(6,182,212,0.4))}
        .form-group-custom:focus-within label{color:#06b6d4}
        .pass-toggle{position:absolute;right:10px;background:none;border:none;color:#475569;cursor:pointer;z-index:2;transition:all 0.3s}
        .pass-toggle:hover{color:#06b6d4}

        .form-options{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;font-size:0.75rem}
        .remember-me{color:rgba(148,163,184,0.8);display:flex;align-items:center;gap:5px;cursor:pointer}
        .form-options a{color:#06b6d4;text-decoration:none;font-weight:600;transition:all 0.3s}
        .form-options a:hover{text-shadow:0 0 10px rgba(6,182,212,0.5)}

        /* Button - Neon pulse */
        .login-btn-gradient{width:100%;padding:12px;border-radius:10px;border:1px solid rgba(6,182,212,0.3);background:linear-gradient(135deg,rgba(6,182,212,0.15),rgba(99,102,241,0.15));color:#06b6d4;font-weight:700;font-size:0.9rem;letter-spacing:2px;transition:all 0.4s;cursor:pointer;position:relative;overflow:hidden}
        .login-btn-gradient:hover{background:linear-gradient(135deg,rgba(6,182,212,0.25),rgba(99,102,241,0.2));box-shadow:0 0 30px rgba(6,182,212,0.2),0 10px 30px rgba(0,0,0,0.3);transform:translateY(-2px);border-color:rgba(6,182,212,0.5)}
        .login-btn-gradient:active{transform:translateY(0) scale(0.98)}
        .btn-txt{position:relative;z-index:1}
        .btn-shimmer{position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(6,182,212,0.15),transparent);animation:lshimmer 3s infinite}
        @keyframes lshimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}

        .divider{text-align:center;position:relative;margin:20px 0}
        .divider::before{content:"";position:absolute;left:0;top:50%;width:42%;height:1px;background:linear-gradient(90deg,transparent,rgba(6,182,212,0.15))}
        .divider::after{content:"";position:absolute;right:0;top:50%;width:42%;height:1px;background:linear-gradient(270deg,transparent,rgba(6,182,212,0.15))}
        .divider span{color:rgba(148,163,184,0.5);font-size:0.7rem;font-weight:600}

        .google-btn{width:100%;padding:10px;border-radius:10px;border:1px solid rgba(6,182,212,0.1);background:rgba(6,182,212,0.03);color:#94a3b8;font-size:0.85rem;font-weight:600;display:flex;align-items:center;justify-content:center;gap:10px;transition:all 0.4s;cursor:pointer}
        .google-btn:hover{background:rgba(6,182,212,0.08);transform:translateY(-2px);border-color:rgba(6,182,212,0.25);color:#e2e8f0}

        .register-text{text-align:center;margin-top:25px;font-size:0.8rem;color:rgba(148,163,184,0.6)}
        .register-text a{color:#06b6d4;font-weight:700;text-decoration:none;transition:all 0.3s}
        .register-text a:hover{text-shadow:0 0 15px rgba(6,182,212,0.5);color:#22d3ee}
      `}</style>
    </div>
  );
};

export default Login;
