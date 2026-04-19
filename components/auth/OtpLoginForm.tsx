"use client";
import { useState, useRef } from "react";
import { Mail, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { AuthService } from "@/services/auth.service";

type Stage = "email" | "otp" | "success";

interface OtpLoginFormProps {
  onSuccess?: (email: string) => void;
  redirectTo?: string;
}

export function OtpLoginForm({ onSuccess }: OtpLoginFormProps) {
  const [stage, setStage]   = useState<Stage>("email");
  const [email, setEmail]   = useState("");
  const [otp, setOtp]       = useState(["","","","","",""]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [resend, setResend] = useState(0);
  const inputRefs           = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef            = useRef<ReturnType<typeof setInterval>>();

  const startCountdown = () => {
    setResend(30);
    timerRef.current = setInterval(() => {
      setResend(r => { if (r <= 1) { clearInterval(timerRef.current); return 0; } return r - 1; });
    }, 1000);
  };

  // ── Email submit ───────────────────────────────────────────
  const handleEmailSubmit = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address"); return;
    }
    setLoading(true); setError("");
    const { error: err } = await AuthService.sendOtp(trimmed);
    setLoading(false);
    if (err) { setError(err); return; }
    setStage("otp");
    startCountdown();
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  // ── OTP change ─────────────────────────────────────────────
  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next); setError("");
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
    if (val && i === 5 && next.every(d => d)) verifyOtp(next.join(""));
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split("")); verifyOtp(pasted); }
  };

  // ── OTP verify ─────────────────────────────────────────────
  const verifyOtp = async (code: string) => {
    setLoading(true); setError("");
    const { error: err } = await AuthService.verifyOtp(email.trim().toLowerCase(), code);
    setLoading(false);
    if (err) {
      setError("Invalid OTP. Try again.");
      setOtp(["","","","","",""]);
      inputRefs.current[0]?.focus();
      return;
    }
    setStage("success");
    onSuccess?.(email);
  };

  const handleResend = async () => {
    if (resend > 0) return;
    setLoading(true);
    await AuthService.sendOtp(email.trim().toLowerCase());
    setLoading(false);
    setOtp(["","","","","",""]);
    startCountdown();
    inputRefs.current[0]?.focus();
  };

  return (
    <Card padding="lg" className="w-full max-w-sm mx-auto">
      {/* Brand header */}
      <div className="text-center mb-10">
        <p className="font-display text-3xl tracking-[0.15em]" style={{ color: "var(--fg)" }}>
          DRIFTER<span style={{ color: "var(--accent)" }}>.</span>PEAK
        </p>
        <p className="font-mono text-[10px] tracking-[0.35em] mt-2" style={{ color: "var(--muted)" }}>
          {stage === "email"   ? "SIGN IN / SIGN UP"
         : stage === "otp"    ? "CHECK YOUR EMAIL"
         :                      "ALL GOOD"}
        </p>
      </div>

      {/* ── EMAIL STAGE ────────────────────────────────────── */}
      {stage === "email" && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Mail size={12} style={{ color: "var(--accent)" }} />
            <span className="font-mono text-[10px] tracking-[0.25em]" style={{ color: "var(--fg)" }}>
              ENTER YOUR EMAIL
            </span>
          </div>
          <Input
            label="EMAIL ADDRESS"
            type="email"
            placeholder="you@example.com"
            value={email}
            error={error}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleEmailSubmit()}
            autoFocus
            required
          />
          <Button fullWidth loading={loading} onClick={handleEmailSubmit} size="lg">
            Send OTP →
          </Button>
          <p className="text-center font-mono text-[9px] tracking-[0.15em] leading-relaxed"
            style={{ color: "var(--muted)" }}>
            No password needed. We email you a one-time code.
          </p>
        </div>
      )}

      {/* ── OTP STAGE ──────────────────────────────────────── */}
      {stage === "otp" && (
        <div className="space-y-5">
          <button onClick={() => { setStage("email"); setOtp(["","","","","",""]); setError(""); }}
            className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] hover:opacity-70 transition-opacity mb-4"
            style={{ color: "var(--muted)" }}>
            <ArrowLeft size={10} /> CHANGE EMAIL
          </button>

          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] mb-1" style={{ color: "var(--muted)" }}>OTP SENT TO</p>
            <p className="font-display text-xl" style={{ color: "var(--fg)" }}>{email}</p>
          </div>

          {/* 6-digit boxes */}
          <div className="flex gap-2" onPaste={handlePaste}>
            {otp.map((d, i) => (
              <input key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="text" inputMode="numeric" maxLength={1}
                value={d}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                className="flex-1 aspect-square text-center font-mono text-lg border outline-none transition-colors duration-150"
                style={{
                  background: "var(--bg)",
                  borderColor: error ? "var(--red)" : d ? "var(--fg)" : "var(--border)",
                  color: "var(--fg)",
                  maxWidth: "48px",
                }}
              />
            ))}
          </div>

          {error && (
            <p className="font-mono text-[10px] tracking-[0.2em]" style={{ color: "var(--red)" }}>{error}</p>
          )}

          <Button fullWidth loading={loading}
            disabled={otp.some(d => !d)}
            onClick={() => verifyOtp(otp.join(""))}
            variant="accent" size="lg">
            Verify OTP
          </Button>

          <div className="text-center">
            <button onClick={handleResend} disabled={resend > 0}
              className="font-mono text-[10px] tracking-[0.2em] transition-opacity disabled:opacity-40"
              style={{ color: "var(--fg)" }}>
              {resend > 0 ? `Resend in ${resend}s` : "Resend OTP"}
            </button>
          </div>
        </div>
      )}

      {/* ── SUCCESS STAGE ──────────────────────────────────── */}
      {stage === "success" && (
        <div className="text-center py-4 space-y-4">
          <div className="success-circle flex items-center justify-center w-16 h-16 rounded-full mx-auto"
            style={{ background: "rgba(232,255,0,0.1)", border: "2px solid var(--accent)" }}>
            <Shield size={24} style={{ color: "var(--accent)" }} />
          </div>
          <p className="font-display text-3xl uppercase" style={{ color: "var(--fg)" }}>Verified!</p>
          <p className="font-mono text-[10px] tracking-[0.2em]" style={{ color: "var(--muted)" }}>
            REDIRECTING...
          </p>
        </div>
      )}
    </Card>
  );
}