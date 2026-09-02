"use client";

import { useState } from "react";
import {
  Car,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Wrench,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Loader2,
} from "lucide-react";

type AuthMode = "signin" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signin");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (mode === "signup") {
      if (!form.name.trim()) {
        setError("Please enter your full name.");
        return;
      }

      if (!form.email.trim()) {
        setError("Please enter your email address.");
        return;
      }

      if (!form.password) {
        setError("Please enter a password.");
        return;
      }

      if (form.password.length < 6) {
        setError("Password must contain at least 6 characters.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    if (mode === "signin") {
      if (!form.email.trim() || !form.password) {
        setError("Please enter your email and password.");
        return;
      }
    }

    try {
      setLoading(true);

      /*
       * Connect your backend here.
       *
       * Example:
       *
       * const endpoint =
       *   mode === "signin"
       *     ? "/api/auth/login"
       *     : "/api/auth/register";
       *
       * const response = await fetch(
       *   `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
       *   {
       *     method: "POST",
       *     headers: {
       *       "Content-Type": "application/json",
       *     },
       *     body: JSON.stringify({
       *       name: form.name,
       *       email: form.email,
       *       phone: form.phone,
       *       password: form.password,
       *     }),
       *   }
       * );
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      setSuccess(
        mode === "signin"
          ? "Signed in successfully."
          : "Account created successfully."
      );
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8fc]">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-3xl" />

        <div className="absolute -right-40 top-[15%] h-[550px] w-[550px] rounded-full bg-violet-200/25 blur-3xl" />

        <div className="absolute bottom-[-200px] left-[30%] h-[500px] w-[500px] rounded-full bg-cyan-200/20 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_30px_100px_-30px_rgba(15,23,42,0.3)] lg:grid-cols-2">

          {/* LEFT BRAND PANEL */}
          <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
            {/* Decorative gradients */}
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />

            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

            <div className="relative">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                  <Wrench className="h-5 w-5" />
                </div>

                <div>
                  <div className="text-lg font-black tracking-tight">
                    Instant Mechanic
                  </div>

                  <div className="text-xs text-slate-400">
                    Smart vehicle assistance
                  </div>
                </div>
              </div>

              {/* Hero */}
              <div className="mt-24">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-blue-300">
                  <Zap className="h-3.5 w-3.5" />
                  Fast. Reliable. On-demand.
                </div>

                <h1 className="max-w-lg text-4xl font-black leading-[1.08] tracking-tight xl:text-5xl">
                  Vehicle assistance,
                  <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    whenever you need it.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                  Manage bookings, mechanics, customers and
                  vehicle services from one powerful platform.
                </p>
              </div>

              {/* Features */}
              <div className="mt-10 space-y-4">
                <Feature
                  icon={<ShieldCheck className="h-4 w-4" />}
                  title="Secure platform"
                  text="Your data stays protected."
                />

                <Feature
                  icon={<Zap className="h-4 w-4" />}
                  title="Real-time operations"
                  text="Track your business instantly."
                />

                <Feature
                  icon={<Car className="h-4 w-4" />}
                  title="Complete vehicle management"
                  text="Everything in one place."
                />
              </div>
            </div>

            <div className="relative mt-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-slate-500">
              <span>© 2026 Instant Mechanic</span>
              <span>Operations Platform</span>
            </div>
          </section>

          {/* AUTH PANEL */}
          <section className="flex min-h-[680px] flex-col justify-center p-6 sm:p-10 lg:p-12 xl:p-16">
            {/* Mobile logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                <Wrench className="h-5 w-5" />
              </div>

              <div>
                <div className="font-black text-slate-950">
                  Instant Mechanic
                </div>

                <div className="text-xs text-slate-400">
                  Smart vehicle assistance
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                {mode === "signin" ? (
                  <ArrowRight className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                {mode === "signin"
                  ? "Welcome back"
                  : "Create your account"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {mode === "signin"
                  ? "Sign in to access your Instant Mechanic dashboard."
                  : "Get started with your Instant Mechanic account today."}
              </p>
            </div>

            {/* Mode switch */}
            <div className="mb-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className={`rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                  mode === "signin"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                  mode === "signup"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Create account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              {mode === "signup" && (
                <InputField
                  label="Full name"
                  icon={<User className="h-4 w-4" />}
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(value) =>
                    updateField("name", value)
                  }
                />
              )}

              {/* Email */}
              <InputField
                label="Email address"
                icon={<Mail className="h-4 w-4" />}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(value) =>
                  updateField("email", value)
                }
              />

              {/* Phone */}
              {mode === "signup" && (
                <InputField
                  label="Phone number"
                  icon={<Phone className="h-4 w-4" />}
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(value) =>
                    updateField("phone", value)
                  }
                />
              )}

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Password
                </label>

                <div className="group relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-500" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      updateField(
                        "password",
                        e.target.value
                      )
                    }
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              {mode === "signup" && (
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Confirm password
                  </label>

                  <div className="group relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-500" />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={form.confirmPassword}
                      onChange={(e) =>
                        updateField(
                          "confirmPassword",
                          e.target.value
                        )
                      }
                      placeholder="Confirm your password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Remember / Forgot */}
              {mode === "signin" && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">
                    <input
                      type="checkbox"
                      checked={form.remember}
                      onChange={(e) =>
                        updateField(
                          "remember",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />

                    Remember me
                  </label>

                  <button
                    type="button"
                    className="text-sm font-bold text-blue-600 transition hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Messages */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  {success}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === "signin"
                      ? "Signing in..."
                      : "Creating account..."}
                  </>
                ) : (
                  <>
                    {mode === "signin"
                      ? "Sign in"
                      : "Create account"}

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom switch */}
            <div className="mt-8 text-center text-sm text-slate-500">
              {mode === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => switchMode("signup")}
                    className="font-bold text-blue-600 hover:text-blue-700"
                  >
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => switchMode("signin")}
                    className="font-bold text-blue-600 hover:text-blue-700"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>

            {/* Security */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure authentication
            </div>
          </section>
        </div>
      </div>

      <style jsx global>{`
        @keyframes authFade {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        main > div > div {
          animation: authFade 0.6s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          main > div > div {
            animation: none !important;
          }

          * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}

function InputField({
  label,
  icon,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <div className="group relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-500">
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
        />
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-300">
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold text-white">
          {title}
        </p>

        <p className="text-xs text-slate-500">{text}</p>
      </div>
    </div>
  );
}
