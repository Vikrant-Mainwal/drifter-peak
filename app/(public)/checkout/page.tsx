"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Lock, ChevronDown, ChevronUp,
  CheckCircle2, Copy, RefreshCw, CreditCard,
  Smartphone, Building2, Shield, Truck, Tag
} from "lucide-react";
import { useCart, CartItem } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────
type Step = "address" | "payment" | "success";
type PayMethod = "upi" | "card" | "netbanking";
type UpiApp = "gpay" | "phonepe" | "paytm" | "bhim" | "id";

interface AddressForm {
  fullName: string; phone: string; email: string;
  line1: string; line2: string; city: string;
  state: string; pincode: string;
}
interface CardForm {
  number: string; name: string; expiry: string; cvv: string;
}

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu & Kashmir","Ladakh","Chandigarh","Puducherry"
];

const UPI_APPS: { id: UpiApp; label: string; color: string; icon: string }[] = [
  { id: "gpay",    label: "Google Pay",  color: "#4285F4", icon: "G" },
  { id: "phonepe", label: "PhonePe",     color: "#5f259f", icon: "P" },
  { id: "paytm",   label: "Paytm",       color: "#00BAF2", icon: "T" },
  { id: "bhim",    label: "BHIM",        color: "#1a237e", icon: "B" },
  { id: "id",      label: "UPI ID",      color: "#555555", icon: "@" },
];

const BANKS = [
  "State Bank of India","HDFC Bank","ICICI Bank","Axis Bank",
  "Kotak Mahindra Bank","Punjab National Bank","Bank of Baroda","Canara Bank",
];

// ─── Helpers ────────────────────────────────────────────────
function formatCardNumber(v: string) {
  return v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
}
function formatExpiry(v: string) {
  const digits = v.replace(/\D/g,"").slice(0,4);
  return digits.length > 2 ? digits.slice(0,2)+"/"+digits.slice(2) : digits;
}
function maskCard(num: string) {
  const d = num.replace(/\s/g,"");
  if (d.length < 4) return "**** **** **** ****";
  const last4 = d.slice(-4);
  return `**** **** **** ${last4}`;
}
function detectNetwork(num: string): string {
  const d = num.replace(/\s/g,"");
  if (/^4/.test(d)) return "VISA";
  if (/^5[1-5]/.test(d)) return "MASTERCARD";
  if (/^6[0-9]/.test(d)) return "RUPAY";
  if (/^3[47]/.test(d)) return "AMEX";
  return "";
}

// ─── Sub-components ─────────────────────────────────────────

function Stepper({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "address", label: "ADDRESS" },
    { id: "payment", label: "PAYMENT" },
    { id: "success", label: "CONFIRM" },
  ];
  const idx = steps.findIndex(s => s.id === step);

  return (
    <div className="flex items-center gap-0 w-full max-w-xs mb-12">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center" style={{ flex: i < steps.length - 1 ? "1" : "0" }}>
          <div className="flex flex-col items-center gap-1.5">
            <div className={`stepper-dot ${i < idx ? "done" : i === idx ? "active" : "inactive"}`}>
              {i < idx ? <CheckCircle2 size={14} /> : <span>{i + 1}</span>}
            </div>
            <span className="font-mono text-[9px] tracking-[0.2em] whitespace-nowrap"
              style={{ color: i <= idx ? "var(--fg)" : "var(--muted)" }}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`stepper-line mx-2 ${i < idx ? "filled" : ""}`} style={{ marginBottom: "18px" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function OrderSummary({ total, shipping, items }: { total: number; shipping: number;items: CartItem[]; }) {
  const [open, setOpen] = useState(false);
  const grandTotal = total + shipping;

  return (
    <div className="border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
      {/* Toggle header (mobile) */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 md:hidden"
      >
        <span className="font-mono text-xs tracking-[0.2em]" style={{ color: "var(--accent)" }}>
          ORDER SUMMARY ({items.length} ITEMS)
        </span>
        {open ? <ChevronUp size={14} style={{ color: "var(--muted)" }} /> : <ChevronDown size={14} style={{ color: "var(--muted)" }} />}
      </button>

      <div className={`${open ? "block" : "hidden"} md:block`}>
        {/* Items */}
        <div className="px-6 py-4 space-y-4 border-b" style={{ borderColor: "var(--border)" }}>
          {items.map(item => (
            <div key={`${item.id}-${item.size}`} className="flex gap-4 items-center">
              <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden" style={{ background: "var(--bg)" }}>
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full font-mono text-[9px] flex items-center justify-center" style={{ background: "var(--fg)", color: "var(--bg)" }}>
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-base uppercase leading-tight truncate" style={{ color: "var(--fg)" }}>{item.name}</p>
                <p className="font-mono text-[10px] tracking-[0.2em]" style={{ color: "var(--muted)" }}>SIZE: {item.size}</p>
              </div>
              <span className="font-display text-base flex-shrink-0" style={{ color: "var(--fg)" }}>
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Coupon */}
        <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex gap-0">
            <div className="relative flex-1">
              <Tag size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
              <input type="text" placeholder="PROMO CODE" className="dp-input pl-9 text-xs" />
            </div>
            <button className="btn-press px-5 font-mono text-xs tracking-[0.2em] flex-shrink-0 border-l-0 border" style={{ borderColor: "var(--border)", color: "var(--fg)" }}>
              APPLY
            </button>
          </div>
        </div>

        {/* Totals */}
        <div className="px-6 py-5 space-y-3">
          <div className="flex justify-between font-mono text-xs tracking-wider">
            <span style={{ color: "var(--muted)" }}>SUBTOTAL</span>
            <span style={{ color: "var(--fg)" }}>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between font-mono text-xs tracking-wider">
            <span style={{ color: "var(--muted)" }}>SHIPPING</span>
            <span style={{ color: shipping === 0 ? "var(--accent)" : "var(--fg)" }}>
              {shipping === 0 ? "FREE" : formatPrice(shipping)}
            </span>
          </div>
          <div className="flex justify-between font-mono text-xs tracking-wider">
            <span style={{ color: "var(--muted)" }}>GST (18%)</span>
            <span style={{ color: "var(--fg)" }}>{formatPrice(Math.round(total * 0.18))}</span>
          </div>
          <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-xs tracking-wider" style={{ color: "var(--fg)" }}>TOTAL</span>
              <span className="font-display text-2xl" style={{ color: "var(--fg)" }}>
                {formatPrice(grandTotal + Math.round(total * 0.18))}
              </span>
            </div>
          </div>
        </div>

        {/* Trust */}
        <div className="px-6 py-4 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
          {[
            { icon: <Shield size={11} />, text: "256-bit SSL Secured" },
            { icon: <Truck size={11} />, text: "Delivery in 3–5 business days" },
          ].map(({ icon, text }) => (
            <div key={text} className="secure-badge">
              {icon}<span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Address Step ────────────────────────────────────────────
function AddressStep({ onNext }: { onNext: (d: AddressForm) => void }) {
  const [form, setForm] = useState<AddressForm>({
    fullName: "", phone: "", email: "",
    line1: "", line2: "", city: "", state: "", pincode: "",
  });
  const [errors, setErrors] = useState<Partial<AddressForm>>({});

  const set = (k: keyof AddressForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Partial<AddressForm> = {};
    if (!form.fullName.trim())            e.fullName = "Required";
    if (!/^\d{10}$/.test(form.phone))    e.phone    = "Valid 10-digit number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email";
    if (!form.line1.trim())               e.line1    = "Required";
    if (!form.city.trim())                e.city     = "Required";
    if (!form.state)                      e.state    = "Required";
    if (!/^\d{6}$/.test(form.pincode))   e.pincode  = "Valid 6-digit PIN";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) onNext(form); };

  const Field = ({ label, k, type = "text", placeholder = "" }: {
    label: string; k: keyof AddressForm; type?: string; placeholder?: string;
  }) => (
    <div>
      <label className="block font-mono text-[10px] tracking-[0.25em] mb-2" style={{ color: errors[k] ? "var(--red)" : "var(--muted)" }}>
        {label}{errors[k] ? ` — ${errors[k]}` : ""}
      </label>
      <input
        type={type}
        value={form[k]}
        onChange={set(k)}
        placeholder={placeholder}
        className={`dp-input${errors[k] ? " error" : ""}`}
      />
    </div>
  );

  return (
    <div className="panel-in">
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] mb-2" style={{ color: "var(--accent)" }}>STEP 01</p>
        <h2 className="font-display text-4xl md:text-5xl uppercase" style={{ color: "var(--fg)" }}>Delivery Address</h2>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="FULL NAME" k="fullName" placeholder="As on your ID" />
          <Field label="PHONE NUMBER" k="phone" type="tel" placeholder="10-digit mobile" />
        </div>
        <Field label="EMAIL ADDRESS" k="email" type="email" placeholder="For order updates" />
        <Field label="ADDRESS LINE 1" k="line1" placeholder="Flat / House No. / Street" />
        <Field label="ADDRESS LINE 2 (OPTIONAL)" k="line2" placeholder="Area / Locality / Colony" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="CITY" k="city" placeholder="City" />
          <div>
            <label className="block font-mono text-[10px] tracking-[0.25em] mb-2" style={{ color: errors.state ? "var(--red)" : "var(--muted)" }}>
              STATE{errors.state ? ` — ${errors.state}` : ""}
            </label>
            <select
              value={form.state}
              onChange={set("state")}
              className={`dp-input${errors.state ? " error" : ""}`}
              style={{ appearance: "none", cursor: "pointer" }}
            >
              <option value="">Select state</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Field label="PINCODE" k="pincode" placeholder="6-digit PIN" />
        </div>
      </div>

      <button onClick={handleSubmit} className="btn-press pay-btn-ripple w-full mt-10 py-5 font-display text-2xl tracking-[0.15em] uppercase" style={{ background: "var(--fg)", color: "var(--bg)" }}>
        CONTINUE TO PAYMENT →
      </button>
    </div>
  );
}

// ─── UPI Panel ───────────────────────────────────────────────
function UpiPanel({ amount, onPay }: { amount: number; onPay: () => void }) {
  const [activeApp, setActiveApp] = useState<UpiApp>("gpay");
  const [upiId, setUpiId]         = useState("");
  const [upiError, setUpiError]   = useState("");
  const [showQR, setShowQR]       = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified]   = useState(false);

  const verifyUpiId = () => {
    if (activeApp === "id") {
      if (!upiId.includes("@")) { setUpiError("Enter a valid UPI ID (e.g. name@upi)"); return; }
      setUpiError("");
    }
    setVerifying(true);
    setTimeout(() => { setVerifying(false); setVerified(true); }, 1500);
  };

  const handlePay = () => {
    if (!verified) { verifyUpiId(); return; }
    onPay();
  };

  // UPI QR SVG (mock)
  const qrData = `upi://pay?pa=drifterpeak@upi&pn=DrifterPeak&am=${amount}&cu=INR`;

  return (
    <div className="panel-in space-y-6">
      {/* App selector */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.25em] mb-4" style={{ color: "var(--muted)" }}>SELECT UPI APP</p>
        <div className="grid grid-cols-5 gap-3">
          {UPI_APPS.map(app => (
            <button
              key={app.id}
              onClick={() => { setActiveApp(app.id); setVerified(false); setUpiError(""); }}
              className={`upi-app-btn${activeApp === app.id ? " active" : ""}`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-lg"
                style={{ background: app.color, color: "#fff" }}>
                {app.icon}
              </div>
              <span className="font-mono text-[9px] tracking-[0.15em] text-center" style={{ color: "var(--muted)" }}>{app.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* UPI ID input */}
      {activeApp === "id" && (
        <div>
          <label className="block font-mono text-[10px] tracking-[0.25em] mb-2" style={{ color: upiError ? "var(--red)" : "var(--muted)" }}>
            UPI ID{upiError ? ` — ${upiError}` : ""}
          </label>
          <div className="flex">
            <input
              type="text"
              value={upiId}
              onChange={e => { setUpiId(e.target.value); setVerified(false); }}
              placeholder="yourname@upi"
              className={`dp-input flex-1${upiError ? " error" : ""}`}
            />
            <button
              onClick={verifyUpiId}
              disabled={verifying}
              className="btn-press px-5 font-mono text-xs tracking-[0.2em] border-l-0 border flex-shrink-0"
              style={{ borderColor: "var(--border)", color: verified ? "var(--accent)" : "var(--fg)" }}
            >
              {verifying ? <RefreshCw size={12} className="animate-spin" /> : verified ? "✓ VERIFIED" : "VERIFY"}
            </button>
          </div>
        </div>
      )}

      {/* App-specific flow */}
      {activeApp !== "id" && (
        <div className="border p-5" style={{ borderColor: "var(--border)", background: "rgba(232,255,0,0.02)" }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-lg flex-shrink-0"
              style={{ background: UPI_APPS.find(a=>a.id===activeApp)?.color, color: "#fff" }}>
              {UPI_APPS.find(a=>a.id===activeApp)?.icon}
            </div>
            <div>
              <p className="font-display text-lg uppercase mb-1" style={{ color: "var(--fg)" }}>
                Pay via {UPI_APPS.find(a=>a.id===activeApp)?.label}
              </p>
              <p className="font-mono text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
                Click below to open {UPI_APPS.find(a=>a.id===activeApp)?.label} and complete your payment of{" "}
                <span style={{ color: "var(--accent)" }}>{formatPrice(amount)}</span> to{" "}
                <span style={{ color: "var(--fg)" }}>DRIFTER PEAK</span>.
              </p>
              {!verified && (
                <button
                  onClick={() => { setVerifying(true); setTimeout(() => { setVerifying(false); setVerified(true); }, 1400); }}
                  className="btn-press mt-3 font-mono text-[10px] tracking-[0.2em] border px-4 py-2 flex items-center gap-2"
                  style={{ borderColor: "var(--border)", color: "var(--fg)" }}
                >
                  {verifying
                    ? <><RefreshCw size={10} className="animate-spin" /> OPENING APP...</>
                    : <><Smartphone size={10} /> OPEN {UPI_APPS.find(a=>a.id===activeApp)?.label.toUpperCase()}</>
                  }
                </button>
              )}
              {verified && (
                <div className="flex items-center gap-2 mt-3">
                  <CheckCircle2 size={13} style={{ color: "var(--accent)" }} />
                  <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: "var(--accent)" }}>PAYMENT AUTHORISED</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR toggle */}
      <button
        onClick={() => setShowQR(!showQR)}
        className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] hover:opacity-70 transition-opacity"
        style={{ color: "var(--muted)" }}
      >
        {showQR ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        {showQR ? "HIDE QR CODE" : "OR PAY WITH QR CODE"}
      </button>

      {showQR && (
        <div className="panel-in flex flex-col items-center gap-5 py-4">
          <p className="font-mono text-[10px] tracking-[0.25em]" style={{ color: "var(--muted)" }}>SCAN WITH ANY UPI APP</p>
          <div className="relative">
            <div className="qr-pulse" />
            <div className="qr-pulse qr-pulse-2" />
            {/* Mock QR code */}
            <div className="relative w-44 h-44 border-2 flex items-center justify-center" style={{ borderColor: "var(--fg)", background: "#fff" }}>
              <svg width="160" height="160" viewBox="0 0 21 21">
                {/* Simplified QR pattern */}
                <rect width="21" height="21" fill="white"/>
                {[
                  [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
                  [0,1],[6,1],[0,2],[2,2],[3,2],[4,2],[6,2],
                  [0,3],[2,3],[4,3],[6,3],[0,4],[2,4],[3,4],[4,4],[6,4],
                  [0,5],[6,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],
                  [8,0],[10,0],[12,0],[9,1],[11,1],[8,2],[10,2],[12,2],
                  [14,0],[15,0],[16,0],[17,0],[18,0],[19,0],[20,0],
                  [14,1],[20,1],[14,2],[16,2],[17,2],[18,2],[20,2],
                  [14,3],[16,3],[18,3],[20,3],[14,4],[16,4],[17,4],[18,4],[20,4],
                  [14,5],[20,5],[14,6],[15,6],[16,6],[17,6],[18,6],[19,6],[20,6],
                  [0,14],[1,14],[2,14],[3,14],[4,14],[5,14],[6,14],
                  [0,15],[6,15],[0,16],[2,16],[3,16],[4,16],[6,16],
                  [0,17],[2,17],[4,17],[6,17],[0,18],[2,18],[3,18],[4,18],[6,18],
                  [0,19],[6,19],[0,20],[1,20],[2,20],[3,20],[4,20],[5,20],[6,20],
                  [8,8],[9,8],[11,8],[13,8],[8,9],[10,9],[12,9],[8,10],[9,10],[11,10],
                  [8,11],[10,11],[12,11],[8,12],[9,12],[11,12],[13,12],
                  [9,14],[11,14],[13,14],[8,15],[10,15],[12,15],[8,16],[9,16],[11,16],
                  [10,18],[12,18],[9,19],[11,19],[13,19],[10,20],[12,20],
                ].map(([x,y],i) => (
                  <rect key={i} x={x} y={y} width={1} height={1} fill="black"/>
                ))}
                {/* Center logo */}
                <rect x="9" y="9" width="3" height="3" fill="#E8FF00" rx="0.3"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 flex items-center justify-center" style={{ background: "#E8FF00" }}>
                  <span className="font-display text-xs text-black">DP</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="font-display text-xl" style={{ color: "var(--fg)" }}>{formatPrice(amount)}</p>
            <p className="font-mono text-[10px] tracking-[0.2em] mt-1" style={{ color: "var(--muted)" }}>drifterpeak@upi</p>
          </div>
          <button
            onClick={() => { navigator.clipboard?.writeText("drifterpeak@upi"); }}
            className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] hover:opacity-70 transition-opacity"
            style={{ color: "var(--muted)" }}
          >
            <Copy size={10} /> COPY UPI ID
          </button>
          <button
            onClick={() => { setVerified(true); setShowQR(false); }}
            className="btn-press font-mono text-xs tracking-[0.2em] border px-6 py-2.5"
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
          >
            I'VE PAID
          </button>
        </div>
      )}

      <button
        onClick={handlePay}
        className="btn-press pay-btn-ripple w-full py-5 font-display text-2xl tracking-[0.15em] uppercase"
        style={{ background: "var(--accent)", color: "var(--bg)" }}
      >
        PAY {formatPrice(amount)}
      </button>
    </div>
  );
}

// ─── Card Panel ───────────────────────────────────────────────
function CardPanel({ amount, onPay }: { amount: number; onPay: () => void }) {
  const [form, setForm]   = useState<CardForm>({ number: "", name: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<Partial<CardForm>>({});
  const [showCvv, setShowCvv] = useState(false);
  const [flipped, setFlipped]  = useState(false);
  const network = detectNetwork(form.number);

  const set = (k: keyof CardForm, val: string) => setForm(f => ({ ...f, [k]: val }));

  const validate = () => {
    const e: Partial<CardForm> = {};
    const num = form.number.replace(/\s/g,"");
    if (num.length < 13) e.number = "Invalid card number";
    if (!form.name.trim()) e.name   = "Required";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = "MM/YY format";
    if (form.cvv.length < 3) e.cvv    = "Invalid CVV";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => { if (validate()) onPay(); };

  return (
    <div className="panel-in space-y-6">
      {/* Card visual */}
      <div className="card-display w-full aspect-[1.586/1] max-w-sm mx-auto p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="card-chip" />
          <span className="font-mono text-xs tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.5)" }}>
            {network || "CARD"}
          </span>
        </div>
        <div>
          <p className="card-number-display mb-4">
            {flipped ? "•••• •••• •••• ••••" : maskCard(form.number)}
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="font-mono text-[9px] tracking-[0.2em] mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>CARD HOLDER</p>
              <p className="font-body text-sm tracking-wider" style={{ color: "rgba(255,255,255,0.85)" }}>
                {form.name || "YOUR NAME"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[9px] tracking-[0.2em] mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>EXPIRES</p>
              <p className="font-mono text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
                {form.expiry || "MM/YY"}
              </p>
            </div>
          </div>
        </div>
        {/* Shimmer */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)" }} />
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        {/* Card number */}
        <div>
          <label className="block font-mono text-[10px] tracking-[0.25em] mb-2" style={{ color: errors.number ? "var(--red)" : "var(--muted)" }}>
            CARD NUMBER{errors.number ? ` — ${errors.number}` : ""}
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={form.number}
              onChange={e => set("number", formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              className={`dp-input input-card-num${errors.number ? " error" : ""}`}
              maxLength={19}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {network && (
                <span className="font-mono text-[10px] tracking-wider px-2 py-0.5 border" style={{ borderColor: "var(--border)", color: "var(--fg)" }}>{network}</span>
              )}
              <CreditCard size={16} style={{ color: "var(--muted)" }} />
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block font-mono text-[10px] tracking-[0.25em] mb-2" style={{ color: errors.name ? "var(--red)" : "var(--muted)" }}>
            NAME ON CARD{errors.name ? ` — ${errors.name}` : ""}
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => set("name", e.target.value.toUpperCase())}
            placeholder="AS PRINTED ON CARD"
            className={`dp-input${errors.name ? " error" : ""}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Expiry */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.25em] mb-2" style={{ color: errors.expiry ? "var(--red)" : "var(--muted)" }}>
              EXPIRY{errors.expiry ? ` — ${errors.expiry}` : ""}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={form.expiry}
              onChange={e => set("expiry", formatExpiry(e.target.value))}
              placeholder="MM / YY"
              className={`dp-input font-mono${errors.expiry ? " error" : ""}`}
              maxLength={5}
            />
          </div>

          {/* CVV */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.25em] mb-2" style={{ color: errors.cvv ? "var(--red)" : "var(--muted)" }}>
              CVV{errors.cvv ? ` — ${errors.cvv}` : ""}
            </label>
            <div className="relative">
              <input
                type={showCvv ? "text" : "password"}
                inputMode="numeric"
                value={form.cvv}
                onChange={e => set("cvv", e.target.value.replace(/\D/g,"").slice(0,4))}
                onFocus={() => setFlipped(true)}
                onBlur={() => setFlipped(false)}
                placeholder="• • •"
                className={`dp-input font-mono${errors.cvv ? " error" : ""}`}
                maxLength={4}
              />
              <button
                type="button"
                onClick={() => setShowCvv(!showCvv)}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[9px] tracking-wider hover:opacity-70 transition-opacity"
                style={{ color: "var(--muted)" }}
              >
                {showCvv ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>
        </div>

        {/* Save card */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all" style={{ borderColor: "var(--border)" }}>
            <div className="w-2 h-2" style={{ background: "transparent" }} />
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: "var(--muted)" }}>
            SAVE CARD FOR FASTER CHECKOUT
          </span>
        </label>
      </div>

      <button
        onClick={handlePay}
        className="btn-press pay-btn-ripple w-full py-5 font-display text-2xl tracking-[0.15em] uppercase"
        style={{ background: "var(--fg)", color: "var(--bg)" }}
      >
        PAY {formatPrice(amount)} SECURELY
      </button>

      <div className="flex items-center justify-center gap-2">
        <Lock size={10} style={{ color: "var(--muted)" }} />
        <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: "var(--muted)" }}>
          SECURED BY 256-BIT SSL ENCRYPTION
        </span>
      </div>
    </div>
  );
}

// ─── Net Banking Panel ────────────────────────────────────────
function NetBankingPanel({ amount, onPay }: { amount: number; onPay: () => void }) {
  const [selectedBank, setSelectedBank] = useState("");
  const [error, setError]               = useState(false);

  const handlePay = () => {
    if (!selectedBank) { setError(true); return; }
    onPay();
  };

  return (
    <div className="panel-in space-y-6">
      <div>
        <p className="font-mono text-[10px] tracking-[0.25em] mb-4" style={{ color: error ? "var(--red)" : "var(--muted)" }}>
          {error ? "PLEASE SELECT A BANK" : "SELECT YOUR BANK"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BANKS.map(bank => (
            <button
              key={bank}
              onClick={() => { setSelectedBank(bank); setError(false); }}
              className={`pay-tab flex items-center gap-3 px-4 py-3 text-left${selectedBank === bank ? " active" : ""}`}
            >
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center border" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
                <Building2 size={13} style={{ color: "var(--muted)" }} />
              </div>
              <span className="font-body text-sm" style={{ color: "var(--fg)" }}>{bank}</span>
              {selectedBank === bank && <CheckCircle2 size={13} className="ml-auto flex-shrink-0" style={{ color: "var(--accent)" }} />}
            </button>
          ))}
        </div>
      </div>

      {selectedBank && (
        <div className="panel-in border p-4 flex items-start gap-3" style={{ borderColor: "var(--border)", background: "rgba(232,255,0,0.02)" }}>
          <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
          <p className="font-mono text-[10px] leading-relaxed tracking-[0.15em]" style={{ color: "var(--muted)" }}>
            You will be redirected to <span style={{ color: "var(--fg)" }}>{selectedBank}</span>'s secure portal to complete your payment of{" "}
            <span style={{ color: "var(--accent)" }}>{formatPrice(amount)}</span>.
          </p>
        </div>
      )}

      <button
        onClick={handlePay}
        className="btn-press pay-btn-ripple w-full py-5 font-display text-2xl tracking-[0.15em] uppercase"
        style={{ background: selectedBank ? "var(--fg)" : "var(--border)", color: selectedBank ? "var(--bg)" : "var(--muted)" }}
      >
        {selectedBank ? `PAY VIA ${selectedBank.split(" ")[0].toUpperCase()}` : "SELECT A BANK"}
      </button>
    </div>
  );
}

// ─── Payment Step ─────────────────────────────────────────────
function PaymentStep({ address, amount, onSuccess }: { address: AddressForm; amount: number; onSuccess: () => void }) {
  const [method, setMethod] = useState<PayMethod>("upi");
  const [processing, setProcessing] = useState(false);

  const tabs: { id: PayMethod; label: string; icon: React.ReactNode }[] = [
    { id: "upi",        label: "UPI",         icon: <Smartphone size={14} /> },
    { id: "card",       label: "CARD",        icon: <CreditCard size={14} /> },
    { id: "netbanking", label: "NET BANKING", icon: <Building2 size={14} /> },
  ];

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); onSuccess(); }, 2200);
  };

  if (processing) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 rounded-full animate-spin" style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }} />
        </div>
        <div className="text-center">
          <p className="font-display text-2xl uppercase mb-2" style={{ color: "var(--fg)" }}>Processing Payment</p>
          <p className="font-mono text-xs tracking-[0.25em]" style={{ color: "var(--muted)" }}>DO NOT CLOSE OR REFRESH</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-in">
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] mb-2" style={{ color: "var(--accent)" }}>STEP 02</p>
        <h2 className="font-display text-4xl md:text-5xl uppercase" style={{ color: "var(--fg)" }}>Payment</h2>
      </div>

      {/* Delivery address recap */}
      <div className="border p-5 mb-8 flex items-start gap-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <Truck size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] mb-1" style={{ color: "var(--muted)" }}>DELIVERING TO</p>
          <p className="font-body text-base" style={{ color: "var(--fg)" }}>
            {address.fullName} — {address.line1}, {address.city}, {address.state} {address.pincode}
          </p>
        </div>
      </div>

      {/* Method tabs */}
      <div className="flex gap-0 mb-8 border" style={{ borderColor: "var(--border)" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setMethod(tab.id)}
            className={`pay-tab flex-1 flex items-center justify-center gap-2 py-3 border-0${method === tab.id ? " active" : ""}`}
            style={{ borderRight: tab.id !== "netbanking" ? `1px solid var(--border)` : "none" }}
          >
            {tab.icon}
            <span className="font-mono text-[10px] tracking-[0.2em] hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Panels */}
      {method === "upi"        && <UpiPanel        amount={amount} onPay={handlePay} />}
      {method === "card"       && <CardPanel       amount={amount} onPay={handlePay} />}
      {method === "netbanking" && <NetBankingPanel amount={amount} onPay={handlePay} />}
    </div>
  );
}

// ─── Success Step ─────────────────────────────────────────────
function SuccessStep({ address }: { address: AddressForm }) {
  const orderId = `DP-${Date.now().toString(36).toUpperCase()}`;
  const eta     = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "long" });

  return (
    <div className="panel-in text-center py-8">
      {/* Check animation */}
      <div className="success-circle flex items-center justify-center w-24 h-24 rounded-full mx-auto mb-8" style={{ background: "rgba(232,255,0,0.1)", border: "2px solid var(--accent)" }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M12 24l9 9 15-18" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            className="success-check" />
        </svg>
      </div>

      <p className="font-mono text-xs tracking-[0.4em] mb-3" style={{ color: "var(--accent)" }}>ORDER CONFIRMED</p>
      <h2 className="font-display text-[clamp(40px,8vw,80px)] leading-none tracking-tight uppercase mb-4" style={{ color: "var(--fg)" }}>
        YOU'RE PEAKED.
      </h2>
      <p className="font-body text-lg max-w-sm mx-auto mb-10" style={{ color: "var(--muted)" }}>
        Your order is confirmed and being prepared. We'll send tracking updates to{" "}
        <span style={{ color: "var(--fg)" }}>{address.email}</span>.
      </p>

      {/* Order details */}
      <div className="border max-w-sm mx-auto text-left mb-10" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        {[
          { label: "ORDER ID",   value: orderId },
          { label: "DELIVERING TO", value: `${address.fullName}, ${address.city}` },
          { label: "ETA",        value: `By ${eta}` },
          { label: "STATUS",     value: "CONFIRMED ✓" },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center px-5 py-3 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
            <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: "var(--muted)" }}>{label}</span>
            <span className="font-body text-sm" style={{ color: "var(--fg)" }}>{value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/shop" className="btn-press inline-block px-10 py-4 font-display text-xl tracking-[0.15em] uppercase" style={{ background: "var(--accent)", color: "var(--bg)" }}>
          KEEP SHOPPING
        </Link>
        <Link href="/" className="btn-press inline-block px-10 py-4 font-display text-xl tracking-[0.15em] uppercase border" style={{ borderColor: "var(--border)", color: "var(--fg)" }}>
          GO HOME
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function CheckoutPage() {
 const items = useCart((s) => s.items);
 console.log("CART ITEMS:", items);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = total >= 2000 ? 0 : 199;
  const gst      = Math.round(total * 0.18);
  const grandTotal = total + shipping + gst;

  const [step, setStep]       = useState<Step>("address");
  const [address, setAddress] = useState<AddressForm | null>(null);

  // Redirect to cart if empty
  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6" style={{ background: "var(--bg)" }}>
        <p className="font-display text-5xl uppercase" style={{ color: "var(--muted)" }}>Your cart is empty.</p>
        <Link href="/shop" className="btn-press font-display text-xl tracking-widest uppercase px-10 py-4" style={{ background: "var(--fg)", color: "var(--bg)" }}>
          EXPLORE DROP
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-20 pb-20 px-6 md:px-12" style={{ background: "var(--bg)" }}>
        <div className="max-w-6xl mx-auto">
          {/* Top bar */}
          <div className="anim-fade-up flex items-center justify-between py-8 mb-2 border-b" style={{ borderColor: "var(--border)" }}>
            <Link href="/cart" className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] hover:opacity-70 transition-opacity" style={{ color: "var(--muted)" }}>
              <ArrowLeft size={12} /> BACK TO CART
            </Link>
            <div className="font-display text-xl tracking-[0.15em]" style={{ color: "var(--fg)" }}>
              DRIFTER<span style={{ color: "var(--accent)" }}>.</span>PEAK
            </div>
            <div className="secure-badge">
              <Lock size={10} />
              <span>SECURE CHECKOUT</span>
            </div>
          </div>

          {/* Stepper */}
          <div className="anim-fade-up delay-100 flex justify-center py-8">
            <Stepper step={step} />
          </div>

          {/* Main layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">
            {/* Left — form area */}
            <div className="anim-fade-up delay-200">
              {step === "address" && (
                <AddressStep onNext={(d) => { setAddress(d); setStep("payment"); }} />
              )}
              {step === "payment" && address && (
                <PaymentStep address={address} amount={grandTotal} onSuccess={() => setStep("success")} />
              )}
              {step === "success" && address && (
                <SuccessStep address={address} />
              )}
            </div>

            {/* Right — order summary (hidden on success) */}
            {step !== "success" && (
              <div className="anim-fade-up delay-300 lg:sticky lg:top-24">
                <OrderSummary total={total} shipping={shipping} items={items} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
