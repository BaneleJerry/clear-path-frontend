import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../features/auth/authService';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Calling the service we mapped to your api-schema.d.ts
            await authService.registerIndividual(formData);

            // On success, redirect to login with a success message (optional state)
            navigate('/login', { state: { message: 'Account created! Please sign in.' } });
        } catch (err: any) {
            const message = err.response?.data?.message || 'Registration failed. Please check your details.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-blue-600">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-600">Start tracking your milestones with Clear-Path</p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                            <input
                                name="firstName"
                                type="text"
                                required
                                className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                            <input
                                name="lastName"
                                type="text"
                                required
                                className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        <input
                            name="email"
                            type="email"
                            required
                            className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        <input
                            name="password"
                            type="password"
                            required
                            className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors shadow-md"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                            <>
                                Create Account <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}