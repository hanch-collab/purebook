"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Incorrect email or password.");
    } else {
      router.push("/calendar");
    }
  }

  return (
    <div className="min-h-screen bg-pb-bg flex items-center justify-center p-5">
      <div className="w-full max-w-[760px] bg-pb-surface rounded-2xl border border-pb-border shadow-sm overflow-hidden flex min-h-[440px]">

        {/* Left panel */}
        <div className="w-[42%] bg-pb-text p-9 flex flex-col justify-between flex-shrink-0">
          <div>
            <div className="text-[22px] font-semibold text-white tracking-tight">Purebook</div>
            <div className="text-xs text-pb-muted mt-1">Salon management</div>
          </div>
          <div>
            <div className="text-[15px] text-white leading-relaxed font-medium mb-2.5">
              Sign in once on this device.
            </div>
            <div className="text-xs text-pb-muted leading-relaxed">
              After signing in, your team switches between staff with a quick PIN — no need to log in again each time.
            </div>
          </div>
          <div className="text-[11px] text-[#6A6560] leading-relaxed">
            New to Purebook? Create a salon account in a couple of minutes.
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 px-10 py-9 flex flex-col justify-center">
          <div className="text-[18px] font-semibold text-pb-text mb-1.5">Sign in to your salon</div>
          <div className="text-xs text-pb-muted mb-6">Enter your salon account details to set up this device.</div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="block text-[9.5px] font-medium text-pb-muted uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@yoursalon.co.uk"
                required
                className="w-full h-[42px] px-3 border border-pb-border rounded-lg text-[13px] text-pb-text bg-white focus:outline-none focus:border-pb-gold transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[9.5px] font-medium text-pb-muted uppercase tracking-wide">
                  Password
                </label>
                <button type="button" className="text-[11px] text-pb-link font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="flex items-center h-[42px] border border-pb-border rounded-lg bg-white overflow-hidden">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="flex-1 px-3 text-[13px] text-pb-text bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="px-3 text-pb-muted flex items-center"
                >
                  {showPwd ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M3 3l18 18"/><path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"/><path d="M9.363 5.365a9.466 9.466 0 0 1 2.637-.365c3.6 0 6.6 2 9 6-.666 1.11-1.379 2.067-2.138 2.87m-2.13 1.948a9.292 9.292 0 0 1-4.732 1.282c-3.6 0-6.6-2-9-6 1.07-1.784 2.297-3.106 3.68-3.967"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0"/><path d="M21 12c-2.4 4-5.4 6-9 6c-3.6 0-6.6-2-9-6c2.4-4 5.4-6 9-6c3.6 0 6.6 2 9 6"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-[12px] text-red-500 font-medium">{error}</div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[44px] rounded-lg bg-pb-text text-pb-gold text-[13px] font-medium disabled:opacity-60 mt-1"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <div className="text-center text-[12px] text-[#6A6560]">
              New salon? <span className="text-pb-link font-medium cursor-pointer">Create an account</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
