import { useState } from 'react';
import axios from 'axios';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useRouter } from 'next/router';

const RegisterPage = () => {
  const router  = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {

      localStorage.setItem("registerEmail", form.email);
      
      await axios.post('http://localhost:8080/api/user/register', form);
      alert('Registration successful! OTP sent to your email/phone.');
      router.push('/auth/verify-otp')
    } catch (err) {
      alert('Failed to register');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow max-w-md w-full">
        <h2 className="text-xl mb-4 text-center font-bold">Register</h2>
        <Input label="Name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your Name" />
        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
        <Input label="Phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="1234567890" />
        <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" />
        <Button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
