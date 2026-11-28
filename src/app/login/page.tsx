"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message === "Invalid login credentials" ? "E-mail ou mot de passe incorrect." : error.message);
      return;
    }
    // Navigation complète : le serveur doit relire le cookie de session tout juste posé.
    window.location.href = "/";
  }

  return (
    <main className="login">
      <form className="card login-card" onSubmit={submit}>
        <p className="brand">LES ACACIAS <small>Tableau de bord</small></p>
        <h1>Connexion</h1>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="text" inputMode="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="password">Mot de passe</label>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="msg err" role="alert">{error}</p>}
        <button type="submit" className="primary" disabled={loading}>{loading ? "Connexion…" : "Se connecter"}</button>
      </form>
    </main>
  );
}
