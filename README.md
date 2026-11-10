# LumiSciences

Plateforme éducative de Maths, PCT et SVT pour les classes de 3e et de Terminale (Bénin) : des labos et des schémas 2D interactifs pour comprendre les notions en les manipulant.

> Prototype : les contenus sont à valider avec les programmes officiels avant diffusion aux élèves.

## Leçons actuelles

| Classe | Matière | Leçon |
|---|---|---|
| 3e | Maths | Théorème de Pythagore ; volumes (cylindre, cône, sphère) |
| 3e | PCT | Circuit électrique et loi d'Ohm (série / dérivation) |
| 3e | SVT | Photosynthèse |
| Terminale | Maths | Fonctions du second degré |
| Terminale | PCT | Dosage acide-base (titrage) |
| Terminale | SVT | Génétique : échiquier de croisement |

## Lancer le projet

Aucune dépendance, aucun build. Ouvre `index.html` dans un navigateur, ou lance un petit serveur local :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Structure

```
index.html            page unique
css/style.css         thème clair/sombre, couleurs par matière
js/helpers.js         état (classe, matière) et composants (curseur, liste, bouton)
js/lessons/*.js       une leçon = une fonction (schéma SVG + contrôles + résultat)
js/catalogue.js       catalogue de cours fun (modèles, quiz, XP, mascotte)
js/app.js             liste des labos et affichage
sw.js                 mode hors ligne (service worker)
server/               API Node.js (Express) + PostgreSQL
scripts/              export du catalogue vers l’API
```

## Ajouter une leçon

1. Crée `js/lessons/ma-lecon.js` avec une fonction `maLecon(stage, controls, out)` :
   - `stage` reçoit le schéma SVG (`stage.innerHTML = ...`) ;
   - `controls` reçoit les curseurs via `sl(...)`, `sel(...)` ou `btn(...)` ;
   - `out` reçoit le calcul ou le texte de résultat.
2. Ajoute `<script src="js/lessons/ma-lecon.js"></script>` dans `index.html`, avant `js/app.js`.
3. Déclare la leçon dans le tableau `L` de `js/app.js` : `{c:"3", s:"maths", t:"Titre", d:"Explication", f:maLecon}`.
   `c` vaut `"3"` ou `"T"`, `s` vaut `"maths"`, `"pct"` ou `"svt"`.

## Pistes

Thalès et trigonométrie, solides en perspective, optique et mécanique en PCT, quiz après chaque leçon, choix de la série en Terminale.

## Catalogue de cours fun

Chaque cours est un objet du tableau `K` (`js/catalogue.js`) : `{id, c, s, e, t, p, m, h, b, q}`. `p` choisit le modèle : `ex` (fiche express), `an` (analogie), `mn` (mnémo), `vf` (vrai ou faux, avec `v` à la place de `b` et `q`). Les points d'expérience et les cours terminés sont gardés dans le navigateur (localStorage).

## API (dossier `server/`)

```bash
cd server && npm install && cp .env.example .env && npm start
```

Sans `DATABASE_URL`, la progression est gardée en mémoire. Avec PostgreSQL, le schéma de `db/schema.sql` est créé au démarrage (non testé sur une vraie base pour l'instant).

| Route | Rôle |
|---|---|
| `GET /api/health` | état de l’API |
| `GET /api/courses?classe=3&matiere=maths&q=` | catalogue filtré |
| `GET /api/courses/:id` | un cours, sans les bonnes réponses |
| `POST /api/courses/:id/answer` | corrige une réponse (`{choix}` ou `{affirmation, valeur}`) et attribue les points |
| `GET /api/progress` | XP et cours terminés de l’appareil |

La progression est liée à un UUID anonyme envoyé dans l’en-tête `X-Device-Id` : aucune donnée personnelle n’est stockée.

Voir `CONTRIBUTING.md` pour le travail en pull requests.
