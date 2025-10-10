import { useState } from 'react';
import axios from 'axios';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/user/login', form);
      alert('Login successful! OTP sent.');
      router.push('/');
    } catch (err) {
      console.log(err);
      alert('Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow max-w-md w-full">
        <h2 className="text-xl mb-4 text-center font-bold">Login</h2>
        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
        <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" />
        <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>

        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-blue-600 underline hover:text-blue-800"
            onClick={() => router.push('/auth/forgot-password')}
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
