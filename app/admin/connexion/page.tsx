"use client";

import { ArrowLeft, LockKeyhole } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.message || "Connexion impossible.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="admin-login-page">
      <Link className="back-link" href="/"><ArrowLeft aria-hidden="true" />Retour au site</Link>
      <section className="login-panel">
        <Image unoptimized src="/images/brand/jcd-logo.png" alt="Journée du Comportement Durable" width={800} height={800} priority />
        <div className="login-icon"><LockKeyhole aria-hidden="true" /></div>
        <h1>Espace administrateur</h1>
        <p>Connectez-vous avec le compte autorisé dans Supabase.</p>
        <form onSubmit={login}>
          <label>Email<input name="email" type="email" autoComplete="username" required /></label>
          <label>Mot de passe<input name="password" type="password" autoComplete="current-password" required /></label>
          <button className="button button-primary" disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</button>
          <p className="login-message" aria-live="polite">{message}</p>
        </form>
      </section>
    </main>
  );
}
