import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../lib/store';
import { registerUser } from '../authThunk';
import { User, Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    const [localError, setLocalError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { isLoading } = useAppSelector((state) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        try {
            await dispatch(registerUser(formData)).unwrap();
            navigate('/login', { replace: true });
        } catch (err: any) {
            setLocalError(err || 'Registration failed. Please check your details.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
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
            {/* ── Left panel (same as login) ── */}
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
                }}
            >
                <p style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: '22px',
                    color: '#FAFAF9',
                    margin: 0,
                }}>
                    Clear<span style={{ color: '#D97706' }}>-</span>Path
                </p>

                <div>
                    <p style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: '32px',
                        color: '#FAFAF9',
                        marginBottom: '16px',
                    }}>
                        Start your{' '}
                        <em style={{ color: '#D97706', fontStyle: 'italic' }}>journey</em>{' '}
                        with clarity.
                    </p>

                    <p style={{
                        fontSize: '14px',
                        color: '#A8A29E',
                        lineHeight: 1.6,
                    }}>
                        Build better habits, track progress, and take control of your future.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                    {[false, true, false].map((active, i) => (
                        <span
                            key={i}
                            style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                background: active ? '#D97706' : '#44403C',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* ── Right panel ── */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgb(var(--token-surface))',
                padding: '48px 32px',
            }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>

                    {/* Heading */}
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: '32px',
                            color: 'rgb(var(--token-text-primary))',
                            marginBottom: '8px',
                            fontWeight: 400,
                        }}>
                            Create account
                        </h2>
                        <p style={{
                            fontSize: '14px',
                            color: 'rgb(var(--token-text-secondary))',
                        }}>
                            Get started with Clear-Path
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>

                        {localError && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '13px',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(var(--token-error), 0.2)',
                                background: 'rgba(var(--token-error), 0.08)',
                                color: 'rgb(var(--token-error))',
                            }}>
                                <AlertCircle size={15} />
                                <span>{localError}</span>
                            </div>
                        )}

                        {/* Name fields */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <User size={15} style={{
                                    position: 'absolute',
                                    left: '13px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'rgb(var(--token-text-secondary))',
                                }} />
                                <input
                                    name="firstName"
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            <div style={{ flex: 1, position: 'relative' }}>
                                <User size={15} style={{
                                    position: 'absolute',
                                    left: '13px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'rgb(var(--token-text-secondary))',
                                }} />
                                <input
                                    name="lastName"
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div style={{ position: 'relative' }}>
                            <Mail size={15} style={iconStyle} />
                            <input
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ position: 'relative' }}>
                            <Lock size={15} style={iconStyle} />
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
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
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.6 : 1,
                            }}
                        >
                            {isLoading
                                ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                : <><span>Create account</span><ArrowRight size={15} /></>
                            }
                        </button>
                    </form>

                    {/* Footer */}
                    <p style={{
                        textAlign: 'center',
                        fontSize: '14px',
                        marginTop: '24px',
                        color: 'rgb(var(--token-text-secondary))'
                    }}>
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                color: '#D97706',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 500,
                            }}
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

/* Reusable styles */
const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '44px',
    paddingLeft: '40px',
    paddingRight: '14px',
    borderRadius: '8px',
    border: '1px solid rgb(var(--token-border))',
    background: 'rgb(var(--token-bg))',
    color: 'rgb(var(--token-text-primary))',
    fontSize: '14px',
    outline: 'none',
};

const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '13px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgb(var(--token-text-secondary))',
};