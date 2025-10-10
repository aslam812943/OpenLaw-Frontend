import { useState } from 'react';
import axios from 'axios';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useRouter } from 'next/router';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/user/forget-password', { email });
      alert('Password reset OTP sent! Please check your email.');
      router.push('/auth/reset-password');
    } catch (err) {
      console.log(err);
      alert('Failed to send password reset email.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-blue-600">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow max-w-md w-full">
        <h2 className="text-xl mb-4 text-center font-bold">Forgot Password</h2>
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your registered email"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
