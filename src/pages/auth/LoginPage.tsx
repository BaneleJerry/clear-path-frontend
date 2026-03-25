import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../features/auth/authService'; // Import the service
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Use the real authService linked to your generated types
            const response = await authService.login({
                email,
                password
            });

            // Store the response (token and type) in Zustand
            setAuth(response);

            // Navigate to protected dashboard
            navigate('/dashboard');
        } catch (err: any) {
            // Handle specific API errors if available, otherwise fallback
            const message = err.response?.data?.message || 'Invalid email or password. Please try again.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
  <div className="min-h-screen flex items-center justify-center bg-background px-4">
    
    {/* Card */}
    <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-2xl shadow-sm border border-border">

      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-primary">
          Clear-Path
        </h2>
        <p className="mt-2 text-sm text-textSecondary">
          Sign in to manage your milestones
        </p>
      </div>

      {/* Form */}
      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>

        {/* Error */}
        {error && (
          <div className="bg-error/10 text-error text-sm p-3 rounded-lg text-center border border-error/20">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-4">

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-textSecondary" />
            <input
              type="email"
              required
              className="w-full px-10 py-3 rounded-lg border border-border bg-surface 
                         text-textPrimary placeholder:text-textSecondary
                         focus:outline-none focus:ring-2 focus:ring-primary 
                         transition-all"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-textSecondary" />
            <input
              type="password"
              required
              className="w-full px-10 py-3 rounded-lg border border-border bg-surface 
                         text-textPrimary placeholder:text-textSecondary
                         focus:outline-none focus:ring-2 focus:ring-primary 
                         transition-all"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 
                     text-sm font-semibold rounded-lg text-white 
                     bg-primary hover:bg-blue-600 
                     focus:outline-none focus:ring-2 focus:ring-primary 
                     disabled:opacity-50 transition-all shadow-sm"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            "Sign in"
          )}
        </button>

      </form>

      {/* Footer */}
      <div className="text-center text-sm text-textSecondary">
        Forgot password?
      </div>

    </div>
  </div>
);
}