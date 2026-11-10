# Contribuer à LumiSciences

## Flux de travail

1. Crée une branche depuis `main` : `feat/nom-court`, `fix/nom-court` ou `docs/nom-court`.
2. Fais des commits courts en Conventional Commits : `feat(ui): ajoute les onglets`, `fix(api): corrige le calcul du XP`.
3. Ouvre une pull request vers `main` en remplissant le modèle. La CI doit être verte.
4. Demande une relecture. Pour un nouveau cours, une personne qui enseigne la matière relit les énoncés et les formules.
5. Fusionne par « Squash and merge » : le titre de la PR devient le message du commit.

## Ajouter un cours

1. Ajoute un objet au tableau `K` de `js/catalogue.js` (voir le README pour les champs).
2. Lance `npm run export --prefix server` pour mettre à jour `server/data/courses.json`.
3. Commit les deux fichiers dans la même PR : la CI vérifie qu'ils sont synchronisés.

## Lancer en local

- Front : `python3 -m http.server 8000`
- API : `cd server && npm install && npm start`
- Tests : `cd server && npm test`
- Formatage : `npx prettier@3.3.3 --write .` avant chaque commit (la CI vérifie)
