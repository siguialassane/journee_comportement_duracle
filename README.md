# Journée du Comportement Durable

Site officiel de la 2ᵉ édition de la Journée du Comportement Durable, organisée par Différence Group les 10 et 11 septembre 2026 à Abidjan.

## Lancer le projet

Prérequis : Node.js 22.13 ou une version plus récente.

```bash
npm install
npm run dev
```

Le site est disponible sur `http://localhost:3000`. L’administration se trouve sur `/admin/connexion`.

## Configuration

Copier `.env.example` vers `.env.local`, puis renseigner les accès Supabase et EmailJS. Les valeurs réelles ne doivent jamais être commitées.

```env
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_PRIVATE_KEY=
ADMIN_EMAILS=
SITE_URL=http://localhost:3000
```

Sans ces accès, le site public reste consultable et le formulaire affiche un message indiquant que les inscriptions ouvriront prochainement.

## Mise en service

1. Créer un projet Supabase et exécuter `supabase/migrations/202607180001_initial.sql` dans l’éditeur SQL. Les données sont isolées dans `inscriptions_diffgroup` et `parametres_diffgroup`.
2. Créer le compte administrateur dans Supabase Auth, sans activer l’inscription publique.
3. Ajouter son adresse à `ADMIN_EMAILS` (plusieurs adresses peuvent être séparées par une virgule).
4. Créer le service et le modèle EmailJS, puis renseigner les six variables Supabase/EmailJS.
5. Définir `SITE_URL` avec l’URL finale et tester le parcours inscription → email → administration.

Le modèle EmailJS doit accepter : `to_email`, `to_name`, `reservation_code`, `event_theme`, `event_dates`, `event_location`, `contact_email` et `contact_phone`.

## Commandes utiles

- `npm run lint` : contrôle du code.
- `npm test` : compilation de production et tests du rendu serveur.
- `npm run build` : compilation de production.

## Données et sécurité

- La validation et la normalisation du téléphone sont réalisées côté serveur.
- La clé secrète Supabase et la clé privée EmailJS ne sont jamais exposées au navigateur.
- La migration active RLS et refuse l’accès anonyme direct aux inscriptions.
- L’administration exige une session Supabase et une adresse présente dans `ADMIN_EMAILS`.
