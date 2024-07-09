import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFail,
} from "../redux/user/userSlice";

export default function SignIn() {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  async function onSubmit(e) {
    e.preventDefault();
    try {
      if (data.email && data.password) {
        dispatch(signInStart());
        const response = await fetch("/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const resp = await response.json();
        if (resp.success === false) {
          dispatch(signInFail(resp.message));
          return;
        }
        dispatch(signInSuccess(resp));
        navigate("/");
      } else {
        dispatch(signInFail("All fields are required"));
        return;
      }
    } catch (err) {
      dispatch(signInFail(err.message));
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
      <h1 className="text-3xl text-center font-semibold my-8">Sign In</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
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
          {loading ? "Signing in....." : "Sign in"}
        </button>
      </form>
      <div className="gap-2 mt-5">
        Don't have an account?{" "}
        <Link to="/sign-up" className="text-blue-500">
          Sign Up
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
