"use client"

// App.tsx 

import { useAuth } from "@/providers/authentication";
import { useState } from "react";

 
export const AuthTest = () => {
  const { user, state, login, register, logout, error } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  if (state === "checking") return <p>Loading...</p>;

  if (user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-[400px] text-center">
        <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
        <p className="text-gray-700 mb-2">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-gray-700 mb-6">
          <strong>UID:</strong> {user.uid}
        </p>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      {/* --- Login Form --- */}
      <div className="bg-white p-6 rounded-lg shadow-md w-[300px]">
        <h2 className="text-lg font-semibold mb-4 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          className="w-full border rounded-md p-2 mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          className="w-full border rounded-md p-2 mb-4"
        />
        <button
          onClick={() => login(loginEmail, loginPassword)} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
        >
          Login
        </button>
      </div>

      {/* --- Register Form --- */}
      <div className="bg-white p-6 rounded-lg shadow-md w-[300px]">
        <h2 className="text-lg font-semibold mb-4 text-center">Register</h2>
        <input
          type="email"
          placeholder="Email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
          className="w-full border rounded-md p-2 mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          className="w-full border rounded-md p-2 mb-4"
        />
        <button
          onClick={() => register(registerEmail, registerPassword)} 
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
        >
          Register
        </button>
      </div>

      {/* --- Error message --- */}
      {error && (
        <p className="absolute bottom-4 text-red-500 text-center w-full">
          {error}
        </p>
      )}
    </div>
  );
}


export default AuthTest;