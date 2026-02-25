"use client"
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import _ from "lodash";

// ─── CONSTANTS & CONFIG ─────────────────────────────────────────────
const STATUS_CONFIG = {
  HOT: { label: "Hot", color: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", desc: "Tendering stage" },
  ACTIVE: { label: "Active", color: "#22C55E", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)", desc: "POC going, tender submitted, active engagement" },
  ORANGE: { label: "Orange", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", desc: "Customer has requirement, need a strategy" },
  CLOSED_WON: { label: "Closed Won", color: "#3B82F6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)", desc: "PO received" },
  LOST: { label: "Lost", color: "#6B7280", bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.3)", desc: "Lost to Competition" },
  COLD: { label: "Cold", color: "#8B5CF6", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.3)", desc: "On hold, in Abeyance" },
};

const FUTURE_POTENTIAL_OPTIONS = ["WIP", "High", "Medium", "Low", "None"];
const REVIEW_STATUS_OPTIONS = ["Wesee", "Under Follow up", "Under Review", "Proposal Sent", "Negotiation", "Closed", "On Hold"];

const INITIAL_TEAMS = [
  { id: "team-1", name: "Team Alpha", members: ["shruti@terafence.in", "yash@terafence.in"] },
];

const ADMIN_EMAILS = [
  "yash@terafence.in", "dinesh@terafence.in", "akshat@terafence.in",
  "jose@terafence.in", "chandra@terafence.in", "amandeep@terafence.in",
];

const INITIAL_USERS = [
  { email: "yash@terafence.in", name: "Yash Sejwal", role: "admin", avatar: "YS" },
  { email: "dinesh@terafence.in", name: "Dinesh", role: "admin", avatar: "DI" },
  { email: "akshat@terafence.in", name: "Akshat", role: "admin", avatar: "AK" },
  { email: "jose@terafence.in", name: "Jose", role: "admin", avatar: "JO" },
  { email: "chandra@terafence.in", name: "Chandra", role: "admin", avatar: "CH" },
  { email: "amandeep@terafence.in", name: "Amandeep", role: "admin", avatar: "AM" },
  { email: "shruti@terafence.in", name: "Shruti Gaur", role: "member", avatar: "SG" },
];

const INITIAL_OPPORTUNITIES = [
  {
    id: "opp-1", sNo: 1, name: "TFG 1U-RP/U2U", endCustomer: "WESEE", partnerName: "-",
    status: "ACTIVE", owner: "yash@terafence.in", openDate: "2025-10-22",
    lastFollowUp: "2026-02-12", currentlyUnderReview: "Wesee", futurePotential: "WIP",
    noOfDevices: "", stageUpdate: "POC in progress", nextSteps: "",
    reviews: [{ date: "2025-05-12", notes: "" }], attachments: [], createdBy: "yash@terafence.in",
  },
  {
    id: "opp-2", sNo: 2, name: "-", endCustomer: "Prince Devraj(L&T)", partnerName: "-",
    status: "COLD", owner: "shruti.gaur@terafence.in", openDate: "2026-01-22",
    lastFollowUp: "2026-02-12", currentlyUnderReview: "Under Follow up", futurePotential: "WIP",
    noOfDevices: "", stageUpdate: "", nextSteps: "",
    reviews: [], attachments: [], createdBy: "shruti.gaur@terafence.in",
  },
  {
    id: "opp-3", sNo: 3, name: "-", endCustomer: "Sunil Singh(L&T)", partnerName: "-",
    status: "COLD", owner: "shruti.gaur@terafence.in", openDate: "2026-01-15",
    lastFollowUp: "2026-01-23", currentlyUnderReview: "Under Follow up", futurePotential: "WIP",
    noOfDevices: "", stageUpdate: "", nextSteps: "",
    reviews: [], attachments: [], createdBy: "shruti.gaur@terafence.in",
  },
  {
    id: "opp-4", sNo: 4, name: "Initial Discussion", endCustomer: "Anand Dutta(Tech Mahindra)", partnerName: "-",
    status: "COLD", owner: "shruti.gaur@terafence.in", openDate: "2026-02-17",
    lastFollowUp: "", currentlyUnderReview: "", futurePotential: "",
    noOfDevices: "", stageUpdate: "", nextSteps: "",
    reviews: [], attachments: [], createdBy: "shruti.gaur@terafence.in",
  },
];

// ─── UTILITY FUNCTIONS ──────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ─── ICONS (inline SVG components) ──────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d={d} />
  </svg>
);

const Icons = {
  Pipeline: (p) => <Icon d="M3 3v18h18M9 17V9m4 8V5m4 12v-4" {...p} />,
  Dashboard: (p) => <Icon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" {...p} />,
  Users: (p) => <Icon d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" {...p} />,
  Team: (p) => <Icon d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 11a4 4 0 100-8 4 4 0 000 8z" {...p} />,
  Report: (p) => <Icon d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" {...p} />,
  Settings: (p) => <Icon d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" {...p} />,
  Plus: (p) => <Icon d="M12 5v14M5 12h14" {...p} />,
  Search: (p) => <Icon d="M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5zM21 21l-4.35-4.35" {...p} />,
  Filter: (p) => <Icon d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" {...p} />,
  Edit: (p) => <Icon d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" {...p} />,
  Trash: (p) => <Icon d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" {...p} />,
  Eye: (p) => <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 100-6 3 3 0 000 6z" {...p} />,
  X: (p) => <Icon d="M18 6L6 18M6 6l12 12" {...p} />,
  Check: (p) => <Icon d="M20 6L9 17l-5-5" {...p} />,
  ChevDown: (p) => <Icon d="M6 9l6 6 6-6" {...p} />,
  Logout: (p) => <Icon d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" {...p} />,
  Upload: (p) => <Icon d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" {...p} />,
  Download: (p) => <Icon d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" {...p} />,
  Calendar: (p) => <Icon d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18" {...p} />,
  Paperclip: (p) => <Icon d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" {...p} />,
  BarChart: (p) => <Icon d="M12 20V10M18 20V4M6 20v-4" {...p} />,
  TrendUp: (p) => <Icon d="M23 6l-9.5 9.5-5-5L1 18M17 6h6v6" {...p} />,
  Mail: (p) => <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" {...p} />,
  Shield: (p) => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...p} />,
  Lock: (p) => <Icon d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4" {...p} />,
  Copy: (p) => <Icon d="M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" {...p} />,
  Refresh: (p) => <Icon d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" {...p} />,
};

// ─── CSS ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg-primary: #0A0C10;
      --bg-secondary: #12151C;
      --bg-tertiary: #1A1E28;
      --bg-card: #151820;
      --bg-hover: #1E2330;
      --bg-input: #1A1E28;
      --border-primary: #242938;
      --border-secondary: #2A3040;
      --border-focus: #4F7BF7;
      --text-primary: #E8ECF4;
      --text-secondary: #8B95A8;
      --text-muted: #5A6478;
      --accent-primary: #4F7BF7;
      --accent-secondary: #6C8FF8;
      --accent-glow: rgba(79,123,247,0.15);
      --danger: #EF4444;
      --success: #22C55E;
      --warning: #F59E0B;
      --radius: 10px;
      --radius-lg: 14px;
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
      --shadow-md: 0 4px 16px rgba(0,0,0,0.4);
      --shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
      --shadow-glow: 0 0 30px rgba(79,123,247,0.08);
      --transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
    }

    body { font-family: 'DM Sans', sans-serif; background: var(--bg-primary); color: var(--text-primary); }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-secondary); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

    input, textarea, select {
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      background: var(--bg-input);
      border: 1px solid var(--border-primary);
      color: var(--text-primary);
      border-radius: var(--radius);
      padding: 9px 12px;
      outline: none;
      transition: var(--transition);
      width: 100%;
    }
    input:focus, textarea:focus, select:focus {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }
    input::placeholder, textarea::placeholder { color: var(--text-muted); }

    select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235A6478' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 30px; }
    select option { background: var(--bg-secondary); color: var(--text-primary); }

    button { font-family: 'DM Sans', sans-serif; cursor: pointer; border: none; outline: none; transition: var(--transition); }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    .animate-in { animation: fadeIn 0.3s ease-out forwards; }
    .slide-in { animation: slideIn 0.3s ease-out forwards; }
    .scale-in { animation: scaleIn 0.2s ease-out forwards; }
  `}</style>
);

// ─── SMALL COMPONENTS ───────────────────────────────────────────────
const Badge = ({ status }) => {
  const config = STATUS_CONFIG[status];
  if (!config) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: 20,
      background: config.bg, border: `1px solid ${config.border}`,
      fontSize: 11, fontWeight: 600, color: config.color, letterSpacing: 0.3,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: config.color }} />
      {config.label}
    </span>
  );
};

const StatCard = ({ icon, label, value, sub, accent = false, trend }) => (
  <div style={{
    background: accent ? "linear-gradient(135deg, #1a2744 0%, #162040 100%)" : "var(--bg-card)",
    border: `1px solid ${accent ? "rgba(79,123,247,0.25)" : "var(--border-primary)"}`,
    borderRadius: "var(--radius-lg)", padding: "20px 22px",
    display: "flex", flexDirection: "column", gap: 10,
    boxShadow: accent ? "var(--shadow-glow)" : "var(--shadow-sm)",
    transition: "var(--transition)", position: "relative", overflow: "hidden",
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = accent ? "var(--shadow-glow)" : "var(--shadow-sm)"; }}
  >
    {accent && <div style={{ position: "absolute", top: -30, right: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(79,123,247,0.06)" }} />}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: accent ? "var(--accent-primary)" : "var(--text-muted)" }}>{icon}</span>
        <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</span>
      </div>
      {trend && (
        <span style={{ fontSize: 11, fontWeight: 600, color: trend > 0 ? "var(--success)" : "var(--danger)", display: "flex", alignItems: "center", gap: 2 }}>
          {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5, color: accent ? "#fff" : "var(--text-primary)" }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{sub}</div>}
  </div>
);

const Btn = ({ children, variant = "primary", size = "md", icon, onClick, disabled, style: extraStyle = {}, ...rest }) => {
  const styles = {
    primary: { background: "var(--accent-primary)", color: "#fff", border: "none", fontWeight: 600 },
    secondary: { background: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px solid var(--border-primary)", fontWeight: 500 },
    ghost: { background: "transparent", color: "var(--text-secondary)", border: "none", fontWeight: 500 },
    danger: { background: "rgba(239,68,68,0.1)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.2)", fontWeight: 500 },
  };
  const sizes = {
    sm: { padding: "6px 12px", fontSize: 12, borderRadius: 8 },
    md: { padding: "9px 16px", fontSize: 13, borderRadius: "var(--radius)" },
    lg: { padding: "12px 22px", fontSize: 14, borderRadius: "var(--radius-lg)" },
  };
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{
        ...styles[variant], ...sizes[size],
        display: "inline-flex", alignItems: "center", gap: 7,
        opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer",
        transition: "var(--transition)", letterSpacing: 0.2,
        ...extraStyle,
      }}
      onMouseEnter={e => { if (!disabled && variant === "primary") e.currentTarget.style.background = "var(--accent-secondary)"; }}
      onMouseLeave={e => { if (!disabled && variant === "primary") e.currentTarget.style.background = "var(--accent-primary)"; }}
      {...rest}
    >
      {icon && <span style={{ display: "flex" }}>{icon}</span>}
      {children}
    </button>
  );
};

const Modal = ({ open, onClose, title, children, width = 600 }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
    }} onClick={onClose}>
      <div className="scale-in" style={{
        background: "var(--bg-secondary)", border: "1px solid var(--border-primary)",
        borderRadius: "var(--radius-lg)", width: "95%", maxWidth: width,
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        boxShadow: "var(--shadow-lg)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 24px", borderBottom: "1px solid var(--border-primary)",
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.2 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "var(--bg-tertiary)", borderRadius: 8, padding: 6, display: "flex", color: "var(--text-secondary)" }}>
            <Icons.X size={16} />
          </button>
        </div>
        <div style={{ padding: "20px 24px", overflow: "auto", flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};

const Field = ({ label, children, required }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", letterSpacing: 0.3 }}>
      {label} {required && <span style={{ color: "var(--danger)" }}>*</span>}
    </label>
    {children}
  </div>
);

const EmptyState = ({ icon, title, desc }) => (
  <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
    <div style={{ marginBottom: 12, opacity: 0.5 }}>{icon}</div>
    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 13 }}>{desc}</div>
  </div>
);

const TabBar = ({ tabs, active, onChange }) => (
  <div style={{ display: "flex", gap: 2, background: "var(--bg-tertiary)", borderRadius: 10, padding: 3, border: "1px solid var(--border-primary)" }}>
    {tabs.map(t => (
      <button key={t.key} onClick={() => onChange(t.key)} style={{
        padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
        background: active === t.key ? "var(--accent-primary)" : "transparent",
        color: active === t.key ? "#fff" : "var(--text-secondary)",
        transition: "var(--transition)", letterSpacing: 0.2,
      }}>
        {t.label}
      </button>
    ))}
  </div>
);

// ─── LOGIN SCREEN ───────────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // email | otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestOtp = () => {
    if (!email.endsWith("@terafence.in")) {
      setError("Only @terafence.in email addresses are allowed");
      return;
    }
    setLoading(true);
    setError("");
    // Simulate OTP request (in production, calls the actual API)
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 1200);
  };

  const verifyOtp = () => {
    if (otp.length !== 6) { setError("Enter a valid 6-digit OTP"); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      const isAdmin = ADMIN_EMAILS.includes(email);
      const user = INITIAL_USERS.find(u => u.email === email) || {
        email, name: email.split("@")[0], role: isAdmin ? "admin" : "member",
        avatar: email.slice(0, 2).toUpperCase(),
      };
      onLogin({ ...user, role: isAdmin ? "admin" : "member" });
    }, 1000);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,123,247,0.08) 0%, var(--bg-primary) 70%)",
      padding: 20,
    }}>
      <div className="animate-in" style={{
        width: "100%", maxWidth: 420, background: "var(--bg-secondary)",
        border: "1px solid var(--border-primary)", borderRadius: 18,
        padding: "44px 36px", boxShadow: "var(--shadow-lg)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "linear-gradient(135deg, var(--accent-primary), #7C3AED)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", boxShadow: "0 4px 20px rgba(79,123,247,0.25)",
          }}>
            <Icons.Shield size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, marginBottom: 6 }}>Terafence Pipeline</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Sales Intelligence & Pipeline Management</p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 20,
            fontSize: 12, color: "var(--danger)", fontWeight: 500,
          }}>{error}</div>
        )}

        {step === "email" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Work Email" required>
              <input
                type="email" placeholder="name@terafence.in" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && requestOtp()}
                style={{ padding: "12px 14px", fontSize: 14 }}
              />
            </Field>
            <Btn size="lg" onClick={requestOtp} disabled={loading || !email}
              style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
              icon={loading ? <span style={{ animation: "pulse 1s infinite" }}>●</span> : <Icons.Mail size={16} />}
            >
              {loading ? "Sending OTP..." : "Send Verification Code"}
            </Btn>
            <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
              Only <strong style={{ color: "var(--text-secondary)" }}>@terafence.in</strong> domains are authorized
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Code sent to <strong>{email}</strong></p>
            </div>
            <Field label="Verification Code" required>
              <input
                type="text" placeholder="000000" value={otp} maxLength={6}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                onKeyDown={e => e.key === "Enter" && verifyOtp()}
                style={{ padding: "12px 14px", fontSize: 20, letterSpacing: 8, textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
              />
            </Field>
            <Btn size="lg" onClick={verifyOtp} disabled={loading || otp.length !== 6}
              style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
              icon={loading ? <span style={{ animation: "pulse 1s infinite" }}>●</span> : <Icons.Lock size={16} />}
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </Btn>
            <button onClick={() => { setStep("email"); setOtp(""); setError(""); }}
              style={{ background: "none", color: "var(--text-muted)", fontSize: 12, textAlign: "center", marginTop: 4 }}>
              ← Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── OPPORTUNITY FORM ───────────────────────────────────────────────
const OpportunityForm = ({ initial, onSave, onClose, users }) => {
  const [form, setForm] = useState(initial || {
    name: "", endCustomer: "", partnerName: "", status: "COLD",
    owner: "", openDate: new Date().toISOString().split("T")[0],
    lastFollowUp: "", currentlyUnderReview: "", futurePotential: "WIP",
    noOfDevices: "", stageUpdate: "", nextSteps: "", attachments: [],
  });

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.endCustomer) return;
    onSave(form);
    onClose();
  };

  const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 };
  const grid3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Section 1 */}
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
        Opportunity Details
      </div>
      <div style={grid2}>
        <Field label="Opportunity Name / Description">
          <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. TFG 1U-RP/U2U" />
        </Field>
        <Field label="End Customer" required>
          <input value={form.endCustomer} onChange={e => update("endCustomer", e.target.value)} placeholder="Customer name" />
        </Field>
      </div>
      <div style={grid3}>
        <Field label="Partner Name">
          <input value={form.partnerName} onChange={e => update("partnerName", e.target.value)} placeholder="Partner" />
        </Field>
        <Field label="Status" required>
          <select value={form.status} onChange={e => update("status", e.target.value)}>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label} — {v.desc}</option>)}
          </select>
        </Field>
        <Field label="TF Follow-up Owner" required>
          <select value={form.owner} onChange={e => update("owner", e.target.value)}>
            <option value="">Select owner...</option>
            {users.map(u => <option key={u.email} value={u.email}>{u.name}</option>)}
          </select>
        </Field>
      </div>

      {/* Section 2 */}
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: 1, marginTop: 8 }}>
        Timeline & Status
      </div>
      <div style={grid3}>
        <Field label="Open Date">
          <input type="date" value={form.openDate} onChange={e => update("openDate", e.target.value)} />
        </Field>
        <Field label="Last Follow Up">
          <input type="date" value={form.lastFollowUp} onChange={e => update("lastFollowUp", e.target.value)} />
        </Field>
        <Field label="No. of Devices">
          <input value={form.noOfDevices} onChange={e => update("noOfDevices", e.target.value)} placeholder="Quantity" />
        </Field>
      </div>
      <div style={grid3}>
        <Field label="Currently Under Review">
          <select value={form.currentlyUnderReview} onChange={e => update("currentlyUnderReview", e.target.value)}>
            <option value="">Select...</option>
            {REVIEW_STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Future Potential">
          <select value={form.futurePotential} onChange={e => update("futurePotential", e.target.value)}>
            <option value="">Select...</option>
            {FUTURE_POTENTIAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="No. of Devices">
          <input value={form.noOfDevices} onChange={e => update("noOfDevices", e.target.value)} placeholder="Qty" />
        </Field>
      </div>

      {/* Section 3 */}
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: 1, marginTop: 8 }}>
        Progress Notes
      </div>
      <Field label="Stage Update">
        <textarea value={form.stageUpdate} onChange={e => update("stageUpdate", e.target.value)}
          placeholder="Current stage details..." rows={2}
          style={{ resize: "vertical", minHeight: 60 }}
        />
      </Field>
      <Field label="Next Steps">
        <textarea value={form.nextSteps} onChange={e => update("nextSteps", e.target.value)}
          placeholder="Planned actions..." rows={2}
          style={{ resize: "vertical", minHeight: 60 }}
        />
      </Field>

      {/* Attachments */}
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: 1, marginTop: 8 }}>
        Attachments
      </div>
      <div style={{
        border: "2px dashed var(--border-secondary)", borderRadius: "var(--radius-lg)",
        padding: 24, textAlign: "center", cursor: "pointer",
        transition: "var(--transition)",
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent-primary)"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-secondary)"}
        onClick={() => {
          const name = prompt("Enter attachment name (simulated):");
          if (name) update("attachments", [...(form.attachments || []), { name, date: new Date().toISOString(), size: "—" }]);
        }}
      >
        <Icons.Upload size={22} color="var(--text-muted)" />
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>Click to upload files</p>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>PDF, DOCX, XLSX, Images up to 25MB</p>
      </div>
      {form.attachments?.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {form.attachments.map((a, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 12px", background: "var(--bg-tertiary)", borderRadius: 8,
              border: "1px solid var(--border-primary)", fontSize: 12,
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)" }}>
                <Icons.Paperclip size={14} /> {a.name}
              </span>
              <button onClick={() => update("attachments", form.attachments.filter((_, j) => j !== i))}
                style={{ background: "none", color: "var(--text-muted)", display: "flex" }}>
                <Icons.X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8, paddingTop: 16, borderTop: "1px solid var(--border-primary)" }}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleSubmit} icon={<Icons.Check size={15} />}>{initial ? "Update" : "Create"} Opportunity</Btn>
      </div>
    </div>
  );
};

// ─── OPPORTUNITY DETAIL VIEW ────────────────────────────────────────
const OpportunityDetail = ({ opp, users, onClose }) => {
  const owner = users.find(u => u.email === opp.owner);
  const InfoRow = ({ label, value }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-primary)" }}>
      <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{value || "—"}</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <Badge status={opp.status} />
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>ID: {opp.id}</span>
      </div>
      <InfoRow label="End Customer" value={opp.endCustomer} />
      <InfoRow label="Partner" value={opp.partnerName} />
      <InfoRow label="Owner" value={owner?.name || opp.owner} />
      <InfoRow label="Open Date" value={formatDate(opp.openDate)} />
      <InfoRow label="Last Follow Up" value={formatDate(opp.lastFollowUp)} />
      <InfoRow label="Under Review" value={opp.currentlyUnderReview} />
      <InfoRow label="Future Potential" value={opp.futurePotential} />
      <InfoRow label="Devices" value={opp.noOfDevices} />
      {opp.stageUpdate && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginBottom: 6 }}>Stage Update</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", background: "var(--bg-tertiary)", borderRadius: 8, padding: 12, lineHeight: 1.6, border: "1px solid var(--border-primary)" }}>{opp.stageUpdate}</div>
        </div>
      )}
      {opp.nextSteps && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginBottom: 6 }}>Next Steps</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", background: "var(--bg-tertiary)", borderRadius: 8, padding: 12, lineHeight: 1.6, border: "1px solid var(--border-primary)" }}>{opp.nextSteps}</div>
        </div>
      )}
      {opp.attachments?.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginBottom: 8 }}>Attachments</div>
          {opp.attachments.map((a, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
              background: "var(--bg-tertiary)", borderRadius: 8, marginBottom: 4,
              border: "1px solid var(--border-primary)", fontSize: 12, color: "var(--text-secondary)",
            }}>
              <Icons.Paperclip size={14} /> {a.name}
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Close</Btn>
      </div>
    </div>
  );
};

// ─── PIPELINE TABLE ─────────────────────────────────────────────────
const PipelineTable = ({ opportunities, users, onEdit, onDelete, onView, canEdit }) => {
  const [sortKey, setSortKey] = useState("sNo");
  const [sortDir, setSortDir] = useState("asc");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let result = [...opportunities];
    if (statusFilter !== "ALL") result = result.filter(o => o.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(o =>
        (o.name || "").toLowerCase().includes(q) ||
        (o.endCustomer || "").toLowerCase().includes(q) ||
        (o.partnerName || "").toLowerCase().includes(q) ||
        (o.stageUpdate || "").toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const aVal = a[sortKey] || "";
      const bVal = b[sortKey] || "";
      const dir = sortDir === "asc" ? 1 : -1;
      if (typeof aVal === "number") return (aVal - bVal) * dir;
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
    return result;
  }, [opportunities, statusFilter, search, sortKey, sortDir]);

  const getOwnerName = (email) => {
    const u = users.find(u => u.email === email);
    return u?.name || email?.split("@")[0] || "—";
  };

  const TH = ({ label, sortable, field, width }) => (
    <th style={{
      padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 600,
      color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8,
      borderBottom: "1px solid var(--border-primary)", whiteSpace: "nowrap",
      cursor: sortable ? "pointer" : "default", userSelect: "none",
      width, background: "var(--bg-secondary)", position: "sticky", top: 0, zIndex: 1,
    }}
      onClick={() => sortable && toggleSort(field)}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {label}
        {sortable && sortKey === field && (
          <span style={{ fontSize: 10 }}>{sortDir === "asc" ? "↑" : "↓"}</span>
        )}
      </span>
    </th>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 280px" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
            <Icons.Search size={15} />
          </span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search opportunities..."
            style={{ paddingLeft: 36, background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button onClick={() => setStatusFilter("ALL")} style={{
            padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: statusFilter === "ALL" ? "var(--accent-primary)" : "var(--bg-tertiary)",
            color: statusFilter === "ALL" ? "#fff" : "var(--text-secondary)",
            border: `1px solid ${statusFilter === "ALL" ? "var(--accent-primary)" : "var(--border-primary)"}`,
            letterSpacing: 0.3,
          }}>All ({opportunities.length})</button>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => {
            const count = opportunities.filter(o => o.status === k).length;
            if (!count) return null;
            return (
              <button key={k} onClick={() => setStatusFilter(k)} style={{
                padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                background: statusFilter === k ? v.bg : "var(--bg-tertiary)",
                color: statusFilter === k ? v.color : "var(--text-secondary)",
                border: `1px solid ${statusFilter === k ? v.border : "var(--border-primary)"}`,
                letterSpacing: 0.3,
              }}>{v.label} ({count})</button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{
        border: "1px solid var(--border-primary)", borderRadius: "var(--radius-lg)",
        overflow: "auto", maxHeight: 520, background: "var(--bg-card)",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
          <thead>
            <tr>
              <TH label="#" sortable field="sNo" width={50} />
              <TH label="Opportunity" sortable field="name" />
              <TH label="End Customer" sortable field="endCustomer" />
              <TH label="Partner" sortable field="partnerName" />
              <TH label="Status" sortable field="status" />
              <TH label="Owner" sortable field="owner" />
              <TH label="Open Date" sortable field="openDate" />
              <TH label="Last Follow Up" sortable field="lastFollowUp" />
              <TH label="Review" sortable field="currentlyUnderReview" />
              <TH label="Potential" sortable field="futurePotential" />
              <TH label="Stage" />
              <TH label="Actions" width={100} />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={12}><EmptyState icon={<Icons.Pipeline size={32} />} title="No opportunities found" desc="Try adjusting your filters" /></td></tr>
            ) : (
              filtered.map((opp, i) => (
                <tr key={opp.id} className="animate-in" style={{ animationDelay: `${i * 30}ms` }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={tdStyle}>{opp.sNo}</td>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "var(--text-primary)", maxWidth: 180 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {opp.name || "—"}
                    </div>
                  </td>
                  <td style={tdStyle}>{opp.endCustomer}</td>
                  <td style={tdStyle}>{opp.partnerName || "—"}</td>
                  <td style={tdStyle}><Badge status={opp.status} /></td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{
                        width: 24, height: 24, borderRadius: "50%",
                        background: "var(--accent-glow)", color: "var(--accent-primary)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, fontWeight: 700, flexShrink: 0,
                      }}>{getOwnerName(opp.owner).slice(0, 2).toUpperCase()}</span>
                      <span style={{ fontSize: 12 }}>{getOwnerName(opp.owner)}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>{formatDate(opp.openDate)}</td>
                  <td style={tdStyle}>{formatDate(opp.lastFollowUp)}</td>
                  <td style={tdStyle}><span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{opp.currentlyUnderReview || "—"}</span></td>
                  <td style={tdStyle}>
                    {opp.futurePotential ? (
                      <span style={{
                        padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                        background: opp.futurePotential === "High" ? "rgba(34,197,94,0.1)" :
                          opp.futurePotential === "WIP" ? "rgba(245,158,11,0.1)" : "var(--bg-tertiary)",
                        color: opp.futurePotential === "High" ? "var(--success)" :
                          opp.futurePotential === "WIP" ? "var(--warning)" : "var(--text-secondary)",
                      }}>{opp.futurePotential}</span>
                    ) : "—"}
                  </td>
                  <td style={{ ...tdStyle, maxWidth: 160 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11, color: "var(--text-secondary)" }}>
                      {opp.stageUpdate || "—"}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => onView(opp)} style={iconBtnStyle} title="View"><Icons.Eye size={14} /></button>
                      {canEdit && <button onClick={() => onEdit(opp)} style={iconBtnStyle} title="Edit"><Icons.Edit size={14} /></button>}
                      {canEdit && <button onClick={() => onDelete(opp.id)} style={{ ...iconBtnStyle, color: "var(--danger)" }} title="Delete"><Icons.Trash size={14} /></button>}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "right" }}>
        Showing {filtered.length} of {opportunities.length} opportunities
      </div>
    </div>
  );
};

const tdStyle = {
  padding: "12px 14px", fontSize: 13, color: "var(--text-secondary)",
  borderBottom: "1px solid var(--border-primary)", whiteSpace: "nowrap",
};

const iconBtnStyle = {
  background: "var(--bg-tertiary)", border: "1px solid var(--border-primary)",
  borderRadius: 6, padding: 6, display: "flex", color: "var(--text-secondary)",
  cursor: "pointer", transition: "var(--transition)",
};

// ─── REPORTS VIEW ───────────────────────────────────────────────────
const ReportsView = ({ opportunities, users }) => {
  const statusCounts = useMemo(() => {
    const counts = {};
    Object.keys(STATUS_CONFIG).forEach(k => counts[k] = 0);
    opportunities.forEach(o => { if (counts[o.status] !== undefined) counts[o.status]++; });
    return counts;
  }, [opportunities]);

  const ownerCounts = useMemo(() => {
    const counts = {};
    opportunities.forEach(o => {
      const name = users.find(u => u.email === o.owner)?.name || o.owner?.split("@")[0] || "Unknown";
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [opportunities, users]);

  const maxBar = Math.max(...Object.values(statusCounts), 1);
  const maxOwner = Math.max(...ownerCounts.map(o => o[1]), 1);

  const potentialCounts = useMemo(() => {
    const counts = {};
    opportunities.forEach(o => {
      const p = o.futurePotential || "Unset";
      counts[p] = (counts[p] || 0) + 1;
    });
    return counts;
  }, [opportunities]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>Pipeline Analytics</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Overview of your sales pipeline performance</p>
        </div>
        <Btn variant="secondary" size="sm" icon={<Icons.Download size={14} />}>Export CSV</Btn>
      </div>

      {/* Status Distribution */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)", borderRadius: "var(--radius-lg)", padding: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, color: "var(--text-secondary)" }}>Pipeline by Status</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ width: 90, fontSize: 12, fontWeight: 500, color: config.color, flexShrink: 0 }}>{config.label}</span>
              <div style={{ flex: 1, height: 28, background: "var(--bg-tertiary)", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                <div style={{
                  height: "100%", background: `linear-gradient(90deg, ${config.bg}, ${config.color}30)`,
                  borderLeft: `3px solid ${config.color}`,
                  width: `${(statusCounts[key] / maxBar) * 100}%`,
                  transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
                  display: "flex", alignItems: "center", paddingLeft: 10,
                  minWidth: statusCounts[key] > 0 ? 30 : 0,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: config.color }}>{statusCounts[key]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* By Owner */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)", borderRadius: "var(--radius-lg)", padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, color: "var(--text-secondary)" }}>Opportunities by Owner</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ownerCounts.map(([name, count]) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: "50%", background: "var(--accent-glow)",
                  color: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, flexShrink: 0,
                }}>{name.slice(0, 2).toUpperCase()}</span>
                <span style={{ flex: "0 0 100px", fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{name}</span>
                <div style={{ flex: 1, height: 20, background: "var(--bg-tertiary)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", background: "linear-gradient(90deg, var(--accent-glow), rgba(79,123,247,0.3))",
                    borderLeft: "2px solid var(--accent-primary)",
                    width: `${(count / maxOwner) * 100}%`, minWidth: 20,
                    display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6,
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent-primary)" }}>{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Potential */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)", borderRadius: "var(--radius-lg)", padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, color: "var(--text-secondary)" }}>Future Potential</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {Object.entries(potentialCounts).map(([label, count]) => (
              <div key={label} style={{
                padding: 16, background: "var(--bg-tertiary)", borderRadius: 10,
                border: "1px solid var(--border-primary)", textAlign: "center",
              }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)" }}>{count}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── TEAM MANAGEMENT ────────────────────────────────────────────────
const TeamManagement = ({ teams, setTeams, users, setUsers, currentUser }) => {
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  const addTeam = () => {
    if (!newTeamName) return;
    setTeams([...teams, { id: generateId(), name: newTeamName, members: [] }]);
    setNewTeamName("");
    setShowAddTeam(false);
  };

  const addUser = () => {
    if (!newUserEmail.endsWith("@terafence.in") || !newUserName) return;
    if (!users.find(u => u.email === newUserEmail)) {
      setUsers([...users, {
        email: newUserEmail, name: newUserName, role: "member",
        avatar: newUserName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
      }]);
    }
    setNewUserEmail("");
    setNewUserName("");
    setShowAddUser(false);
  };

  const addMemberToTeam = (teamId, email) => {
    setTeams(teams.map(t => t.id === teamId ? { ...t, members: [...new Set([...t.members, email])] } : t));
  };

  const removeMemberFromTeam = (teamId, email) => {
    setTeams(teams.map(t => t.id === teamId ? { ...t, members: t.members.filter(m => m !== email) } : t));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>Team Management</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Manage teams, members, and access control</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="secondary" size="sm" icon={<Icons.Plus size={14} />} onClick={() => setShowAddUser(true)}>Add User</Btn>
          <Btn size="sm" icon={<Icons.Plus size={14} />} onClick={() => setShowAddTeam(true)}>Create Team</Btn>
        </div>
      </div>

      {/* Teams */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 }}>
        {teams.map(team => (
          <div key={team.id} style={{
            background: "var(--bg-card)", border: "1px solid var(--border-primary)",
            borderRadius: "var(--radius-lg)", padding: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "linear-gradient(135deg, var(--accent-glow), rgba(139,92,246,0.15))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent-primary)",
                }}>
                  <Icons.Team size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>{team.name}</h3>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{team.members.length} member{team.members.length !== 1 ? "s" : ""}</span>
                </div>
              </div>
              <Btn variant="ghost" size="sm" onClick={() => {
                const email = prompt("Enter member email (@terafence.in):");
                if (email && email.endsWith("@terafence.in")) addMemberToTeam(team.id, email);
              }}>
                <Icons.Plus size={14} />
              </Btn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {team.members.map(email => {
                const user = users.find(u => u.email === email);
                return (
                  <div key={email} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 12px", background: "var(--bg-tertiary)", borderRadius: 8,
                    border: "1px solid var(--border-primary)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        width: 26, height: 26, borderRadius: "50%",
                        background: "var(--accent-glow)", color: "var(--accent-primary)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, fontWeight: 700,
                      }}>{(user?.avatar || email.slice(0, 2)).toUpperCase()}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.name || email.split("@")[0]}</div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{email}</div>
                      </div>
                    </div>
                    {currentUser.role === "admin" && (
                      <button onClick={() => removeMemberFromTeam(team.id, email)}
                        style={{ background: "none", color: "var(--text-muted)", display: "flex", cursor: "pointer" }}>
                        <Icons.X size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
              {team.members.length === 0 && (
                <div style={{ textAlign: "center", padding: 20, color: "var(--text-muted)", fontSize: 12 }}>
                  No members yet
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* All Users */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)", borderRadius: "var(--radius-lg)", padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>All Users</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
          {users.map(u => (
            <div key={u.email} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
              background: "var(--bg-tertiary)", borderRadius: 10,
              border: "1px solid var(--border-primary)",
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: "50%",
                background: u.role === "admin" ? "linear-gradient(135deg, rgba(79,123,247,0.2), rgba(139,92,246,0.2))" : "var(--bg-hover)",
                color: u.role === "admin" ? "var(--accent-primary)" : "var(--text-secondary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
              }}>{u.avatar}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
              </div>
              <span style={{
                padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                background: u.role === "admin" ? "rgba(79,123,247,0.1)" : "var(--bg-hover)",
                color: u.role === "admin" ? "var(--accent-primary)" : "var(--text-muted)",
                textTransform: "uppercase", letterSpacing: 0.5,
              }}>{u.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Team Modal */}
      <Modal open={showAddTeam} onClose={() => setShowAddTeam(false)} title="Create New Team" width={420}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Team Name" required>
            <input value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="e.g. Sales Team B" onKeyDown={e => e.key === "Enter" && addTeam()} />
          </Field>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setShowAddTeam(false)}>Cancel</Btn>
            <Btn onClick={addTeam} disabled={!newTeamName}>Create Team</Btn>
          </div>
        </div>
      </Modal>

      {/* Add User Modal */}
      <Modal open={showAddUser} onClose={() => setShowAddUser(false)} title="Add New User" width={420}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Full Name" required>
            <input value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="Full name" />
          </Field>
          <Field label="Email" required>
            <input value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} placeholder="name@terafence.in" />
          </Field>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setShowAddUser(false)}>Cancel</Btn>
            <Btn onClick={addUser} disabled={!newUserEmail || !newUserName}>Add User</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─── MAIN APP ───────────────────────────────────────────────────────
export default function TerafencePipeline() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOpp, setEditingOpp] = useState(null);
  const [viewingOpp, setViewingOpp] = useState(null);
  const [dashboardView, setDashboardView] = useState("overview"); // overview | detailed

  const isAdmin = currentUser?.role === "admin";

  // Determine which opportunities the current user can see
  const visibleOpps = useMemo(() => {
    if (!currentUser) return [];
    if (isAdmin) return opportunities;
    // Find user's teams
    const userTeams = teams.filter(t => t.members.includes(currentUser.email));
    const teamEmails = new Set(userTeams.flatMap(t => t.members));
    teamEmails.add(currentUser.email);
    return opportunities.filter(o => teamEmails.has(o.owner) || teamEmails.has(o.createdBy));
  }, [currentUser, isAdmin, opportunities, teams]);

  const canEditOpp = useCallback((opp) => {
    if (!currentUser) return false;
    if (isAdmin) return true;
    const userTeams = teams.filter(t => t.members.includes(currentUser.email));
    const teamEmails = new Set(userTeams.flatMap(t => t.members));
    teamEmails.add(currentUser.email);
    return teamEmails.has(opp.owner) || teamEmails.has(opp.createdBy);
  }, [currentUser, isAdmin, teams]);

  const handleCreateOpp = (form) => {
    const newOpp = {
      ...form, id: generateId(),
      sNo: opportunities.length + 1,
      createdBy: currentUser.email,
      attachments: form.attachments || [],
    };
    setOpportunities([...opportunities, newOpp]);
  };

  const handleUpdateOpp = (form) => {
    setOpportunities(opportunities.map(o => o.id === editingOpp.id ? { ...o, ...form } : o));
    setEditingOpp(null);
  };

  const handleDeleteOpp = (id) => {
    if (confirm("Delete this opportunity? This action cannot be undone.")) {
      setOpportunities(opportunities.filter(o => o.id !== id));
    }
  };

  if (!currentUser) return (<><GlobalStyle /><LoginScreen onLogin={setCurrentUser} /></>);

  // Stats
  const totalOpps = visibleOpps.length;
  const activeOpps = visibleOpps.filter(o => ["ACTIVE", "HOT"].includes(o.status)).length;
  const closedWon = visibleOpps.filter(o => o.status === "CLOSED_WON").length;
  const needsAttention = visibleOpps.filter(o => o.status === "ORANGE").length;

  const NAV = [
    { key: "dashboard", label: "Dashboard", icon: <Icons.Dashboard size={17} /> },
    { key: "pipeline", label: "Pipeline", icon: <Icons.Pipeline size={17} /> },
    { key: "reports", label: "Reports", icon: <Icons.Report size={17} /> },
    ...(isAdmin ? [{ key: "teams", label: "Teams & Users", icon: <Icons.Team size={17} /> }] : []),
  ];

  return (
    <>
      <GlobalStyle />
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
        {/* Sidebar */}
        <aside style={{
          width: 240, background: "var(--bg-secondary)", borderRight: "1px solid var(--border-primary)",
          display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh",
        }}>
          {/* Brand */}
          <div style={{ padding: "22px 20px", borderBottom: "1px solid var(--border-primary)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, var(--accent-primary), #7C3AED)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 10px rgba(79,123,247,0.2)",
              }}>
                <Icons.Shield size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.3 }}>Terafence</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 0.5 }}>PIPELINE CRM</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV.map(item => (
              <button key={item.key} onClick={() => setPage(item.key)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 8, fontSize: 13, fontWeight: 500, width: "100%", textAlign: "left",
                background: page === item.key ? "var(--accent-glow)" : "transparent",
                color: page === item.key ? "var(--accent-primary)" : "var(--text-secondary)",
                border: page === item.key ? "1px solid rgba(79,123,247,0.15)" : "1px solid transparent",
                transition: "var(--transition)",
              }}>
                {item.icon} {item.label}
              </button>
            ))}
          </nav>

          {/* User */}
          <div style={{
            padding: "16px 16px", borderTop: "1px solid var(--border-primary)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{
              width: 32, height: 32, borderRadius: "50%",
              background: isAdmin ? "linear-gradient(135deg, var(--accent-primary), #7C3AED)" : "var(--bg-tertiary)",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700,
            }}>{currentUser.avatar || "?"}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {currentUser.role}
              </div>
            </div>
            <button onClick={() => setCurrentUser(null)} style={{
              background: "var(--bg-tertiary)", borderRadius: 6, padding: 6, display: "flex",
              color: "var(--text-muted)", cursor: "pointer", border: "1px solid var(--border-primary)",
            }} title="Sign out">
              <Icons.Logout size={14} />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "28px 32px", overflow: "auto", maxHeight: "100vh" }}>
          {/* ── DASHBOARD ── */}
          {page === "dashboard" && (
            <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
                    {isAdmin ? "Executive Dashboard" : "My Dashboard"}
                  </h1>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                    {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {isAdmin && (
                    <TabBar
                      tabs={[{ key: "overview", label: "Bird's Eye" }, { key: "detailed", label: "Detailed" }]}
                      active={dashboardView} onChange={setDashboardView}
                    />
                  )}
                  <Btn icon={<Icons.Plus size={15} />} onClick={() => setShowCreateModal(true)}>
                    New Opportunity
                  </Btn>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <StatCard icon={<Icons.Pipeline size={18} />} label="Total Pipeline" value={totalOpps} sub="All opportunities" accent />
                <StatCard icon={<Icons.TrendUp size={18} />} label="Active / Hot" value={activeOpps} sub="In progress" trend={12} />
                <StatCard icon={<Icons.Check size={18} />} label="Closed Won" value={closedWon} sub="Converted" />
                <StatCard icon={<Icons.Filter size={18} />} label="Needs Strategy" value={needsAttention} sub="Orange status" />
              </div>

              {/* Quick View Table or Cards */}
              {dashboardView === "overview" && isAdmin ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                    const items = visibleOpps.filter(o => o.status === key);
                    return (
                      <div key={key} style={{
                        background: "var(--bg-card)", border: "1px solid var(--border-primary)",
                        borderRadius: "var(--radius-lg)", overflow: "hidden",
                      }}>
                        <div style={{
                          padding: "14px 18px", borderBottom: `2px solid ${config.color}`,
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: config.color }} />
                            <span style={{ fontSize: 13, fontWeight: 600 }}>{config.label}</span>
                          </div>
                          <span style={{
                            padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700,
                            background: config.bg, color: config.color,
                          }}>{items.length}</span>
                        </div>
                        <div style={{ padding: "8px 12px", maxHeight: 200, overflow: "auto" }}>
                          {items.length === 0 ? (
                            <div style={{ padding: 16, textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>None</div>
                          ) : items.map(opp => (
                            <div key={opp.id} onClick={() => setViewingOpp(opp)} style={{
                              padding: "10px 8px", borderBottom: "1px solid var(--border-primary)",
                              cursor: "pointer", transition: "var(--transition)",
                            }}
                              onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {opp.endCustomer}
                              </div>
                              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                                {users.find(u => u.email === opp.owner)?.name || "—"} · {formatDate(opp.openDate)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <PipelineTable
                  opportunities={visibleOpps} users={users}
                  onEdit={(opp) => setEditingOpp(opp)}
                  onDelete={handleDeleteOpp}
                  onView={(opp) => setViewingOpp(opp)}
                  canEdit={true}
                />
              )}

              {/* Recent Activity */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)", borderRadius: "var(--radius-lg)", padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Recent Follow-ups</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {visibleOpps
                    .filter(o => o.lastFollowUp)
                    .sort((a, b) => new Date(b.lastFollowUp) - new Date(a.lastFollowUp))
                    .slice(0, 5)
                    .map(opp => (
                      <div key={opp.id} style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "12px 0", borderBottom: "1px solid var(--border-primary)",
                      }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: STATUS_CONFIG[opp.status]?.color || "var(--text-muted)",
                          flexShrink: 0,
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{opp.endCustomer}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{opp.stageUpdate || "No update"}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{formatDate(opp.lastFollowUp)}</div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{users.find(u => u.email === opp.owner)?.name}</div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}

          {/* ── PIPELINE ── */}
          {page === "pipeline" && (
            <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>Pipeline</h1>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                    {isAdmin ? "All opportunities across teams" : "Your team's opportunities"}
                  </p>
                </div>
                <Btn icon={<Icons.Plus size={15} />} onClick={() => setShowCreateModal(true)}>New Opportunity</Btn>
              </div>
              <PipelineTable
                opportunities={visibleOpps} users={users}
                onEdit={(opp) => setEditingOpp(opp)}
                onDelete={handleDeleteOpp}
                onView={(opp) => setViewingOpp(opp)}
                canEdit={true}
              />
            </div>
          )}

          {/* ── REPORTS ── */}
          {page === "reports" && (
            <div className="animate-in">
              <ReportsView opportunities={visibleOpps} users={users} />
            </div>
          )}

          {/* ── TEAMS ── */}
          {page === "teams" && isAdmin && (
            <div className="animate-in">
              <TeamManagement teams={teams} setTeams={setTeams} users={users} setUsers={setUsers} currentUser={currentUser} />
            </div>
          )}
        </main>
      </div>

      {/* ── MODALS ── */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Opportunity" width={720}>
        <OpportunityForm onSave={handleCreateOpp} onClose={() => setShowCreateModal(false)} users={users} />
      </Modal>

      <Modal open={!!editingOpp} onClose={() => setEditingOpp(null)} title="Edit Opportunity" width={720}>
        {editingOpp && <OpportunityForm initial={editingOpp} onSave={handleUpdateOpp} onClose={() => setEditingOpp(null)} users={users} />}
      </Modal>

      <Modal open={!!viewingOpp} onClose={() => setViewingOpp(null)} title={viewingOpp?.name || viewingOpp?.endCustomer || "Opportunity Details"} width={560}>
        {viewingOpp && <OpportunityDetail opp={viewingOpp} users={users} onClose={() => setViewingOpp(null)} />}
      </Modal>
    </>
  );
}
