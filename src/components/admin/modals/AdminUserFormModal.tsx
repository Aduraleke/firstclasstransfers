// src/components/admin/modals/AdminUserFormModal.tsx
"use client";

import { useState } from "react";
import { AdminUser } from "@/lib/admin/types";
import { Icon } from "@iconify/react";

interface AdminUserFormModalProps {
  open: boolean;
  onSubmit: (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "super_admin" | "admin";
    permissions: AdminUser["permissions"];
  }) => void;
  onClose: () => void;
}

export const AdminUserFormModal: React.FC<AdminUserFormModalProps> = ({
  open,
  onSubmit,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"super_admin" | "admin">("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [permissions, setPermissions] = useState<AdminUser["permissions"]>({
    bookings: true,
    drivers: true,
    payments: false,
    routes: true,
    pricing: false,
    adminUsers: false,
    settings: false,
  });

  if (!open) return null;

  const handleTogglePerm = (key: keyof AdminUser["permissions"]) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    onSubmit({ name, email, phone, password, role, permissions });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-semibold text-white">Add Admin User</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="mb-1 block text-slate-300">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-slate-300">Phone (optional)</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-slate-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 pr-10 text-sm text-white outline-none focus:border-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-slate-400"
              >
                <Icon
                  icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                  className="text-lg"
                />
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-slate-300">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "super_admin" | "admin")}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Permissions
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(Object.keys(permissions) as (keyof AdminUser["permissions"])[]).map((key) => (
                <label key={key} className="flex items-center gap-2 text-slate-200">
                  <input
                    type="checkbox"
                    checked={permissions[key]}
                    onChange={() => handleTogglePerm(key)}
                    className="h-3 w-3 rounded border-slate-500 bg-slate-900"
                  />
                  <span className="capitalize">{key}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
