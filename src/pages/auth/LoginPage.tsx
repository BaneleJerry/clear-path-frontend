import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from "../../store/store";
import { setToken } from '../../store/slices/authSlice';
import { authService } from '../../features/auth/authService';
import { Lock, Mail, Loader2 } from 'lucide-react';

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
            const response = await authService.login({
                email,
                password
            });

            const token = response.data?.token;

            if (!token) {
                throw new Error("Token missing from response");
            }

            // ✅ Store token in Redux
            dispatch(setToken(token));

            // ✅ Navigate
            navigate('/dashboard');
        } catch (err: any) {
            const message =
                err.response?.data?.message ||
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
                    <h2 className="text-3xl font-semibold text-primary">
                        Clear-Path
                    </h2>
                    <p className="mt-2 text-sm text-textSecondary">
                        Sign in to manage your milestones
                    </p>
                </div>

                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>

                    {error && (
                        <div className="bg-error/10 text-error text-sm p-3 rounded-lg text-center border border-error/20">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">

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

                <div className="text-center text-sm text-textSecondary">
                    Forgot password?
                </div>

            </div>
        </div>
    );
}