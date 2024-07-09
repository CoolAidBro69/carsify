import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    try {
      if (data.username && data.email && data.password) {
        setLoading(true);
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const resp = await response.json();
        if (resp.success === false) {
          setError(resp.message);
          setLoading(false);
          return;
        }
        setError(null);
        setLoading(false);
        navigate("/sign-in");
      } else {
        setError("All fields are required");
        return;
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }
  function handleChange(e) {
    {
      setData({
        ...data,
        [e.target.id]: e.target.value,
      });
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-8">Sign Up</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-gray-600 text-white p-3 rounded-lg hover:opacity-90 disabled:opacity-80"
        >
          {loading ? "Signing up....." : "Sign up"}
        </button>
      </form>
      <div className="gap-2 mt-5">
        Have an account?{" "}
        <Link to="/sign-in" className="text-blue-500">
          Sign in
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
