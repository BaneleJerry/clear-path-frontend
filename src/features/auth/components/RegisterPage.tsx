import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../lib/store';
import { registerUser } from '../authThunk';
import { User, Mail, Lock, Hash, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { inviteService, type InviteResponse } from '../authService';

export default function RegisterPage() {
    const [searchParams] = useSearchParams();
    const [localError, setLocalError] = useState('');
    const [invite, setInvite] = useState<InviteResponse | null>(null);
    const [inviteLoading, setInviteLoading] = useState(false);

    // Code redemption mode (when no token in URL)
    const [codeMode, setCodeMode] = useState(false);
    const [codeForm, setCodeForm] = useState({ email: '', code: '' });

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        inviteToken: '',
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading } = useAppSelector((state) => state.auth);

    // On mount: if ?token= in URL, validate it immediately
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setInviteLoading(true);
            inviteService.redeemByToken(token)
                .then((inv) => {
                    setInvite(inv);
                    setFormData((f) => ({
                        ...f,
                        email: inv.inviteeEmail ?? "",
                        inviteToken: inv.token ?? "",
                    }));
                })
                .catch(() => setLocalError('This invite link is invalid or has expired.'))
                .finally(() => setInviteLoading(false));
        }
    }, [searchParams]);

    // Redeem by code manually
    const handleRedeemCode = async () => {
        setLocalError('');
        setInviteLoading(true);
        try {
            const inv = await inviteService.redeemByCode(codeForm);
            setInvite(inv);
            setFormData((f) => ({
                ...f,
                email: inv.inviteeEmail ?? "",
                inviteToken: inv.token ?? "",
            }));
            setCodeMode(false);
        } catch {
            setLocalError('Invalid code or email. Please try again.');
        } finally {
            setInviteLoading(false);
        }
    };

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
        <div style={{
            width: '100vw', minHeight: '100svh',
            marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)',
            display: 'flex', textAlign: 'left',
            fontFamily: "'DM Sans', sans-serif",
            boxSizing: 'border-box', overflow: 'hidden',
        }}>
            {/* Left panel */}
            <div style={{
                width: '38%', maxWidth: '520px', flexShrink: 0,
                background: '#1C1917', padding: '56px 48px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
                <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '22px', color: '#FAFAF9', margin: 0 }}>
                    Clear<span style={{ color: '#D97706' }}>-</span>Path
                </p>
                <div>
                    <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '32px', color: '#FAFAF9', marginBottom: '16px' }}>
                        Start your <em style={{ color: '#D97706', fontStyle: 'italic' }}>journey</em> with clarity.
                    </p>
                    <p style={{ fontSize: '14px', color: '#A8A29E', lineHeight: 1.6 }}>
                        Build better habits, track progress, and take control of your future.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                    {[false, true, false].map((active, i) => (
                        <span key={i} style={{
                            width: '7px', height: '7px', borderRadius: '50%',
                            background: active ? '#D97706' : '#44403C',
                        }} />
                    ))}
                </div>
            </div>

            {/* Right panel */}
            <div style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgb(var(--token-surface))', padding: '48px 32px',
            }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>

                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{
                            fontFamily: "'DM Serif Display', serif", fontSize: '32px',
                            color: 'rgb(var(--token-text-primary))', marginBottom: '8px', fontWeight: 400,
                        }}>
                            Create account
                        </h2>
                        <p style={{ fontSize: '14px', color: 'rgb(var(--token-text-secondary))' }}>
                            Get started with Clear-Path
                        </p>
                    </div>

                    {/* Error */}
                    {localError && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            fontSize: '13px', padding: '10px 12px', borderRadius: '8px',
                            border: '1px solid rgba(var(--token-error), 0.2)',
                            background: 'rgba(var(--token-error), 0.08)',
                            color: 'rgb(var(--token-error))', marginBottom: '20px',
                        }}>
                            <AlertCircle size={15} /><span>{localError}</span>
                        </div>
                    )}

                    {/* Invite badge */}
                    {invite && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            fontSize: '13px', padding: '10px 12px', borderRadius: '8px',
                            border: '1px solid rgba(var(--token-success), 0.2)',
                            background: 'rgba(var(--token-success), 0.08)',
                            color: 'rgb(var(--token-success))', marginBottom: '20px',
                        }}>
                            <CheckCircle2 size={15} />
                            <span>Invite verified — registering as <strong>{invite.assignedRole?.replace('ROLE_', '')}</strong></span>
                        </div>
                    )}

                    {/* Code redemption form */}
                    {!invite && codeMode && (
                        <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ position: 'relative' }}>
                                <Mail size={15} style={iconStyle} />
                                <input
                                    placeholder="Your email"
                                    value={codeForm.email}
                                    onChange={(e) => setCodeForm({ ...codeForm, email: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Hash size={15} style={iconStyle} />
                                <input
                                    placeholder="Invite code (e.g. RNAQKVDQ)"
                                    value={codeForm.code}
                                    onChange={(e) => setCodeForm({ ...codeForm, code: e.target.value.toUpperCase() })}
                                    style={inputStyle}
                                />
                            </div>
                            <button
                                onClick={handleRedeemCode}
                                disabled={inviteLoading}
                                style={{
                                    height: '42px', borderRadius: '8px', border: '1px solid #D97706',
                                    background: 'transparent', color: '#D97706',
                                    cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                                }}
                            >
                                {inviteLoading ? 'Verifying...' : 'Verify code'}
                            </button>
                            <button onClick={() => setCodeMode(false)} style={{
                                background: 'none', border: 'none', fontSize: '13px',
                                color: 'rgb(var(--token-text-secondary))', cursor: 'pointer',
                            }}>
                                ← Back
                            </button>
                        </div>
                    )}

                    {/* No invite yet — prompt */}
                    {!invite && !codeMode && (
                        <div style={{
                            padding: '12px', borderRadius: '8px', marginBottom: '24px',
                            border: '1px solid rgb(var(--token-border))',
                            background: 'rgb(var(--token-bg))',
                            fontSize: '13px', color: 'rgb(var(--token-text-secondary))',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <span>Have an invite code?</span>
                            <button onClick={() => setCodeMode(true)} style={{
                                background: 'none', border: 'none', color: '#D97706',
                                cursor: 'pointer', fontWeight: 500, fontSize: '13px',
                            }}>
                                Enter code →
                            </button>
                        </div>
                    )}

                    {/* Registration form — only show once invite is verified */}
                    {invite && (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <User size={15} style={iconStyle} />
                                    <input name="firstName" placeholder="First name" value={formData.firstName}
                                        onChange={handleChange} required style={inputStyle} />
                                </div>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <User size={15} style={iconStyle} />
                                    <input name="lastName" placeholder="Last name" value={formData.lastName}
                                        onChange={handleChange} required style={inputStyle} />
                                </div>
                            </div>

                            {/* Email locked to invite */}
                            <div style={{ position: 'relative' }}>
                                <Mail size={15} style={iconStyle} />
                                <input name="email" type="email" value={formData.email}
                                    readOnly style={{ ...inputStyle, opacity: 0.7, cursor: 'not-allowed' }} />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <Lock size={15} style={iconStyle} />
                                <input name="password" type="password" placeholder="••••••••"
                                    value={formData.password} onChange={handleChange} required style={inputStyle} />
                            </div>

                            <button type="submit" disabled={isLoading} style={{
                                width: '100%', height: '46px', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', gap: '8px',
                                borderRadius: '8px', border: 'none', background: '#1C1917',
                                color: '#FAFAF9', cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.6 : 1,
                            }}>
                                {isLoading
                                    ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                    : <><span>Create account</span><ArrowRight size={15} /></>
                                }
                            </button>
                        </form>
                    )}

                    <p style={{
                        textAlign: 'center', fontSize: '14px', marginTop: '24px',
                        color: 'rgb(var(--token-text-secondary))'
                    }}>
                        Already have an account?{' '}
                        <button onClick={() => navigate('/login')} style={{
                            color: '#D97706', background: 'none', border: 'none',
                            cursor: 'pointer', fontWeight: 500,
                        }}>
                            Sign in
                        </button>
                    </p>
                </div>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: '100%', height: '44px', paddingLeft: '40px', paddingRight: '14px',
    borderRadius: '8px', border: '1px solid rgb(var(--token-border))',
    background: 'rgb(var(--token-bg))', color: 'rgb(var(--token-text-primary))',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
};

const iconStyle: React.CSSProperties = {
    position: 'absolute', left: '13px', top: '50%',
    transform: 'translateY(-50%)', color: 'rgb(var(--token-text-secondary))',
};