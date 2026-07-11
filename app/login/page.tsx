"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Step = "phone" | "otp" | "name";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Already logged in (checked via the shared auth context instead of a
  // separate getSession() call) - bounce to the homepage.
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  const checkingSession = authLoading || !!user;

  const isValidPhone = /^[6-9]\d{9}$/.test(phone);
  const formatted = isValidPhone ? `+91${phone}` : "";

  const phoneTouched = phone.length > 0;
  const phoneError =
    phoneTouched && phone.length === 10 && !isValidPhone
      ? "Mobile number must start with 6, 7, 8, or 9"
      : phoneTouched && phone.length < 10
        ? `Enter ${10 - phone.length} more digit${10 - phone.length > 1 ? "s" : ""}`
        : "";

  function normalizePhone(raw: string): string {
    return raw.replace(/\D/g, "").slice(0, 10);
  }

  function validatePhone(phone: string): string | null {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return "Enter a valid 10-digit mobile number starting with 6-9";
    }
    return null;
  }

  async function sendOtp() {
    setError("");
    const validationError = validatePhone(phone);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted });
    setLoading(false);
    if (error) return setError(error.message);
    setStep("otp");
  }

  async function verifyOtp() {
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formatted,
      token: otp,
      type: "sms",
    });

    if (error) {
      setLoading(false);
      return setError(error.message);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", data.user!.id)
      .single();

    setLoading(false);

    if (!profile?.name) {
      setStep("name"); // first login — no name yet
    } else {
      router.push("/"); // returning user — straight to homepage
    }
  }

  async function saveName() {
    setError("");
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", user!.id);
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/");
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#111827", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Login</h1>

        {step === "phone" && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Enter your mobile number
            </p>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden mb-3">
              <span className="px-3 bg-gray-50 border-r border-gray-300 text-sm text-gray-500 flex items-center">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit number"
                className="flex-1 px-3 py-2.5 text-sm outline-none text-black"
                value={phone}
                onChange={(e) => setPhone(normalizePhone(e.target.value))}
              />
            </div>
            {phoneError && (
              <p className="text-xs text-amber-600 mb-2">{phoneError}</p>
            )}
            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
            <button
              onClick={sendOtp}
              disabled={loading || phone.length !== 10}
              className="w-full bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-40"
            >
              {loading ? "Sending…" : "Send OTP"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Code sent to +91 {phone}
            </p>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit OTP"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-lg font-semibold tracking-widest text-center outline-none mb-3 focus:border-gray-900 text-black"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              autoFocus
            />
            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
            <button
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-40 mb-2"
            >
              {loading ? "Verifying…" : "Verify"}
            </button>
            <button
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
              }}
              className="text-xs text-gray-400 hover:text-gray-700"
            >
              ← Change number
            </button>
          </>
        )}

        {step === "name" && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              What should we call you?
            </p>
            <input
              type="text"
              placeholder="Your name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none mb-3 focus:border-gray-900 text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
            <button
              onClick={saveName}
              disabled={loading || name.trim().length === 0}
              className="w-full bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-40"
            >
              {loading ? "Saving…" : "Continue"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
