"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import userProfile from "@/data/hubs/user_profile.json";
import { User, Mail, Phone, Lock, Save } from "lucide-react";

export default function ProfileCard() {
  const t = useTranslations("dashboard.profile");
  const user = userProfile.user;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirm) return;
    setPasswordForm({ current: "", newPassword: "", confirm: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {saved && (
        <div className="mb-4 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
          {t("saved")}
        </div>
      )}

      {/* Avatar & Name Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-bold">
          {user.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500">
            {t("memberSince")}: {user.memberSince}
          </p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="ml-auto px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          {editing ? t("cancel") : t("edit")}
        </button>
      </div>

      {/* Profile Fields */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-gray-400" />
          <label className="text-sm text-gray-500 w-20">{t("name")}</label>
          {editing ? (
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <span className="text-sm text-gray-900">{user.name}</span>
          )}
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Mail className="w-5 h-5 text-gray-400" />
          <label className="text-sm text-gray-500 w-20">{t("email")}</label>
          {editing ? (
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <span className="text-sm text-gray-900">{user.email}</span>
          )}
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Phone className="w-5 h-5 text-gray-400" />
          <label className="text-sm text-gray-500 w-20">{t("phone")}</label>
          {editing ? (
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <span className="text-sm text-gray-900">{user.phone}</span>
          )}
        </div>

        {editing && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            {t("saveChanges")}
          </button>
        )}
      </div>

      {/* Password Change Section */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
          <Lock className="w-4 h-4" />
          {t("changePassword")}
        </h3>
        <div className="space-y-3 max-w-md">
          <input
            type="password"
            placeholder={t("currentPassword")}
            value={passwordForm.current}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, current: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder={t("newPassword")}
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder={t("confirmPassword")}
            value={passwordForm.confirm}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, confirm: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handlePasswordChange}
            disabled={
              !passwordForm.current ||
              !passwordForm.newPassword ||
              !passwordForm.confirm
            }
            className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t("updatePassword")}
          </button>
        </div>
      </div>
    </div>
  );
}
