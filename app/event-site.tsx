"use client";

import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Handshake,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Recycle,
  Users,
  X,
} from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import Image from "next/image";

type ProgramItem = { time: string; title: string; detail?: string };

const dayOne: ProgramItem[] = [
  { time: "08h30 - 09h30", title: "Accueil des participants et installation" },
  {
    time: "09h30 - 10h00",
    title: "Cérémonie d'ouverture officielle",
    detail: "Mot de bienvenue, allocutions des autorités et présentation des objectifs du forum.",
  },
  {
    time: "10h00 - 11h00",
    title: "Conférence inaugurale",
    detail: "Le rôle stratégique des quartiers dans la promotion de la salubrité urbaine durable.",
  },
  { time: "11h00 - 11h30", title: "Pause-café et networking" },
  { time: "11h30 - 13h30", title: "Panel 1", detail: "Mécanismes de collaboration entre autorités et quartiers." },
  { time: "13h30 - 14h30", title: "Pause déjeuner et networking" },
  { time: "14h30 - 15h30", title: "Panel 2", detail: "Comportements urbains et changement durable." },
  { time: "15h30 - 16h30", title: "Panel 3", detail: "Rôle des leaders communautaires et associations." },
];

const dayTwo: ProgramItem[] = [
  { time: "09h30 - 09h45", title: "Rappel des temps forts du Jour 1" },
  {
    time: "09h45 - 10h50",
    title: "Session de partage d'expériences",
    detail: "Témoignages de quartiers, ONG, entreprises et collectivités ayant mené des actions efficaces de salubrité.",
  },
  {
    time: "10h50 - 11h45",
    title: "Panel 4",
    detail: "Identification des actions prioritaires pour améliorer durablement la salubrité dans les quartiers.",
  },
  { time: "11h45 - 13h00", title: "Pause déjeuner" },
  {
    time: "13h00 - 14h00",
    title: "Panel 5",
    detail: "Innovations et initiatives locales : économie circulaire, recyclage et meilleure gestion des déchets.",
  },
  { time: "14h00 - 14h30", title: "Synthèse et orientation de la feuille de route" },
  { time: "19h00 - 23h00", title: "Dîner de remerciements" },
];

const gallery = [
  { src: "/images/gallery/01-accueil.webp", alt: "Accueil et inscription d'un participant lors de la première édition" },
  { src: "/images/gallery/02-delegation.webp", alt: "Délégation et participants réunis dans la salle de conférence" },
  { src: "/images/gallery/03-prise-parole.webp", alt: "Participante prenant la parole avec un microphone" },
  { src: "/images/gallery/04-leader-communautaire.webp", alt: "Leader communautaire partageant son expérience" },
  { src: "/images/gallery/05-panel.webp", alt: "Intervenants réunis pendant un panel" },
  { src: "/images/gallery/06-salle.webp", alt: "Vue d'ensemble de la salle pendant une présentation" },
  { src: "/images/gallery/07-intervenant.webp", alt: "Intervenant au pupitre pendant la première édition" },
  { src: "/images/gallery/08-photo-officielle.webp", alt: "Photo officielle de représentants présents à l'événement" },
];

const partners = [
  { src: "/images/partners/anaged.png", alt: "ANAGED" },
  { src: "/images/partners/ecotisa.png", alt: "Ecoti SA" },
  { src: "/images/partners/ardci.png", alt: "ARDCI" },
  { src: "/images/partners/commune-cocody.png", alt: "Commune de Cocody" },
  { src: "/images/partners/iapol.png", alt: "IAPOL" },
  { src: "/images/partners/cac.png", alt: "CAC" },
  { src: "/images/partners/maison-entrepreneur.png", alt: "La Maison de l'Entrepreneur" },
];

function Program() {
  const [day, setDay] = useState<1 | 2>(1);
  const program = day === 1 ? dayOne : dayTwo;

  return (
    <div className="program-shell">
      <div className="program-tabs" role="tablist" aria-label="Choisir le jour du programme">
        <button className={day === 1 ? "active" : ""} role="tab" aria-selected={day === 1} onClick={() => setDay(1)}>
          <span>Jour 1</span>
          Comprendre et partager
        </button>
        <button className={day === 2 ? "active" : ""} role="tab" aria-selected={day === 2} onClick={() => setDay(2)}>
          <span>Jour 2</span>
          Co-construire et agir
        </button>
      </div>
      <div className="program-list" role="tabpanel">
        {program.map((item) => item.detail ? (
          <details key={`${day}-${item.time}`}>
            <summary>
              <time>{item.time}</time>
              <strong>{item.title}</strong>
              <ChevronRight aria-hidden="true" />
            </summary>
            <p>{item.detail}</p>
          </details>
        ) : (
          <div className="program-row" key={`${day}-${item.time}`}>
            <time>{item.time}</time>
            <strong>{item.title}</strong>
            <span aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Gallery() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(gallery[0]);

  function open(image: (typeof gallery)[number]) {
    setSelected(image);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <div className="gallery-grid">
        {gallery.map((image, index) => (
          <button key={image.src} className={`gallery-item gallery-item-${index + 1}`} onClick={() => open(image)}>
            <Image unoptimized src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 100vw, (max-width: 1060px) 50vw, 25vw" />
            <span>Voir l’image</span>
          </button>
        ))}
      </div>
      <dialog className="lightbox" ref={dialogRef} onClick={(event) => event.target === dialogRef.current && dialogRef.current?.close()}>
        <button className="lightbox-close" onClick={() => dialogRef.current?.close()} aria-label="Fermer l'image">
          <X aria-hidden="true" />
        </button>
        <Image unoptimized src={selected.src} alt={selected.alt} width={1800} height={1200} sizes="100vw" />
        <p>{selected.alt}</p>
      </dialog>
    </>
  );
}

type FormStatus = { type: "idle" | "loading" | "success" | "error"; message?: string; code?: string };

function RegistrationForm() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "loading", message: "Enregistrement en cours..." });
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, consentement: formData.get("consentement") === "on" }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          message:
            data.message ||
            (data.code === "VALIDATION_ERROR"
              ? "Vérifiez les informations saisies."
              : "L'inscription n'a pas pu être enregistrée."),
        });
        return;
      }

      form.reset();
      setStatus({
        type: "success",
        code: data.reservationCode,
        message:
          data.emailStatus === "sent"
            ? "Votre inscription est confirmée. Un email vient de vous être envoyé."
            : "Votre inscription est enregistrée. L'équipe vous transmettra la confirmation par email.",
      });
    } catch {
      setStatus({ type: "error", message: "Connexion impossible. Réessayez dans quelques instants." });
    }
  }

  return (
    <form className="registration-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label>
          Nom
          <input name="nom" autoComplete="family-name" required minLength={2} placeholder="Votre nom" />
        </label>
        <label>
          Prénom
          <input name="prenom" autoComplete="given-name" required minLength={2} placeholder="Votre prénom" />
        </label>
        <label>
          Téléphone WhatsApp
          <input name="whatsapp" type="tel" autoComplete="tel" required placeholder="Ex. 07 00 00 00 00" />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required placeholder="vous@entreprise.com" />
        </label>
        <label>
          Fonction
          <input name="fonction" autoComplete="organization-title" required placeholder="Votre fonction" />
        </label>
        <label>
          Entreprise / organisation
          <input name="entreprise" autoComplete="organization" required placeholder="Ou « Sans entreprise »" />
        </label>
      </div>
      <label className="consent-field">
        <input name="consentement" type="checkbox" required />
        <span>J’accepte que mes informations soient utilisées uniquement pour gérer mon inscription et les communications liées à cet événement.</span>
      </label>
      <label className="website-field" aria-hidden="true">
        Site web
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <button className="button button-accent submit-button" type="submit" disabled={status.type === "loading"}>
        {status.type === "loading" ? "Validation..." : "Confirmer mon inscription"}
        {status.type !== "loading" && <ArrowRight aria-hidden="true" />}
      </button>
      <div className={`form-status ${status.type}`} aria-live="polite">
        {status.type === "success" && <Check aria-hidden="true" />}
        {status.message && (
          <p>
            {status.message}
            {status.code && <strong> Référence : {status.code}</strong>}
          </p>
        )}
      </div>
    </form>
  );
}

export function EventSite() {
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const closeMobileMenu = () => mobileMenuRef.current?.removeAttribute("open");

  return (
    <>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <header className="site-header">
        <a className="brand-link" href="#accueil" aria-label="Accueil - Journée du Comportement Durable">
          <Image unoptimized src="/images/brand/jcd-logo.png" alt="Journée du Comportement Durable" width={800} height={800} priority />
        </a>
        <nav className="desktop-nav" aria-label="Navigation principale">
          <a href="#objectif">Objectif</a>
          <a href="#programme">Programme</a>
          <a href="#edition-passee">Édition précédente</a>
          <a href="#partenaires">Partenaires</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="button button-small button-primary" href="#inscription">Je m’inscris</a>
        <details className="mobile-menu" ref={mobileMenuRef}>
          <summary aria-label="Ouvrir le menu"><Menu aria-hidden="true" /></summary>
          <nav aria-label="Navigation mobile">
            <a href="#objectif" onClick={closeMobileMenu}>Objectif</a>
            <a href="#programme" onClick={closeMobileMenu}>Programme</a>
            <a href="#edition-passee" onClick={closeMobileMenu}>Édition précédente</a>
            <a href="#partenaires" onClick={closeMobileMenu}>Partenaires</a>
            <a href="#contact" onClick={closeMobileMenu}>Contact</a>
          </nav>
        </details>
      </header>

      <main id="contenu">
        <section className="hero" id="accueil">
          <div className="hero-copy">
            <div className="hero-edition"><span>2ᵉ édition</span> Différence Group présente</div>
            <h1>Le pouvoir des quartiers transforme la ville.</h1>
            <p className="hero-theme">Journée du Comportement Durable</p>
            <div className="hero-meta">
              <span><CalendarDays aria-hidden="true" />10 et 11 septembre 2026</span>
              <span><MapPin aria-hidden="true" />Abidjan, Côte d’Ivoire</span>
            </div>
            <p className="hero-intro">Deux jours pour réunir citoyens, collectivités et entreprises autour de solutions concrètes pour des comportements urbains responsables et durables.</p>
            <div className="hero-actions">
              <a className="button button-accent" href="#inscription">Réserver ma place <ArrowRight aria-hidden="true" /></a>
              <a className="text-link" href="#programme">Voir le programme <ChevronRight aria-hidden="true" /></a>
            </div>
          </div>
          <div className="hero-visual" aria-label="Un quartier mobilisé puis transformé">
            <figure className="hero-photo hero-photo-action">
              <Image unoptimized src="/images/hero/quartier-mobilise.webp" alt="Habitants mobilisés pour nettoyer un quartier" width={1024} height={1024} sizes="(max-width: 1060px) 86vw, 44vw" priority />
              <figcaption>Mobiliser</figcaption>
            </figure>
            <figure className="hero-photo hero-photo-result">
              <Image unoptimized src="/images/hero/quartier-propre.webp" alt="Rue résidentielle propre et végétalisée" width={960} height={716} sizes="(max-width: 1060px) 78vw, 34vw" />
              <figcaption>Transformer</figcaption>
            </figure>
          </div>
        </section>

        <section className="objective-section section" id="objectif">
          <div className="section-heading">
            <p>Pourquoi cette journée ?</p>
            <h2>La transformation durable commence au plus près des citoyens.</h2>
          </div>
          <div className="objective-intro">
            <p>La croissance rapide des villes augmente la pression sur la salubrité, les déchets et le cadre de vie. Pourtant, les quartiers possèdent une force décisive : leurs associations, leurs jeunes, leurs femmes, leurs entreprises et leurs leaders peuvent faire évoluer les pratiques au quotidien.</p>
            <p className="objective-callout">L’objectif principal est de créer un cadre de concertation multi-acteurs qui renforce le rôle des quartiers et améliore durablement la qualité de vie urbaine.</p>
          </div>
          <div className="axes-grid">
            <article><span>01</span><Users aria-hidden="true" /><h3>Sensibiliser</h3><p>Faire connaître les comportements responsables qui protègent durablement le cadre de vie.</p></article>
            <article><span>02</span><Building2 aria-hidden="true" /><h3>Mobiliser les quartiers</h3><p>Donner une place active aux communautés dans la gestion de leur environnement urbain.</p></article>
            <article><span>03</span><Recycle aria-hidden="true" /><h3>Innover</h3><p>Identifier des solutions locales pour la collecte, le tri et la valorisation des déchets.</p></article>
            <article><span>04</span><Handshake aria-hidden="true" /><h3>Coopérer</h3><p>Créer des passerelles entre collectivités, entreprises, associations et communautés.</p></article>
          </div>
        </section>

        <section className="audiences-band" aria-label="Publics concernés">
          <div><Leaf aria-hidden="true" /><span>Institutions publiques</span></div>
          <div><Leaf aria-hidden="true" /><span>Entreprises et startups</span></div>
          <div><Leaf aria-hidden="true" /><span>Associations et communautés</span></div>
          <div><Leaf aria-hidden="true" /><span>Citoyens engagés</span></div>
        </section>

        <section className="program-section section" id="programme">
          <div className="section-heading section-heading-light">
            <p>Deux jours d’échanges</p>
            <h2>Comprendre ensemble. Construire des réponses. Passer à l’action.</h2>
          </div>
          <Program />
        </section>

        <section className="gallery-section section" id="edition-passee">
          <div className="gallery-heading">
            <div className="section-heading">
              <p>Une dynamique déjà engagée</p>
              <h2>La première édition en images</h2>
            </div>
            <p>Des décideurs, des associations, des entreprises et des citoyens réunis pour partager des expériences et faire émerger des solutions.</p>
          </div>
          <Gallery />
        </section>

        <section className="partners-section section" id="partenaires">
          <div className="section-heading centered-heading">
            <p>Ils rendent cette rencontre possible</p>
            <h2>Organisateur et partenaires</h2>
          </div>
          <div className="organizer-row">
            <div className="organizer-copy"><span>Un événement conçu et organisé par</span><strong>Différence Group</strong></div>
            <Image unoptimized src="/images/brand/difference-group.png" alt="Différence Group" width={776} height={296} />
          </div>
          <div className="institutional-partner">
            <span>Partenaire institutionnel</span>
            <Image unoptimized src="/images/partners/minhas.png" alt="Ministère de l'Hydraulique, de l'Assainissement et de la Salubrité" width={575} height={150} />
          </div>
          <div className="partner-wall" aria-label="Partenaires et sponsors">
            {partners.map((partner) => <div key={partner.src}><Image unoptimized src={partner.src} alt={partner.alt} width={500} height={260} /></div>)}
          </div>
        </section>

        <section className="registration-section section" id="inscription">
          <div className="registration-copy">
            <p>Inscription</p>
            <h2>Votre place au cœur du changement.</h2>
            <p>Rejoignez celles et ceux qui veulent faire des quartiers le premier moteur d’une ville plus propre, plus responsable et plus durable.</p>
            <div className="registration-reminder">
              <span><CalendarDays aria-hidden="true" />10 et 11 septembre 2026</span>
              <span><MapPin aria-hidden="true" />Abidjan, Côte d’Ivoire</span>
            </div>
          </div>
          <RegistrationForm />
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="footer-brand">
          <Image unoptimized src="/images/brand/jcd-logo.png" alt="Journée du Comportement Durable" width={800} height={800} />
          <p>La transformation durable de la ville commence dans chaque quartier.</p>
        </div>
        <div>
          <h2>Contact</h2>
          <a href="mailto:assistante_event@differencegroup.info"><Mail aria-hidden="true" />assistante_event@differencegroup.info</a>
          <a href="tel:+2252722308348"><Phone aria-hidden="true" />+225 27 22 30 83 48</a>
          <a href="https://wa.me/2250565173663"><MessageCircle aria-hidden="true" />+225 05 65 17 36 63</a>
          <a href="tel:+2250747515162"><Phone aria-hidden="true" />+225 07 47 51 51 62</a>
        </div>
        <div>
          <h2>Adresse de contact</h2>
          <p><MapPin aria-hidden="true" />Cocody Deux-Plateaux Vallon<br />Rue BURIDA, Abidjan</p>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Différence Group</span>
          <span className="site-credit">Site réalisé par <strong>by exias</strong></span>
          <a href="/admin/connexion">Administration</a>
        </div>
      </footer>
    </>
  );
}
