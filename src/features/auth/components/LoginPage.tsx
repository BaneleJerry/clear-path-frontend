import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../../lib/store";
import { userLogin } from '../authThunk';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

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
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setLocalError(err || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-2xl border border-border">

        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary tracking-tight">Clear-Path</h2>
          <p className="mt-2 text-sm text-muted">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {localError && (
            <div className="flex items-center gap-2 bg-error/10 text-error text-sm p-3 rounded-lg border border-error/20">
              <AlertCircle className="h-4 w-4" />
              <span>{localError}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted" />
              <input
                type="email"
                required
                className="w-full px-10 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/50 transition-all outline-none bg-surface text-text placeholder:text-muted"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted" />
              <input
                type="password"
                required
                className="w-full px-10 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/50 transition-all outline-none bg-surface text-text placeholder:text-muted"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-white bg-primary hover:bg-primary/90 disabled:opacity-50 transition-all font-semibold"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign in"}
          </button>
        </form>

        <div className="pt-4 text-center border-t border-border">
          <p className="text-sm text-muted">
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')} className="text-primary font-medium hover:underline">
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}