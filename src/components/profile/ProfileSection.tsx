import { APIUser } from "@/src/api_utils/APIUserUtils"
import { User } from "lucide-react"
import { useEffect, useState } from "react"

interface UserProfile {
  id: string
  name: string
  email: string
}

interface FormState {
  name: string
  email: string
  password: string
  confirmPassword: string
}

function InputField({
  id, label, type = "text", value, onChange, autoComplete, placeholder, hint,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  autoComplete?: string
  placeholder?: string
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#EFBBFF]/50">
        {label}
        {hint && <span className="normal-case text-[#EFBBFF]/30 tracking-normal">{hint}</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full bg-[#1a0a2e] border border-[#3d1a6e] rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#BE29EC] focus:ring-1 focus:ring-[#BE29EC]/30 transition-all"
      />
    </div>
  )
}

export function ProfileSection() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "", confirmPassword: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await APIUser.getMe()
        setUser({ id: response.id, name: response.name, email: response.email })
        setForm((f) => ({ ...f, name: response.name, email: response.email }))
      } catch {
        setError("Failed to load profile.")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (form.password && form.password !== form.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const payload: { name?: string; email?: string; password?: string } = {}
      if (form.name !== user.name) payload.name = form.name
      if (form.email !== user.email) payload.email = form.email
      if (form.password) payload.password = form.password

      if (Object.keys(payload).length === 0) {
        setError("No changes to save.")
        setSaving(false)
        return
      }

      await APIUser.updateProfile(user.id, payload)
      setUser((u) => u ? { ...u, name: form.name, email: form.email } : u)
      setForm((f) => ({ ...f, password: "", confirmPassword: "" }))
      setSuccess(true)
    } catch {
      setError("Failed to save changes. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section
      aria-labelledby="profile-heading"
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-[clamp(1.5rem,5vw,4rem)] pt-24 pb-20"
    >
      <div className="w-full max-w-xl mx-auto">

        <div className="flex justify-center items-center mb-6">
          <User className="w-24 h-24 sm:w-28 sm:h-28" />
        </div>

        <h2
          id="profile-heading"
          className="text-white tracking-tight leading-[1.1] mb-4"
          style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
        >
          Your profile, your way.
        </h2>

        <p className="text-base text-[#EFBBFF]/60 leading-relaxed mb-8 px-2">
          Customize your profile to showcase your unique identity and make a lasting impression on your connections.
        </p>

        <div className="bg-[#2d1052] border border-[#3d1a6e] rounded-3xl px-6 py-8 sm:px-10 sm:py-10 text-left flex flex-col gap-6">

          {error && (
            <div role="alert" className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <span aria-hidden="true">⚠</span> {error}
            </div>
          )}
          {success && (
            <div role="status" className="px-4 py-3 rounded-xl bg-[#48CB9D]/10 border border-[#48CB9D]/30 text-[#48CB9D] text-sm flex items-center gap-2">
              <span aria-hidden="true">✓</span> Profile updated successfully.
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 rounded-full border-2 border-[#D896FF] border-t-transparent animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

              <div className="flex flex-col gap-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#48CB9D]">Account info</p>
                <InputField id="name" label="Name" value={form.name} onChange={handleChange} autoComplete="name" />
                <InputField id="email" label="Email" type="email" value={form.email} onChange={handleChange} autoComplete="email" />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#3d1a6e]" />
                <span className="text-xs text-[#EFBBFF]/30 uppercase tracking-widest">Security</span>
                <div className="flex-1 h-px bg-[#3d1a6e]" />
              </div>

              <div className="flex flex-col gap-4">
                <InputField
                  id="password"
                  label="New password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  hint="(leave blank to keep current)"
                />
                <InputField
                  id="confirmPassword"
                  label="Confirm new password"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#BE29EC] text-white font-semibold py-3.5 rounded-xl text-sm tracking-tight hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                    Saving...
                  </span>
                ) : "Save changes"}
              </button>

            </form>
          )}
        </div>
      </div>
    </section>
  )
}