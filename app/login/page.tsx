"use client";

import { useState } from "react";
import { AuthService } from "@/services/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const { error } = await AuthService.sendMagicLink(email);

    if (error) {
      setMessage(error);
    } else {
      setMessage("Check your email for login link");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div
        className="flex flex-col gap-4 max-w-sm w-full"
        style={{
          color: "var(--fg)",
          background: "var(--bg)",
          border: "1px solid var(--border)",
          padding: "2rem",
          borderRadius: "8px",
        }}
      >
        <label htmlFor="email">Login or Signup</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-[1px] px-4 py-2 text-black"
          style={{
            color: "var(--fg)",
            background: "var(--bg)",
            border: "1px solid var(--border)",
          }}
        />
        <p className="flex gap-3">
          <input type="checkbox" id="login" name="auth-option" defaultChecked className="w-4 h-4 accent-neutral-900"/>
          <span className="leading-tight">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </span>
        </p>

        <button
          onClick={handleLogin}
          className="mt-4 border px-4 py-2"
          style={{ background: "var(--accent)", color: "var(--bg)" }}
        >
          Login
        </button>
        <p className="mt-4">{message}</p>
      </div>
    </div>
  );
}
