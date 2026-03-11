"use client"

import { useState } from "react"
import { signup } from "../../lib/api"

export default function Signup() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    preferences: ""
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await signup({
      ...form,
      preferences: form.preferences.split(",").map(p => p.trim())
    })

    console.log(res)
  }

  return (

    <div className="p-10 max-w-md mx-auto">

      <h1 className="text-xl font-bold mb-4">Signup</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <input
          placeholder="Name"
          className="border p-2"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="border p-2"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <div className="flex border">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="p-2 flex-1"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="button"
            className="px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </button>

        </div>

        <input
          placeholder="Preferences (comma separated)"
          className="border p-2"
          value={form.preferences}
          onChange={(e) =>
            setForm({ ...form, preferences: e.target.value })
          }
        />

        <button className="bg-black text-white p-2">
          Create Account
        </button>

      </form>

    </div>
  )
}