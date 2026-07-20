import { Search } from "lucide-react";
import { requireAdmin } from "../../lib/admin-auth";
import { getDataClient } from "../../lib/supabase";
import { REGISTRATIONS_TABLE, SETTINGS_TABLE } from "../../lib/tables";
import { LogoutButton, RegistrationToggle, ResendButton } from "./admin-components";
import Image from "next/image";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; statut?: string; page?: string }>;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireAdmin();
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const pageSize = 25;
  const status = ["pending", "sent", "failed"].includes(params.statut || "") ? params.statut! : "";
  const search = (params.q || "").trim();
  const client = getDataClient();

  if (!client) {
    return <main className="admin-empty"><h1>Configuration requise</h1><p>Ajoutez les variables Supabase avant d’utiliser l’administration.</p></main>;
  }

  let query = client.from(REGISTRATIONS_TABLE).select("*", { count: "exact" });
  if (status) query = query.eq("email_status", status);
  if (search) {
    const safe = search.replace(/[%_,().]/g, " ").trim();
    query = query.or(`first_name.ilike.%${safe}%,last_name.ilike.%${safe}%,email.ilike.%${safe}%,whatsapp.ilike.%${safe}%,company.ilike.%${safe}%`);
  }
  const from = (page - 1) * pageSize;
  const { data = [], count = 0 } = await query.order("created_at", { ascending: false }).range(from, from + pageSize - 1);
  const { data: settings } = await client.from(SETTINGS_TABLE).select("registration_open").eq("id", 1).maybeSingle();
  const registrationOpen = settings?.registration_open !== false;
  const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize));
  const registrations = data ?? [];
  const sentCount = registrations.filter((row) => row.email_status === "sent").length;
  const failedCount = registrations.filter((row) => row.email_status === "failed").length;

  const pageHref = (target: number) => {
    const queryParams = new URLSearchParams();
    if (search) queryParams.set("q", search);
    if (status) queryParams.set("statut", status);
    queryParams.set("page", String(target));
    return `/admin?${queryParams}`;
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div><Image unoptimized={process.env.NODE_ENV === "development"} src="/images/brand/jcd-logo.png" alt="" width={800} height={800} /><span>Administration</span></div>
        <div><small>{user.email}</small><LogoutButton /></div>
      </header>
      <section className="admin-content">
        <div className="admin-title-row">
          <div><p>Journée du Comportement Durable 2026</p><h1>Inscriptions</h1></div>
          <RegistrationToggle open={registrationOpen} />
        </div>
        <div className="admin-stats">
          <div><span>Total</span><strong>{count || 0}</strong></div>
          <div><span>Confirmations sur cette page</span><strong>{sentCount}</strong></div>
          <div><span>Échecs sur cette page</span><strong>{failedCount}</strong></div>
        </div>
        <form className="admin-filters">
          <label><Search aria-hidden="true" /><span className="sr-only">Rechercher</span><input name="q" defaultValue={search} placeholder="Nom, email, WhatsApp ou entreprise" /></label>
          <select name="statut" defaultValue={status} aria-label="Filtrer par statut email">
            <option value="">Tous les statuts</option><option value="sent">Envoyé</option><option value="pending">En attente</option><option value="failed">Échec</option>
          </select>
          <button className="button button-primary">Filtrer</button>
        </form>
        <div className="admin-table-wrap">
          <table>
            <thead><tr><th>Participant</th><th>Contact</th><th>Fonction</th><th>Entreprise</th><th>Email</th><th>Inscrit le</th><th>Action</th></tr></thead>
            <tbody>
              {registrations.length === 0 ? <tr><td colSpan={7} className="empty-row">Aucune inscription ne correspond à cette recherche.</td></tr> : registrations.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.first_name} {row.last_name}</strong></td>
                  <td><a href={`mailto:${row.email}`}>{row.email}</a><small>{row.whatsapp}</small></td>
                  <td>{row.job_title}</td><td>{row.company}</td>
                  <td><span className={`email-badge ${row.email_status}`}>{row.email_status === "sent" ? "Envoyé" : row.email_status === "failed" ? "Échec" : "En attente"}</span></td>
                  <td>{formatDate(row.created_at)}</td>
                  <td><ResendButton id={row.id} disabled={row.email_status === "sent"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <nav className="pagination" aria-label="Pagination">
          <a aria-disabled={page <= 1} href={page > 1 ? pageHref(page - 1) : undefined}>Précédent</a>
          <span>Page {page} sur {totalPages}</span>
          <a aria-disabled={page >= totalPages} href={page < totalPages ? pageHref(page + 1) : undefined}>Suivant</a>
        </nav>
      </section>
    </main>
  );
}
