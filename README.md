# 🍳 eat-day

Une application **ludique** pour toi et ta copine afin de **gérer vos recettes** et ne jamais manquer d’idées quand vous cuisinez. L’interface adopte un style **Cartoon / Hand-drawn UI**, avec de **petites animations** et **sons** façon jeu vidéo.

## 🎯 Objectif

Créer une application simple et fun qui permet de :

* **Créer / Lire / Mettre à jour / Supprimer** des recettes (CRUD).
* Marquer des **favoris**, lancer un **mode aléatoire**, consulter une **playlist** (dont la **recette du jour**).
* Profiter d’une **UI cartoon** avec **feedbacks audio** et micro-animations.

---

## 🧩 Stack technique

* **Frontend** : [React](https://react.dev/) + **TypeScript**
* **State** : [Zustand](https://github.com/pmndrs/zustand) (stores légers, prévisibles)
* **Data fetching / cache** : [React Query](https://tanstack.com/query/latest) (requêtes, cache, synchronisation)
* **Backend (mock)** : [JSON Server](https://github.com/typicode/json-server) pour simuler une API REST locale
* **Styles** : [Tailwind CSS](https://tailwindcss.com/) comme base, complétée pour un rendu **Cartoon / Hand-drawn** (icônes dessinées, palettes vives, effets “paper/card”, ombres douces)
* **Sons & animations** : micro-interactions (hover/click) + **effets sonores courts** (UI “game-like”)

---

## ✨ Fonctionnalités

### Gestion des recettes

* **Créer** une recette avec :

  * `name` (nom), `description`
  * `ingredients[]`
  * `occasions[]` (déjeuner, dîner, fête, romantique…)
  * `preferences[]` (rapide, healthy, budget, comfort…)
* **Lire** les détails d’une recette
* **Mettre à jour** (formulaire pré-rempli)
* **Supprimer** (confirmation)
* **Favoris** (toggle)

### UI / Navigation

* **Home** : liste de recettes en cartes (icône/image, nom, résumé, favoris, éditer, supprimer)
* **Filtres / actions rapides** :

  * Voir **favoris**
  * **Mode aléatoire** (choisir une recette au hasard)
  * **Playlist** (recettes planifiées, dont **recette du jour**)
  * **Ajouter** une recette
* **Ambiance** : animations (rebond, fade, shake) & **effets sonores** au clic

---

## 📦 Structure du projet (suggestion)

```
/cooking-fun
├─ /src
│  ├─ /assets
│  │  ├─ /icons
│  │  ├─ /images
│  │  └─ /sounds           # clic, success, error
│  ├─ /components
│  │  ├─ RecipeCard.tsx
│  │  ├─ RecipeForm.tsx
│  │  └─ UI/               # boutons, modals, confirm, badges
│  ├─ /features
│  │  └─ recipes/
│  │     ├─ api.ts         # appels via React Query
│  │     ├─ hooks.ts       # hooks (useRecipesQuery, etc.)
│  │     ├─ types.ts       # types TS (Recipe, Ingredient…)
│  │     └─ store.ts       # Zustand (filters, UI state)
│  ├─ /pages
│  │  ├─ Home.tsx
│  │  ├─ AddRecipe.tsx
│  │  └─ EditRecipe.tsx
│  ├─ /styles
│  │  └─ index.css         # Tailwind + variables thème cartoon
│  ├─ /utils
│  │  └─ sound.ts          # playClick(), playSuccess(), playError()
│  ├─ main.tsx
│  └─ App.tsx
├─ /server
│  └─ db.json              # données JSON Server
├─ index.html
├─ package.json
├─ tailwind.config.js
└─ tsconfig.json
```

---

## 🗃️ Schéma de données (JSON Server)

`/server/db.json` (exemple minimal) :

```json
{
  "recipes": [
    {
      "id": 1,
      "name": "Pâtes à l’ail et au citron",
      "description": "Rapide, frais, parfait pour un dîner en semaine.",
      "ingredients": [
        { "name": "Spaghetti", "quantity": "200g" },
        { "name": "Ail", "quantity": "2 gousses" },
        { "name": "Citron", "quantity": "1" }
      ],
      "occasions": ["dîner"],
      "preferences": ["rapide", "budget"],
      "favorite": true,
      "createdAt": "2025-08-21T10:00:00Z"
    }
  ],
  "playlist": {
    "todayRecipeId": 1,
    "plannedIds": [1]
  }
}
```

**Endpoints JSON Server (par défaut)**

* `GET    /recipes`
* `GET    /recipes/:id`
* `POST   /recipes`
* `PUT    /recipes/:id`
* `PATCH  /recipes/:id`
* `DELETE /recipes/:id`

> Astuce : JSON Server supporte la query `?_sort=name&_order=asc` et le filtrage `?favorite=true`.

---

## 🚀 Démarrage rapide

> Prérequis : Node 18+, npm/yarn/pnpm

```bash
# 1) Installer
npm i
# ou
pnpm i

# 2) Lancer l'API mock (JSON Server)
npm run dev:api
# -> démarre sur http://localhost:3001 (configurable)

# 3) Lancer le front (Vite)
npm run dev
# -> http://localhost:5173 (par défaut)
```

**Scripts recommandés (`package.json`)** :

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "dev:api": "json-server --watch server/db.json --port 3001",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
```

> Pense à configurer l’URL de l’API (ex : `http://localhost:3001`) via une variable (`import.meta.env.VITE_API_URL`).

---

## 🔗 Intégration React Query & Zustand (aperçu)

**`features/recipes/api.ts`** (exemple d’appel) :

```ts
export async function fetchRecipes() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/recipes`);
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
}
```

**`features/recipes/hooks.ts`** :

```ts
import { useQuery } from "@tanstack/react-query";
import { fetchRecipes } from "./api";

export function useRecipesQuery() {
  return useQuery({ queryKey: ["recipes"], queryFn: fetchRecipes });
}
```

**`features/recipes/store.ts`** :

```ts
import { create } from "zustand";

type FiltersState = {
  showFavorites: boolean;
  setShowFavorites: (v: boolean) => void;
};

export const useRecipeFilters = create<FiltersState>((set) => ({
  showFavorites: false,
  setShowFavorites: (v) => set({ showFavorites: v })
}));
```

---

## 🎨 Ligne graphique (Cartoon / Hand-drawn)

* **Base Tailwind** (tokens, arrondis généreux, ombres douces).
* Palette **vive et chaleureuse** (primaire/secondaire + tons crème “papier”).
* **Icônes dessinées** (SVG custom) + **illustrations** légères.
* **Animations** (scale/rebond au clic, hovers ludiques) via CSS + petites libs si besoin.
* **Sons** : clic (UI tap), success, error (≤150ms, volume modéré).
  *Respecter l’accessibilité : option pour couper les sons.*

---

## ♿ Accessibilité & UX

* Contraste texte/fond ≥ WCAG AA.
* Focus visibles, navigable au clavier.
* Préférences utilisateur : `prefers-reduced-motion`, **mute sons**.
* Labels explicites dans les formulaires, messages d’erreur clairs.

---

## 🧪 Qualité

* **TypeScript strict** (`"strict": true`)
* Lint : ESLint + règles React/TS
* Tests (à ajouter) : Vitest + Testing Library
* CI (à ajouter) : build + lint + tests

---

## 🛣️ Roadmap (MVP → Plus)

**MVP**

* CRUD recettes
* Favoris
* Home avec carte recette + actions
* Mode aléatoire
* Playlist (recette du jour + planifiées)
* Sons/animations de base
* Thème cartoon initial (Tailwind)

**Next**

* Upload image par recette
* Tags avancés + recherche
* Partage de recette (lien, export)
* Auth légère 
* Import/Export JSON
* i18n (FR/EN)
* PWA (offline + installable)

---

## 🤝 Contribution

1. Crée une branche `feat/xxx` ou `fix/xxx`
2. Commit clair et concis
3. Ouvre une PR avec un **avant/après** (captures) si l’UI change

---

## 📄 Licence

MIT.

---

## 📬 Contact

Ouvre une issue pour idées/bugs.
Bon dev et… **bon appétit** 👩‍🍳👨‍🍳!
