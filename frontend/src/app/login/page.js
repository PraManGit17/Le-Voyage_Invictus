"use client"

import { useState } from "react"
import { login } from "../../lib/api"

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await login({ email, password })

    localStorage.setItem("token", res.token)

    console.log(res)
  }

  return (

    <div className="p-10 max-w-md mx-auto">

      <h1 className="text-xl font-bold mb-4">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <input
          type="email"
          placeholder="Email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex border">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="p-2 flex-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </button>

        </div>

        <button className="bg-black text-white p-2">
          Login
        </button>

      </form>

    </div>
  )
}