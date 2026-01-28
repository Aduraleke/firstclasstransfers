"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import planeIcon from "@iconify/icons-mdi/airplane";
import lockIcon from "@iconify/icons-mdi/lock-outline";
import emailIcon from "@iconify/icons-mdi/email-outline";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/api/admin/auth";
import { useAuthStore } from "@/lib/api/admin/auth/authStore";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const login = useAuthStore((s) => s.login);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  const form = new FormData(e.currentTarget);
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  try {
    const res = await loginAdmin({ email, password });
    console.log("LOGIN RESPONSE:", res);

    const accessToken = res.tokens?.access;
    if (!accessToken) {
      throw new Error("Invalid login response from server.");
    }

    const mapPermissions = (
      perms: string[] = [],
      isSuperuser: boolean
    ) => ({
      bookings: isSuperuser || perms.includes("booking"),
      drivers: isSuperuser || perms.includes("drivers"),
      routes: isSuperuser || perms.includes("routes"),
      adminUsers: isSuperuser || perms.includes("adminUsers"),
      vehicles: isSuperuser || perms.includes("vehicles"),
    });

    const admin = {
      email,
      isSuperuser: res.isSuperuser,
      isDriver: res.isDriver, // 👈 keep this for role checks
      permissions: mapPermissions(res.permissions, res.isSuperuser),
    };

    login({
      token: accessToken,
      admin,
    });

    // ✅ ROLE-BASED REDIRECT
    if (res.isDriver) {
      router.push("/drivers");
    } else {
      router.push("/admin");
    }
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message || "The email or password you entered is incorrect.");
    } else {
      setError("Unable to sign in right now. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-[#020513] text-white flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(circle at 0% 0%, rgba(22,44,75,0.7), transparent 60%), radial-gradient(circle at 100% 100%, rgba(176,114,8,0.5), transparent 60%)",
          }}
        />
      </div>

      <div className="relative w-full max-w-5xl grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
        {/* LEFT: Brand / copy */}
        <div className="space-y-5">
          <div className="inline-flex items-center gap-3 rounded-3xl bg-black/50 border border-white/10 px-3 py-3 sm:px-4 sm:py-4 backdrop-blur shadow-[0_18px_45px_rgba(0,0,0,0.7)]">
            <div className="relative flex items-center justify-center h-12 w-28 sm:h-14 sm:w-36 bg-white rounded-2xl shadow-sm">
              <Image
                src="/firstclass.png"
                alt="First Class logo"
                width={190}
                height={60}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/75">
                First Class Transfers
              </p>
              <p className="text-xs text-white/60 max-w-xs">
                Admin control center for fixed-price airport transfers across
                Cyprus. Larnaka (LCA) &amp; Paphos (PFO).
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">
              Sign in to Dispatch Panel
            </h1>
            <p className="text-sm text-white/70 max-w-md">
              Monitor bookings, update prices, and assign drivers in real-time.
              This area is restricted to authorized First Class staff.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] text-white/60">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
              <Icon icon={planeIcon} width={14} height={14} />
              <span>LCA · PFO airport coverage</span>
            </div>
            <span className="h-px w-8 bg-white/20" />
            <span>24/7 fixed-price transfer service</span>
          </div>
        </div>

        {/* RIGHT: Login card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-black/70 border border-white/10 backdrop-blur px-4 py-5 sm:px-6 sm:py-7 shadow-[0_18px_50px_rgba(0,0,0,0.8)]"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.22em] text-white/55">
                Admin Login
              </p>
              <p className="text-[11px] text-white/60">
                Use your dispatch email and password provided by the
                administrator.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs text-white/75 flex items-center gap-1.5"
                >
                  <Icon icon={emailIcon} width={14} height={14} />
                  Admin Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={() => error && setError(null)}
                  required
                  className="w-full rounded-2xl border border-white/15 bg-black/50 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-[#b07208] focus:ring-offset-2 focus:ring-offset-[#020513]"
                  placeholder="admin@firstclasstransfers.eu"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs text-white/75 flex items-center gap-1.5"
                >
                  <Icon icon={lockIcon} width={14} height={14} />
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={() => error && setError(null)}
                  required
                  className="w-full rounded-2xl border border-white/15 bg-black/50 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-[#b07208] focus:ring-offset-2 focus:ring-offset-[#020513]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/65">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border border-white/30 bg-black/40 text-[#b07208]"
                />
                <span>Remember this device</span>
              </label>
              <button
                type="button"
                className="text-white/70 hover:text-white underline underline-offset-4"
              >
                Forgot password?
              </button>
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.01, y: -1 } : {}}
              whileTap={!loading ? { scale: 0.98, y: 0 } : {}}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-[0_12px_30px_rgba(0,0,0,0.7)] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #b07208, #162c4b)",
                color: "#ffffff",
              }}
            >
              {loading ? "Signing in..." : "Sign in to Admin"}
            </motion.button>

            <p className="text-[10px] text-white/55 pt-1">
              For security reasons, never share your admin credentials with
              drivers or customers.
            </p>

            <div className="pt-2 border-t border-white/10 mt-2 text-[10px] text-white/50">
              <p>
                Need help? Contact system admin at{" "}
                <Link
                  href="mailto:booking@firstclasstransfers.eu"
                  className="underline underline-offset-4 decoration-white/30 hover:text-white"
                >
                  booking@firstclasstransfers.eu
                </Link>
                .
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
