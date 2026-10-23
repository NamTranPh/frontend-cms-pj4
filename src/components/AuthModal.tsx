import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { authService } from '../services/authService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'LOGIN' | 'REGISTER' | 'VERIFY_OTP'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState('');

  // Xử lý đếm ngược 60 giây cho OTP
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const data = await authService.login({ email, password });
      localStorage.setItem('accessToken', data.accessToken);
      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await authService.register({ email, password, fullName });
      setStep('VERIFY_OTP');
      setCooldown(60); // Bắt đầu đếm ngược 60s
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await authService.verifyOtp(email, otp);
      alert('Xác nhận OTP thành công! Vui lòng đăng nhập.');
      setStep('LOGIN');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mã OTP không hợp lệ');
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    try {
      await authService.resendOtp(email);
      setCooldown(60);
    } catch (err: any) {
      setError('Không thể gửi lại OTP, vui lòng thử lại sau.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-6 text-white shadow-2xl backdrop-blur-md">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        {error && <div className="mb-4 rounded-lg bg-red-500/20 p-3 text-sm text-red-400 border border-red-500/30">{error}</div>}

        {step === 'LOGIN' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-400">Đăng Nhập</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg bg-slate-800 p-3 text-white border border-slate-700 focus:border-cyan-500 outline-none" />
            <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg bg-slate-800 p-3 text-white border border-slate-700 focus:border-cyan-500 outline-none" />
            <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold hover:opacity-90">Đăng Nhập</button>
            <p className="text-center text-sm text-gray-400">
              Chưa có tài khoản?{' '}
              <button type="button" onClick={() => setStep('REGISTER')} className="text-cyan-400 underline">Đăng ký ngay</button>
            </p>
          </form>
        )}

        {step === 'REGISTER' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-400">Đăng Ký Tài Khoản</h2>
            <input type="text" placeholder="Họ và tên" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full rounded-lg bg-slate-800 p-3 text-white border border-slate-700 focus:border-cyan-500 outline-none" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg bg-slate-800 p-3 text-white border border-slate-700 focus:border-cyan-500 outline-none" />
            <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg bg-slate-800 p-3 text-white border border-slate-700 focus:border-cyan-500 outline-none" />
            <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold hover:opacity-90">Tiếp Tục (Nhận OTP)</button>
            <p className="text-center text-sm text-gray-400">
              Đã có tài khoản?{' '}
              <button type="button" onClick={() => setStep('LOGIN')} className="text-cyan-400 underline">Đăng nhập</button>
            </p>
          </form>
        )}

        {step === 'VERIFY_OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-cyan-400">Xác Thực OTP</h2>
            <p className="text-sm text-gray-300">Mã OTP 6 số đã được gửi tới email <b>{email}</b></p>
            <input type="text" maxLength={6} placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full rounded-lg bg-slate-800 p-3 text-center text-2xl tracking-widest text-white border border-slate-700 focus:border-cyan-500 outline-none" />
            <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold hover:opacity-90">Xác Nhận OTP</button>
            <button type="button" onClick={handleResendOtp} disabled={cooldown > 0} className="text-sm text-cyan-400 disabled:text-gray-500">
              {cooldown > 0 ? `Gửi lại mã sau (${cooldown}s)` : 'Gửi lại mã OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};