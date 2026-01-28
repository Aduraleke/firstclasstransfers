"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import lockIcon from "@iconify/icons-mdi/lock-outline";
import emailIcon from "@iconify/icons-mdi/email-outline";
import steeringIcon from "@iconify/icons-mdi/steering";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { loginAdmin } from "@/lib/api/admin/auth";
import { useDriverAuthStore } from "@/lib/api/drivers/driverAuthStore";

export default function DriverLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const loginDriver = useDriverAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      const res = await loginAdmin({ email, password });
      const accessToken = res.tokens?.access;

      console.log("LOGIN RESPONSE:", res);

      if (!accessToken) {
        throw new Error("Invalid login response.");
      }

      // 🚫 BLOCK NON-DRIVERS
      if (!res.isDriver) {
        throw new Error("This account is not registered as a driver.");
      }

      // ✅ DRIVER AUTH ONLY
      loginDriver({
        token: accessToken,
        driver: {
          role: "driver",
          email,
        },
      });

      router.push("/drivers");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050814] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* BRAND */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#b07208]/15 ring-1 ring-[#b07208]/30">
            <Icon icon={steeringIcon} className="text-2xl text-[#b07208]" />
          </div>

          <h1 className="text-xl font-semibold text-white">Driver Login</h1>
          <p className="mt-1 text-sm text-white/60">
            Sign in to view and manage your assigned trips
          </p>
        </div>

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-black/60 border border-white/10 px-6 py-6 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs text-white/70">
                <Icon icon={emailIcon} width={14} />
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                onChange={() => error && setError(null)}
                placeholder="driver@company.com"
                className="w-full rounded-xl bg-black/50 border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b07208]"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs text-white/70">
                <Icon icon={lockIcon} width={14} />
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                onChange={() => error && setError(null)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-black/50 border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b07208]"
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="
                mt-2 w-full rounded-xl bg-[#b07208] py-2.5
                text-sm font-semibold text-black
                hover:brightness-110
                disabled:opacity-60
                transition
              "
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </motion.div>

        {/* FOOTER */}
        <p className="mt-6 text-center text-[11px] text-white/50">
          Trouble signing in? Contact dispatch at{" "}
          <Link
            href="mailto:booking@firstclasstransfers.eu"
            className="underline underline-offset-4"
          >
            booking@firstclasstransfers.eu
          </Link>
        </p>
      </div>
    </div>
  );
}
