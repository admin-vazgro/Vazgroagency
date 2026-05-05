"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPostLoginDestination, resolveUserRole } from "@/lib/auth/resolve-role";
import { createClient } from "@/lib/supabase/client";

type Mode = "magic" | "password";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const authError = new URLSearchParams(window.location.search).get("error");
    if (authError === "auth_failed") {
      setError("Login link expired or could not be verified. Please try again.");
      setSent(false);
    }
    if (authError === "access_denied") {
      setError("Your account does not have access to that area.");
      setSent(false);
    }
  }, []);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;
    if (!user) {
      setError("Login succeeded but no user session was returned. Please try again.");
      setLoading(false);
      return;
    }

    const role = await resolveUserRole(supabase, user);
    const destination = getPostLoginDestination(role);
    router.replace(destination);
    router.refresh();
    setLoading(false);
  }

  const inputClass =
    "w-full bg-[#0A0A0A] border border-[#2D2D2D] text-[#F5F5F0] font-ibm-mono text-[14px] tracking-[0.5px] px-4 py-3 focus:outline-none focus:border-[#D6E264] transition-colors placeholder:text-[#444]";

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      {/* Grid background */}
      <div className="fixed inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #D6E264 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-[#D6E264] flex items-center justify-center">
            <span className="font-grotesk text-[14px] font-normal text-[#0A0A0A]">V</span>
          </div>
          <span className="font-grotesk text-[14px] font-normal text-[#F5F5F0] tracking-[2px]">VAZGRO</span>
        </div>

        <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-[#1D1D1D]">
            <span className="font-ibm-mono text-[14px] text-[#D6E264] tracking-[3px]">// SECURE LOGIN</span>
            <h1 className="font-grotesk text-[36px] font-normal text-[#F5F5F0] tracking-[-1px] leading-[1.05] mt-2">
              Welcome back.
            </h1>
            <p className="font-ibm-mono text-[14px] text-[#F0F0EA] tracking-[0.5px] mt-1">
              Clients · Partners · Internal team — one login.
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex border-b border-[#1D1D1D]">
            <button
              onClick={() => { setMode("magic"); setError(""); setSent(false); }}
              className="flex-1 py-3 font-ibm-mono text-[14px] tracking-[2px] transition-colors cursor-pointer border-none"
              style={{ background: mode === "magic" ? "#D6E264" : "#111111", color: mode === "magic" ? "#0A0A0A" : "#C6C6BE" }}
            >
              MAGIC LINK
            </button>
            <button
              onClick={() => { setMode("password"); setError(""); setSent(false); }}
              className="flex-1 py-3 font-ibm-mono text-[14px] tracking-[2px] transition-colors cursor-pointer border-none border-l border-[#1D1D1D]"
              style={{ background: mode === "password" ? "#D6E264" : "#111111", color: mode === "password" ? "#0A0A0A" : "#C6C6BE" }}
            >
              PASSWORD
            </button>
          </div>

          <div className="p-8">
            {sent ? (
              <div className="flex flex-col items-center text-center gap-4 py-6">
                <div className="w-14 h-14 bg-[#D6E264] flex items-center justify-center text-[24px]">✓</div>
                <div>
                  <p className="font-grotesk text-[18px] font-normal text-[#F5F5F0]">Check your email</p>
                  <p className="font-ibm-mono text-[14px] text-[#F0F0EA] tracking-[0.5px] mt-2 leading-[1.7]">
                    We sent a magic link to <span className="text-[#D6E264]">{email}</span>.<br />Click it to sign in — no password needed.
                  </p>
                </div>
                <button onClick={() => { setSent(false); setEmail(""); }} className="font-ibm-mono text-[14px] text-[#C6C6BE] hover:text-[#F0F0EA] tracking-[1px] cursor-pointer bg-transparent border-none mt-2">
                  ← Use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={mode === "magic" ? handleMagicLink : handlePassword} className="flex flex-col gap-4">
                <div>
                  <label className="font-ibm-mono text-[14px] font-normal text-[#F0F0EA] tracking-[2px] block mb-2">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    className={inputClass}
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {mode === "password" && (
                  <div>
                    <label className="font-ibm-mono text-[14px] font-normal text-[#F0F0EA] tracking-[2px] block mb-2">PASSWORD</label>
                    <input
                      type="password"
                      className={inputClass}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                )}

                {error && (
                  <div className="border border-[#FF6B35] bg-[#FF6B3510] p-3">
                    <p className="font-ibm-mono text-[14px] text-[#FF6B35] tracking-[0.5px]">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] bg-[#D6E264] hover:bg-[#c9d64f] disabled:opacity-40 transition-colors cursor-pointer border-none font-grotesk text-[14px] font-normal text-[#0A0A0A] tracking-[2px] mt-2"
                >
                  {loading
                    ? "PLEASE WAIT..."
                    : mode === "magic"
                    ? "SEND MAGIC LINK →"
                    : "SIGN IN →"}
                </button>

                {mode === "magic" && (
                  <p className="font-ibm-mono text-[14px] text-[#444] text-center tracking-[0.5px]">
                    No password required. We email you a secure one-time link.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="font-ibm-mono text-[14px] text-[#333] text-center mt-6 tracking-[1px]">
          VAZGRO LTD · LONDON, UK ·{" "}
          <a href="/privacy" className="hover:text-[#F0F0EA] transition-colors">PRIVACY</a>
          {" "}·{" "}
          <a href="/terms" className="hover:text-[#F0F0EA] transition-colors">TERMS</a>
        </p>
      </div>
    </div>
  );
}
