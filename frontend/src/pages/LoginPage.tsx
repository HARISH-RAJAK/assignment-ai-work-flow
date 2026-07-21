import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginPayload } from '../types/auth';
import { Cpu, Lock, Mail, Loader2, Sparkles } from 'lucide-react';
import { Toast } from '../components/Toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginPayload) => {
    setIsSubmitting(true);
    try {
      await login(data);
      navigate('/');
    } catch (err: any) {
      setErrorToast(err.response?.data?.message || 'Failed to authenticate. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden bg-[#fafafa]">
      {/* Ambient background blur elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-zinc-200/90 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl relative z-10 animate-modal-slide">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-4 animate-float shadow-xs">
            <Cpu className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-zinc-950 tracking-tight">Welcome Back</h2>
          <p className="text-zinc-500 text-xs mt-1.5 font-medium">Sign in to access your AI task processing dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-[11px] font-extrabold text-zinc-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
              <input
                type="email"
                placeholder="name@company.com"
                {...register('email')}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-indigo-600 transition-colors text-xs font-medium"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-zinc-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-indigo-600 transition-colors text-xs font-medium"
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50 mt-6 framer-button-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <span>Sign In</span>
                <Sparkles className="w-4 h-4 text-indigo-200" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-zinc-500 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline font-extrabold">
            Create account
          </Link>
        </div>
      </div>

      {errorToast && (
        <Toast
          type="error"
          message={errorToast}
          onClose={() => setErrorToast(null)}
        />
      )}
    </div>
  );
};
