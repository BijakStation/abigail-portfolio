# Portfolio Abigail Diantete

Portfolio multipage statique construit en HTML, CSS et JavaScript natifs. Le projet ne nécessite ni installation, ni framework, ni commande de compilation.

## Architecture

```text
abigail-portfolio-v1-refined/
├── index.html
├── work.html
├── about.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── projects.js
│   └── work.js
├── assets/
│   └── images/
│       ├── hero/
│       ├── editorial/
│       ├── campaign/
│       ├── talents/
│       ├── personal/
│       └── about/
└── README.md
```

## Rôle des fichiers et dossiers

### `index.html`
Page d’accueil. Elle contient le Hero à images défilantes, la phrase principale et les accès rapides vers Work, About et Contact.

### `work.html`
Page portfolio. Elle contient les filtres, la grille structurée et la vue détaillée qui remplace la grille lorsqu’un projet est ouvert.

### `about.html`
Page de présentation d’Abigail. La section Contact est intégrée en bas de cette page afin d’éviter une page presque vide.

### `css/styles.css`
Feuille de styles globale : couleurs, typographies, grilles, responsive, animations, Hero, galerie et états interactifs.

### `js/main.js`
Comportements communs : menu mobile, header au scroll, année automatique et animations d’apparition.

### `js/projects.js`
Source unique des contenus du portfolio. Tous les titres, catégories, années, descriptions, crédits et chemins d’images des projets sont regroupés ici.

### `js/work.js`
Gère les filtres, l’affichage de la grille, l’ouverture d’un projet, le bouton retour, la galerie avec flèches, le swipe mobile et les projets suggérés.

### `assets/images/`
Contient tous les médias locaux, classés par section ou catégorie.

## Ouvrir le projet

1. Décompresser le dossier.
2. Ouvrir le dossier dans Visual Studio Code.
3. Ouvrir `index.html` dans un navigateur.

L’extension Live Server est recommandée pour le confort de travail, mais elle n’est pas obligatoire.

## Modifier les couleurs

Ouvrir `css/styles.css`, puis modifier les variables placées au début du fichier :

```css
:root {
  --blue: #1717ff;
  --ink: #111111;
  --paper: #f6f6f1;
  --white: #ffffff;
  --line: rgba(17, 17, 17, 0.18);
}
```

`--blue` contrôle la couleur d’accent utilisée pour les filtres actifs, certains titres, les survols et la section Contact.

## Modifier les images

Les images se trouvent dans `assets/images/`.

- Hero : `assets/images/hero/`
- Editorial : `assets/images/editorial/`
- Campaign : `assets/images/campaign/`
- Talents : `assets/images/talents/`
- Personal Projects : `assets/images/personal/`
- Portrait About : `assets/images/about/`

La méthode la plus simple consiste à remplacer une image tout en conservant exactement son nom de fichier. Aucun changement de code n’est alors nécessaire.

Pour utiliser un nouveau nom, modifier le chemin correspondant dans `index.html`, `about.html` ou `js/projects.js`.

## Modifier les textes

- Textes de l’accueil : `index.html`
- Biographie et Contact : `about.html`
- Introduction de Work : `work.html`
- Contenus de chaque projet : `js/projects.js`

Dans `js/projects.js`, chaque projet est un objet indépendant. Exemple :

```js
{
  id: "uncommon-grace",
  title: "Uncommon Grace",
  category: "editorial",
  categoryLabel: "Editorial",
  year: "2026",
  client: "Roll Up Magazine",
  description: "...",
  concept: "...",
  credits: { Photography: "...", Styling: "Abigail Diantete" },
  images: ["assets/images/editorial/uncommon-grace-01.jpg"]
}
```

## Modifier les liens

Les liens Instagram, LinkedIn et e-mail apparaissent dans `index.html`, `work.html` et `about.html`.

Rechercher les valeurs suivantes dans Visual Studio Code pour les remplacer partout :

- `https://www.instagram.com/dia.monna`
- `https://www.linkedin.com/in/abigail-diantete-005188198/`
- `mailto:diantete.abigail@gmail.com?subject=Portfolio%20enquiry`

Le lien `mailto:` ouvre l’application de messagerie configurée sur l’appareil du visiteur. Le site n’envoie pas lui-même le message.

## Ajouter un nouveau projet

1. Ajouter les images dans le bon dossier de `assets/images/`.
2. Ouvrir `js/projects.js`.
3. Copier un objet projet existant.
4. Modifier son `id`, son titre, sa catégorie, ses textes, ses crédits et ses images.
5. Vérifier que l’`id` est unique et ne contient ni espace ni accent.

Le nouveau projet apparaîtra automatiquement dans la grille, dans le filtre correspondant et dans les suggestions.

Catégories acceptées :

```text
editorial
campaign
talents
personal
```

## Ajouter une nouvelle page

1. Dupliquer `about.html`.
2. Renommer le fichier, par exemple `services.html`.
3. Modifier la balise `<title>`, la meta description et le contenu du `<main>`.
4. Ajouter le lien vers la page dans les navigations des trois fichiers HTML.
5. Réutiliser les classes existantes autant que possible avant d’ajouter de nouveaux styles.

## Ajouter une nouvelle section

1. Ajouter une balise `<section>` dans la page concernée.
2. Utiliser la classe `page-shell` pour conserver l’alignement global.
3. Utiliser `reveal` uniquement si la section doit apparaître au scroll.
4. Ajouter les styles dédiés dans `css/styles.css`, près de la section la plus proche.
5. Prévoir les adaptations dans les media queries si la structure comporte plusieurs colonnes.

Exemple minimal :

```html
<section class="new-section page-shell reveal">
  <p class="section-label">Label</p>
  <h2>Titre de la section</h2>
</section>
```

## Documentation technique

### Grille et équilibre

La grille Work utilise trois colonnes identiques sur ordinateur, deux sur tablette et une sur mobile. Toutes les vignettes ont un ratio `4 / 5`, ce qui évite les décalages et les placements visuellement aléatoires de la première version.

### Vue détaillée sans nouvelle page

La vue détaillée est générée par `js/work.js` à partir des données de `js/projects.js`. Lorsqu’un projet est ouvert :

- l’introduction et la grille sont masquées ;
- le projet est injecté dans la même page ;
- l’URL reçoit un fragment comme `#project=uncommon-grace` ;
- le bouton retour restaure la grille ;
- les boutons précédent et suivant contrôlent la galerie ;
- les flèches du clavier et le swipe mobile sont pris en charge.

Cette architecture évite douze pages projet dupliquées et rend les modifications plus fiables.

### Accessibilité

Le projet inclut :

- un lien d’évitement vers le contenu ;
- des libellés accessibles sur les boutons ;
- la navigation au clavier dans la galerie ;
- un état `aria-current` dans le menu ;
- une alternative réduite pour les utilisateurs qui désactivent les animations.

### Responsive

Les principaux points de rupture sont `1000px`, `820px` et `620px`. Les grilles, le menu, les galeries et les blocs Contact s’adaptent sans dépendance externe.
