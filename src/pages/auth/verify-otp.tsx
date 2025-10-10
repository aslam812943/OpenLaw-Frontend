import { useState, useEffect } from 'react';
import axios from 'axios';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useRouter } from 'next/router';

const OtpVerifyPage = () => {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30); // 30 seconds timer
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const intervalId = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const email = localStorage.getItem('registerEmail') || '';
      await axios.post('http://localhost:8080/api/user/verify-otp', { email, otp });
      alert('OTP Verified! You are now verified.');
      router.push('/auth/login');
    } catch (err) {
      console.log(err);
      alert('OTP verification failed.');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const email = localStorage.getItem('registerEmail') || '';
      await axios.post('http://localhost:8080/api/user/resend-otp', { email });
      alert('OTP resent! Please check your email.');
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      console.log(err);
      alert('Failed to resend OTP. Please try again.');
    }
    setResendLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow max-w-md w-full">
        <h2 className="text-xl mb-4 text-center font-bold">OTP Verification</h2>
        <Input
          label="OTP"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          name={''}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <div className="mt-4 text-center">
          <button
            type="button"
            disabled={!canResend || resendLoading}
            onClick={handleResend}
            className={`text-sm font-semibold underline ${
              canResend && !resendLoading ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            {resendLoading
              ? 'Resending OTP...'
              : canResend
              ? 'Resend OTP'
              : `Resend available in ${timer}s`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtpVerifyPage;
