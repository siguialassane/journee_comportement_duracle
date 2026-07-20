import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Download, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { getDataClient } from "@/lib/supabase";
import { REGISTRATIONS_TABLE } from "@/lib/tables";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Votre inscription | Journée du Comportement Durable",
  description: "Consultez votre inscription et téléchargez le document officiel de l’événement.",
  robots: { index: false, follow: false },
};

type ReservationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReservationPage({ params }: ReservationPageProps) {
  const { id } = await params;
  const registrationId = decodeURIComponent(id).trim().toLowerCase();

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(registrationId)) notFound();

  const client = getDataClient();
  if (!client) throw new Error("La vérification des inscriptions est temporairement indisponible.");

  const { data, error } = await client
    .from(REGISTRATIONS_TABLE)
    .select("first_name")
    .eq("id", registrationId)
    .maybeSingle();

  if (error) throw new Error("Impossible de vérifier cette inscription.");
  if (!data) notFound();

  return (
    <main className="reservation-page">
      <section className="reservation-card" aria-labelledby="reservation-title">
        <Link className="reservation-page-logo" href="/" aria-label="Retour à l’accueil">
          <Image
            unoptimized={process.env.NODE_ENV === "development"}
            src="/images/brand/jcd-logo-header.png"
            alt="Journée du Comportement Durable"
            width={480}
            height={152}
            priority
          />
        </Link>

        <p className="reservation-kicker">Inscription confirmée</p>
        <h1 id="reservation-title">Votre document officiel est prêt.</h1>
        <p className="reservation-welcome">
          Bonjour <strong>{data.first_name}</strong>, vous pouvez télécharger ci-dessous le document officiel de l’événement.
        </p>

        <div className="reservation-event-details">
          <span><CalendarDays aria-hidden="true" />10 et 11 septembre 2026</span>
          <span><MapPin aria-hidden="true" />Abidjan, Côte d’Ivoire</span>
        </div>

        <a className="button button-accent reservation-download" href="/documents/journee-comportement-durable-2026.pdf" download>
          <Download aria-hidden="true" />Télécharger le PDF de l’événement
        </a>

        <p className="reservation-help">
          Une question ? Écrivez à <a href="mailto:assistante_event@differencegroup.info">assistante_event@differencegroup.info</a>.
        </p>
      </section>
    </main>
  );
}
