# Design System

## Theme

Une campagne institutionnelle ivoirienne baignée de lumière naturelle : le blanc garde la page nette, le vert profond porte l'engagement collectif et l'orange historique de l'événement concentre l'action.

## Color

- Background: `oklch(1 0 0)`
- Surface: `oklch(0.968 0.012 145)`
- Ink: `oklch(0.22 0.045 150)`
- Primary: `oklch(0.40 0.12 145)`
- Primary strong: `oklch(0.29 0.095 150)`
- Accent: `oklch(0.695 0.205 43.2)`
- Muted: `oklch(0.48 0.04 150)`

## Typography

Anek Latin, en graisses fortes et largeur légèrement condensée, porte les titres de campagne. Source Sans 3 porte le texte courant, les formulaires et l'administration. Les titres utilisent une échelle fluide et le corps reste limité à 72 caractères par ligne.

## Layout

Le hero combine un grand bloc vert éditorial et une composition photographique de transformation urbaine. Les sections alternent grands aplats, respiration blanche et images authentiques. Le programme utilise deux onglets et une chronologie, la galerie une composition asymétrique, et l'inscription un panneau sombre clairement distinct.

## Components

- Boutons pleins orange ou verts, rayons de 10 à 12 px, états focus très visibles.
- Onglets accessibles avec état sélectionné explicite.
- Champs de formulaire larges, libellés persistants et messages associés.
- Logos présentés sur fond blanc sans modification de couleur.
- Tableau admin dense mais lisible, sans décoration de type carte répétitive.

## Motion

Une seule orchestration d'entrée légère dans le hero et des transitions courtes sur les onglets, boutons et photos. Aucun contenu ne dépend d'une animation pour devenir visible. Tous les mouvements sont neutralisés avec `prefers-reduced-motion`.
