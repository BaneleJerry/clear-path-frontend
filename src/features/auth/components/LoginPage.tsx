import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../lib/store';
import { checkAuth, userLogin } from '../authThunk';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    try {
       await dispatch(userLogin({ email, password })).unwrap();
       await dispatch(checkAuth()).unwrap();

      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setLocalError(err || 'Invalid email or password.');
    }
  };

  return (
    /*
      Outer wrapper uses 100vw + negative margins to fully escape
      #root's constraints: width: 1126px, margin: 0 auto, border-inline.
      This eliminates the side gutters and faint border lines.
    */
    <div
      style={{
        width: '100vw',
        minHeight: '100svh',
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)',
        display: 'flex',
        textAlign: 'left',
        fontFamily: "'DM Sans', sans-serif",
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* ── Left dark panel — fixed ~38% width ── */}
      <div
        style={{
          width: '38%',
          maxWidth: '520px',
          flexShrink: 0,
          background: '#1C1917',
          padding: '56px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '-70px', right: '-70px',
          width: '260px', height: '260px', borderRadius: '50%',
          background: '#D97706', opacity: 0.12, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-50px', left: '-50px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: '#D97706', opacity: 0.08, pointerEvents: 'none',
        }} />

        {/* Brand */}
        <p style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: '22px',
          color: '#FAFAF9',
          letterSpacing: '-0.3px',
          position: 'relative',
          zIndex: 1,
          margin: 0,
        }}>
          Clear<span style={{ color: '#D97706' }}>-</span>Path
        </p>

        {/* Tagline */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '32px',
            lineHeight: 1.2,
            color: '#FAFAF9',
            letterSpacing: '-0.5px',
            marginBottom: '16px',
          }}>
            Navigate your{' '}
            <em style={{ color: '#D97706', fontStyle: 'italic' }}>finances</em>{' '}
            with clarity.
          </p>
          <p style={{ fontSize: '14px', color: '#A8A29E', lineHeight: 1.65, fontWeight: 300, margin: 0 }}>
            A smarter way to track, plan, and move forward — one clear step at a time.
          </p>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', gap: '6px', position: 'relative', zIndex: 1 }}>
          {[true, false, false].map((active, i) => (
            <span key={i} style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: active ? '#D97706' : '#44403C',
              display: 'inline-block',
            }} />
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgb(var(--token-surface))',
        padding: '48px 32px',
        boxSizing: 'border-box',
      }}>
        {/* Inner content capped at 440px so it doesn't stretch on wide screens */}
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Heading */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '32px',
              letterSpacing: '-0.5px',
              color: 'rgb(var(--token-text-primary))',
              marginBottom: '8px',
              fontWeight: 400,
            }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '14px', color: 'rgb(var(--token-text-secondary))', fontWeight: 300, margin: 0 }}>
              Sign in to continue to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {localError && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '13px', padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(var(--token-error), 0.2)',
                background: 'rgba(var(--token-error), 0.08)',
                color: 'rgb(var(--token-error))',
              }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{localError}</span>
              </div>
            )}

            {/* Email field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.9px',
                textTransform: 'uppercase',
                color: 'rgb(var(--token-text-secondary))',
                marginBottom: '8px',
              }}>
                Email
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={15} style={{
                  position: 'absolute', left: '13px',
                  color: 'rgb(var(--token-text-secondary))',
                  pointerEvents: 'none',
                }} />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    height: '44px',
                    paddingLeft: '40px',
                    paddingRight: '14px',
                    borderRadius: '8px',
                    border: '1px solid rgb(var(--token-border))',
                    background: 'rgb(var(--token-bg))',
                    color: 'rgb(var(--token-text-primary))',
                    fontSize: '14px',
                    fontFamily: "'DM Sans', sans-serif",
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#D97706';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(217,119,6,0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgb(var(--token-border))';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.9px',
                  textTransform: 'uppercase',
                  color: 'rgb(var(--token-text-secondary))',
                }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#D97706',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={15} style={{
                  position: 'absolute', left: '13px',
                  color: 'rgb(var(--token-text-secondary))',
                  pointerEvents: 'none',
                }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: '44px',
                    paddingLeft: '40px',
                    paddingRight: '14px',
                    borderRadius: '8px',
                    border: '1px solid rgb(var(--token-border))',
                    background: 'rgb(var(--token-bg))',
                    color: 'rgb(var(--token-text-primary))',
                    fontSize: '14px',
                    fontFamily: "'DM Sans', sans-serif",
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#D97706';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(217,119,6,0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgb(var(--token-border))';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '8px',
                border: 'none',
                background: '#1C1917',
                color: '#FAFAF9',
                fontSize: '15px',
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
                transition: 'background 0.15s',
                marginTop: '4px',
              }}
              onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = '#292524'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#1C1917'; }}
            >
              {isLoading
                ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                : <><span>Sign in</span><ArrowRight size={15} /></>
              }
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <span style={{ flex: 1, height: '1px', background: 'rgb(var(--token-border))' }} />
            <span style={{ fontSize: '12px', color: 'rgb(var(--token-text-secondary))' }}>or</span>
            <span style={{ flex: 1, height: '1px', background: 'rgb(var(--token-border))' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgb(var(--token-text-secondary))', margin: 0 }}>
            No account?{' '}
            <button
              onClick={() => navigate('/register')}
              style={{
                color: '#D97706',
                fontWeight: 500,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: "'DM Sans', sans-serif",
                padding: 0,
              }}
            >
              Create one
            </button>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
