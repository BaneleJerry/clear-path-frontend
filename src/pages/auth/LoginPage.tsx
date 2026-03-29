import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from "../../store/store";
import { setLogin } from '../../store/features/authSlice';
import { checkAuth } from '../../store/features/authThunk';
import { authService } from '../../services/authService';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Perform Login API Call
      const response = await authService.login({ email, password });
      const token = response.data?.token;

      if (!token) {
        throw new Error("Authentication failed: No token received.");
      }

      // 2. Save token to Redux (which also updates localStorage)
      dispatch(setLogin(response));

      // 3. Fetch User Profile/Roles and confirm authentication
      // .unwrap() allows us to catch errors from the thunk directly here
      await dispatch(checkAuth()).unwrap();

      // 4. Success! Navigate to the dashboard
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        'Invalid email or password. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-2xl shadow-sm border border-border">

        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary tracking-tight">
            Clear-Path
          </h2>
          <p className="mt-2 text-sm text-textSecondary">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-2 bg-error/10 text-error text-sm p-3 rounded-lg border border-error/20">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-textSecondary" />
              <input
                type="email"
                autoComplete="email"
                required
                className="w-full px-10 py-3 rounded-lg border border-border bg-surface text-textPrimary focus:ring-2 focus:ring-primary transition-all outline-none"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-textSecondary" />
              <input
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-10 py-3 rounded-lg border border-border bg-surface text-textPrimary focus:ring-2 focus:ring-primary transition-all outline-none"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-white bg-primary hover:bg-primary/90 disabled:opacity-50 transition-all font-semibold shadow-md"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="pt-4 text-center border-t border-border">
          <p className="text-sm text-textSecondary">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-primary font-medium hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}