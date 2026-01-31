'use client'


import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/alerts";
import { adminLogin } from "../../../service/adminService";

type LoginType = {
  email: string;
  password: string;
};

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin123@gmail.com");
  const [password, setPassword] = useState("Admin@bct200");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


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


      if (response && response.data) {
        showToast("success", "✅ Login successful!");
        router.replace("/admin/dashboard");

      }
    } catch (err: any) {

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
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0a0a0a", // Deep black background
        color: "#fff",
      }}
    >
      <form
        noValidate
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "350px",
          gap: "20px",
          border: "1px solid #333",
          padding: "40px",
          borderRadius: "16px",
          backgroundColor: "#111", // Dark form background
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: "0", color: "#fff" }}>Admin Portal</h2>
          <p style={{ color: "#888", fontSize: "14px", marginTop: "5px" }}>Please sign in to continue</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", textAlign: "left", gap: "5px" }}>
          <label style={{ fontSize: "12px", color: "#aaa", marginLeft: "2px" }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "#1a1a1a",
              color: "#fff",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#444")}
            onBlur={(e) => (e.target.style.borderColor = "#333")}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", textAlign: "left", gap: "5px" }}>
          <label style={{ fontSize: "12px", color: "#aaa", marginLeft: "2px" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "#1a1a1a",
              color: "#fff",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#444")}
            onBlur={(e) => (e.target.style.borderColor = "#333")}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "10px",
            padding: "12px",
            backgroundColor: loading ? "#333" : "#fff",
            color: loading ? "#666" : "#000",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
          }}
        >
          {loading ? "Verifying..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
