"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { UserProfile } from "@/types/auth.types";

export default function ProfilePage() {
  const supabase = createClient();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();

  const [form, setForm] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // The auth context already fetched the profile once (no separate
  // getUser()/profile query here, which used to race the session hydrating
  // after login/navigation and show "Not logged in" until a hard refresh).
  // We just mirror it into local editable form state.
  useEffect(() => {
    if (profile) {
      setForm(profile);
    }
  }, [profile]);

  async function handleSave() {
    if (!form) return;
    setError("");
    setSuccess("");

    if (!form.name || form.name.trim().length === 0) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        name: form.name,
        email: form.email,
        dob: form.dob,
        gender: form.gender,
      })
      .eq("id", form.id);
    setSaving(false);

    if (error) return setError(error.message);
    await refreshProfile();
    setSuccess("Profile updated");
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !form) return;

    setError("");
    const filePath = `${form.id}/profile.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) return setError(uploadError.message);

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // cache-bust so the new photo shows immediately instead of a cached old one
    const photoUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ photo_url: photoUrl })
      .eq("id", form.id);

    if (updateError) return setError(updateError.message);
    setForm({ ...form, photo_url: photoUrl });
    await refreshProfile();
  }

  if (authLoading) {
    return <div className="p-8 text-sm text-gray-500">Loading profile…</div>;
  }

  if (!user) {
    return (
      <div className="p-8 text-sm text-red-600">
        You need to be logged in to view your profile.
      </div>
    );
  }

  if (!form) {
    return (
      <div className="p-8 text-sm text-red-600">Could not load profile.</div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400 text-xs">
          {form.photo_url ? (
            <img
              src={form.photo_url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            "No photo"
          )}
        </div>
        <label className="text-sm text-gray-700 cursor-pointer underline">
          Change photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Phone</label>
          <input
            type="text"
            value={form.phone}
            disabled
            className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Name *</label>
          <input
            type="text"
            value={form.name ?? ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 text-black"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Email</label>
          <input
            type="email"
            value={form.email ?? ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 text-black"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Date of birth
          </label>
          <input
            type="date"
            value={form.dob ?? ""}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 text-black"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Gender</label>
          <select
            value={form.gender ?? ""}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 text-black"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {error && <p className="text-xs text-red-600 mt-4">{error}</p>}
      {success && <p className="text-xs text-green-600 mt-4">{success}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-40 mt-6"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
