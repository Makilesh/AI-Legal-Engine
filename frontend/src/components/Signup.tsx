import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupFormData } from '../types';
import { MessageSquare, Lock, Mail, User } from 'lucide-react';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/users');
      if (!response.ok) {
        throw new Error('Failed to check existing users');
      }
      
      const existingUsers = await response.json();
      if (existingUsers.some((u: any) => u.email === formData.email)) {
        setError('Email already exists');
        return;
      }

      const { confirmPassword, ...userData } = formData;
      const createResponse = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          id: crypto.randomUUID(),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.username}`,
        }),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create account');
      }

      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed top-4 left-4">
        <MessageSquare className="w-10 h-10 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join ChatBot today
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/50 p-4 animate-shake">
              <div className="text-sm text-red-700 dark:text-red-200">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="email" className="sr-only">Email address</label>
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <label htmlFor="username" className="sr-only">Username</label>
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="username"
                name="username"
                type="text"
                required
                className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Create account'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors duration-200"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};