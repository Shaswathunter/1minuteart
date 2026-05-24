import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, authLoading } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const onChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/progress");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="mx-auto max-w-xl">
      <motion.form
        className="glass-card space-y-4"
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="neo-subbrand w-fit">NEOROX Arts Access</p>
        <h1 className="font-logo text-4xl uppercase tracking-[0.12em]">Login</h1>
        {error ? <p className="rounded-xl border border-ember/30 bg-ember/10 px-3 py-2 text-sm text-ember">{error}</p> : null}
        <div>
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="field-input"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="field-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="field-input"
            value={form.password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={authLoading}>
          {authLoading ? "Please wait..." : "Login"}
        </button>
      </motion.form>
      <p className="mt-3 text-sm text-slate-300">
        New user? <Link to="/register">Create account</Link>
      </p>
    </section>
  );
}
