"use client";
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/api';
import { Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      
      // Redirect based on user role
      if (user) {
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (user.role === 'coach') {
          router.push('/coach/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      } else {
        router.push('/dashboard');
      }
    }
  }, [router]);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    setAnimateIn(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    
    try {
      // Validate form
      if (!formData.email || !formData.password) {
        setError('Email and password are required');
        setLoading(false);
        return;
      }

      // Call login API
      const response = await authService.login(formData.email, formData.password);
      
      // Redirect based on user role
      const user = authService.getCurrentUser();
      if (user) {
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (user.role === 'coach') {
          router.push('/coach/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <div 
        className={`w-full max-w-md relative transition-all duration-700 ease-in-out ${
          animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Logo & Branding */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 flex items-center">
              <span className="mr-2">Fitoly</span>
              <User className="h-6 w-6 text-blue-400" />
            </div>
            </div>
          </Link>
        </div>
        
        {/* Main card */}
        <div className="backdrop-blur-md bg-gray-900/70 p-8 rounded-2xl shadow-2xl border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="mt-2 text-gray-400">Sign in to your Fitoly account</p>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-4 mx-auto"></div>
          </div>

          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-700/50 text-red-200 px-4 py-3 rounded-xl flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-800/70 border border-gray-700 rounded-xl shadow-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-800/70 border border-gray-700 rounded-xl shadow-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-gray-800 border-gray-700 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-blue-400 hover:text-blue-300">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-blue-700/30 hover:shadow-blue-600/40 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300">
                Register now
              </Link>
            </p>
          </div>
          
          {/* Decorative dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 opacity-30">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-blue-400"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}