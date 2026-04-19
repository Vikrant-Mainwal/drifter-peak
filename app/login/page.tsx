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
      setMessage("Check your email for login link 🚀");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-4 py-2"
      />

      <button onClick={handleLogin} className="mt-4 border px-4 py-2">
        Login
      </button>

      <p className="mt-4">{message}</p>
    </div>
  );
}