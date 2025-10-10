import { useState } from 'react';
import axios from 'axios';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useRouter } from 'next/router';

const ResetPasswordPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/user/reset-password', form);
      alert('Password reset successful! Please login with your new password.');
      router.push('/auth/login');
    } catch (err) {
      console.error(err);
      alert('Password reset failed. Please check your OTP and try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-teal-600">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow max-w-md w-full">
        <h2 className="text-xl mb-4 text-center font-bold">Reset Password</h2>

        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Your registered email" required />

        <Input label="OTP" type="text" name="otp" value={form.otp} onChange={handleChange} placeholder="Enter OTP" required  />

        <Input label="New Password" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="New Password" required />

        <Button type="submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
