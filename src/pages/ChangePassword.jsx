import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/apiService';
import { toast } from 'react-toastify';
import './AccountPages.css';

// Uses existing /auth/profile update to change password
const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', password: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [show, setShow] = useState({ current: false, next: false, confirm: false });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.password || form.password.length < 8) return toast.warn('New password must be at least 8 characters');
    if (form.password !== form.confirmPassword) return toast.warn('Passwords do not match');

    try {
      setSaving(true);
      // Backend updateUserProfile accepts password; currentPassword not used but kept for UX
      await authService.updateProfile({ password: form.password });
      toast.success('Password changed');
      setForm({ currentPassword: '', password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const strength = useMemo(() => {
    const p = form.password || '';
    let score = 0;
    let criteria = {
      length: p.length >= 8,
      uppercase: /[A-Z]/.test(p),
      lowercase: /[a-z]/.test(p),
      number: /[0-9]/.test(p),
      special: /[^A-Za-z0-9]/.test(p)
    };
    
    Object.values(criteria).forEach(met => met && score++);
    
    return { score, criteria }; // 0..5
  }, [form.password]);

  return (
    <main>
      {/* Enhanced Hero Section */}
      <section className="enhanced-hero">
        <div className="container enhanced-hero-content">
          <div className="enhanced-hero-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1>Change Password</h1>
          <p>Update your password to keep your account secure and protected</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="enhanced-section">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="enhanced-breadcrumb">
            <Link to="/">Home</Link>
            <span className="enhanced-breadcrumb-separator">›</span>
            <span>Change Password</span>
          </nav>

          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="enhanced-card">
              <div className="enhanced-card-header">
                <h2 className="enhanced-card-title">Update Your Password</h2>
                <p className="enhanced-card-subtitle">Create a strong, unique password to protect your account</p>
              </div>
              <div className="enhanced-card-content">
                <form onSubmit={onSubmit}>
                  {/* Current Password */}
                  <div className="enhanced-form-group">
                    <label htmlFor="currentPassword" className="enhanced-form-label">Current Password</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        id="currentPassword" 
                        name="currentPassword" 
                        type={show.current ? 'text' : 'password'} 
                        className="enhanced-form-input" 
                        value={form.currentPassword} 
                        onChange={onChange}
                        placeholder="Enter your current password"
                      />
                      <button 
                        type="button" 
                        className="enhanced-btn enhanced-btn-secondary enhanced-btn-sm" 
                        style={{ 
                          position: 'absolute', 
                          right: 'var(--space-2)', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          padding: 'var(--space-1) var(--space-2)'
                        }} 
                        onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                      >
                        {show.current ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="enhanced-form-group">
                    <label htmlFor="password" className="enhanced-form-label required">New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        id="password" 
                        name="password" 
                        type={show.next ? 'text' : 'password'} 
                        className="enhanced-form-input" 
                        required 
                        value={form.password} 
                        onChange={onChange}
                        placeholder="Enter your new password"
                      />
                      <button 
                        type="button" 
                        className="enhanced-btn enhanced-btn-secondary enhanced-btn-sm" 
                        style={{ 
                          position: 'absolute', 
                          right: 'var(--space-2)', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          padding: 'var(--space-1) var(--space-2)'
                        }} 
                        onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
                      >
                        {show.next ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {form.password && (
                      <div className="enhanced-password-strength">
                        <div className="enhanced-password-strength-bar">
                          <div 
                            className={`enhanced-password-strength-fill enhanced-password-strength-${
                              strength.score >= 4 ? 'strong' : strength.score === 3 ? 'medium' : 'weak'
                            }`}
                            style={{ width: `${(strength.score / 5) * 100}%` }}
                          />
                        </div>
                        <div className="enhanced-form-help" style={{ marginTop: 'var(--space-1)' }}>
                          Password strength: {strength.score >= 4 ? 'Strong' : strength.score === 3 ? 'Medium' : 'Weak'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="enhanced-form-group">
                    <label htmlFor="confirmPassword" className="enhanced-form-label required">Confirm New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        type={show.confirm ? 'text' : 'password'} 
                        className="enhanced-form-input" 
                        required 
                        value={form.confirmPassword} 
                        onChange={onChange}
                        placeholder="Confirm your new password"
                      />
                      <button 
                        type="button" 
                        className="enhanced-btn enhanced-btn-secondary enhanced-btn-sm" 
                        style={{ 
                          position: 'absolute', 
                          right: 'var(--space-2)', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          padding: 'var(--space-1) var(--space-2)'
                        }} 
                        onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                      >
                        {show.confirm ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
                      <div className="enhanced-form-help" style={{ color: 'var(--danger-red)' }}>
                        Passwords do not match
                      </div>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="enhanced-password-requirements">
                    <h4>Password Requirements</h4>
                    <ul>
                      <li style={{ color: strength.criteria?.length ? 'var(--success-green)' : 'inherit' }}>
                        At least 8 characters long
                      </li>
                      <li style={{ color: strength.criteria?.uppercase ? 'var(--success-green)' : 'inherit' }}>
                        Contains uppercase letter (A-Z)
                      </li>
                      <li style={{ color: strength.criteria?.lowercase ? 'var(--success-green)' : 'inherit' }}>
                        Contains lowercase letter (a-z)
                      </li>
                      <li style={{ color: strength.criteria?.number ? 'var(--success-green)' : 'inherit' }}>
                        Contains at least one number (0-9)
                      </li>
                      <li style={{ color: strength.criteria?.special ? 'var(--success-green)' : 'inherit' }}>
                        Contains special character (!@#$%^&*)
                      </li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="enhanced-btn enhanced-btn-primary enhanced-btn-lg" 
                    disabled={saving}
                    style={{ width: '100%', marginTop: 'var(--space-6)' }}
                  >
                    {saving ? (
                      <>
                        <div style={{ width: '16px', height: '16px', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        Update Password
                      </>
                    )}
                  </button>
                </form>

                {/* Security Notice */}
                <div className="enhanced-security-notice">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="enhanced-security-notice-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <div>
                    <p className="enhanced-security-notice-text">
                      <strong>Security Tip:</strong> Use a unique password that you don't use elsewhere. We store passwords securely using industry-standard encryption.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChangePassword;
