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
