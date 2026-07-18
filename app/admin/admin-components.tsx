"use client";

import { LogOut, MailCheck, Power } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegistrationToggle({ open }: { open: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationOpen: !open }),
    });
    setLoading(false);
    router.refresh();
  }

  return <button className={`status-control ${open ? "open" : "closed"}`} onClick={toggle} disabled={loading}><Power aria-hidden="true" />{loading ? "Mise à jour..." : open ? "Inscriptions ouvertes" : "Inscriptions fermées"}</button>;
}

export function ResendButton({ id, disabled }: { id: string; disabled: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function resend() {
    setLoading(true);
    await fetch(`/api/admin/registrations/${id}/resend`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return <button className="resend-button" onClick={resend} disabled={disabled || loading} title="Renvoyer la confirmation"><MailCheck aria-hidden="true" />{loading ? "Envoi..." : "Relancer"}</button>;
}

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/connexion");
    router.refresh();
  }
  return <button className="logout-button" onClick={logout}><LogOut aria-hidden="true" />Déconnexion</button>;
}
