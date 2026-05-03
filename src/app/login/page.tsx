"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const { data: session } = useSession();
  const { user: mockUser, login: mockLogin } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Already logged in — redirect via effect
  useEffect(() => {
    if (session?.user || mockUser) router.replace("/");
  }, [session, mockUser, router]);

  if (session?.user || mockUser) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { 
      setError("Please enter both email and password."); 
      return; 
    }
    setLoading(true);
    setError("");

    const lowerEmail = email.toLowerCase().trim();
    const isDemoEmail = lowerEmail.endsWith("@demo.com") || ["admin", "seller", "user"].includes(lowerEmail);

    try {
      // If it's a demo account, try mock login FIRST for instant results
      // But DON'T return early, we still want to call signIn for a real session
      if (isDemoEmail) {
        mockLogin(email, password);
      }

      const res = await signIn("email-password", {
        redirect: false,
        email,
        password,
      });

      if (res?.ok) {
        setLoading(false);
        router.replace("/");
        return;
      }

      // If NextAuth fails, try mock login as final fallback
      const mockRes = mockLogin(email, password);
      setLoading(false);
      if (mockRes.success) {
        router.replace("/");
      } else {
        setError(res?.error || mockRes.error || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const mockRes = mockLogin(email, password);
      setLoading(false);
      if (mockRes.success) {
        router.replace("/");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { redirect: true, callbackUrl: "/" });
    } catch (error) {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Logo */}
      <div className="flex justify-center pt-10 pb-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tighter bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
          <span className="text-3xl [filter:none]">🛕</span>
          Bihar Bazaar
        </Link>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center px-4 pb-10">
        <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-black/12 dark:border-white/8 rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-medium mb-5">Sign in</h1>

          {error && (
            <div className="mb-4 px-3 py-2 rounded border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800/40 text-sm text-red-700 dark:text-red-400">
              ⚠️ {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-2.5 mb-4 border border-black/20 dark:border-white/20 rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {googleLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-zinc-900 text-black/50 dark:text-white/50">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-1">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white dark:bg-zinc-800 transition"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-1">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white dark:bg-zinc-800 transition"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-1 bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-sm rounded-lg border border-amber-500/40 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading && <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
              {loading ? "Signing in..." : "Continue"}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5">
            <p className="text-center text-[10px] font-bold uppercase tracking-widest opacity-30 mb-4">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setEmail("admin"); setPassword("admin123"); }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-400/20 hover:scale-[1.02] transition-transform group"
              >
                <span className="text-xl mb-1 group-hover:animate-bounce">👑</span>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Admin Login</span>
              </button>
              <button
                onClick={() => { setEmail("seller"); setPassword("seller123"); }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-400/20 hover:scale-[1.02] transition-transform group"
              >
                <span className="text-xl mb-1 group-hover:animate-bounce">🏪</span>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Seller Login</span>
              </button>
            </div>
            <p className="text-center text-[10px] opacity-40 mt-3 italic">Click to autofill, then click 'Continue'</p>
          </div>

          <p className="text-xs text-black/50 dark:text-white/40 mt-3 leading-relaxed">
            By continuing, you agree to Bihar Bazaar&apos;s{" "}
            <span className="text-primary cursor-pointer hover:underline">Conditions of Use</span> and{" "}
            <span className="text-primary cursor-pointer hover:underline">Privacy Notice</span>.
          </p>
        </div>

        {/* New to Bihar Bazaar */}
        <div className="w-full max-w-sm flex items-center gap-2 my-5">
          <div className="flex-1 h-px bg-black/12 dark:bg-white/10" />
          <span className="text-xs text-black/40 dark:text-white/35 whitespace-nowrap">New to Bihar Bazaar?</span>
          <div className="flex-1 h-px bg-black/12 dark:bg-white/10" />
        </div>

        <div className="w-full max-w-sm">
          <Link
            href="/register"
            className="w-full block text-center py-2.5 border border-black/20 dark:border-white/20 rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 shadow-sm"
          >
            Create your Bihar Bazaar account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/8 dark:border-white/8 py-5">
        <div className="flex justify-center gap-5 text-xs text-black/40 dark:text-white/30">
          <span className="hover:underline cursor-pointer">Conditions of Use</span>
          <span className="hover:underline cursor-pointer">Privacy Notice</span>
          <span className="hover:underline cursor-pointer">Help</span>
        </div>
        <p className="text-center text-xs text-black/30 dark:text-white/20 mt-2">© 2025 Bihar Bazaar</p>
      </footer>
    </div>
  );
}
