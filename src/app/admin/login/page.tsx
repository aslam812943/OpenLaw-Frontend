'use client'


import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/alerts";
import { adminLogin } from "../../../service/authService";

type LoginType = {
  email: string;
  password: string;
};

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin123@gmail.com");
  const [password, setPassword] = useState("Admin@bct200");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Simple validation helper functions
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  // ✅ Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔹 1. Basic client-side validation
    if (!email || !password) {
      showToast("error", "Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      showToast("error", "Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      showToast("error", "Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      const data: LoginType = { email, password };

      const response = await adminLogin(data);

      // ✅ Successful login
      if (response && response.data) {
        showToast("success", "✅ Login successful!");
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      // ❌ Handle login failure
      showToast(
        "error",
        `❌ Login failed: ${err.response?.data?.message || err.message || "Invalid credentials"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <form
        noValidate
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          gap: "15px",
          border: "1px solid #ccc",
          padding: "30px",
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "10px", color: "#333" }}>Admin Login</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            backgroundColor: loading ? "#999" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
