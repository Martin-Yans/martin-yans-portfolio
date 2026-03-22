# Portfolio (site web)

Site portfolio minimal, style épuré et noble. Contient une section "Projets" dynamique et un panneau d'administration local pour ajouter des projets.

Usage rapide
- Ouvrir un serveur HTTP dans le dossier `siteWeb` (recommandé) :

```sh
cd siteWeb
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Comment ajouter un projet
- Méthode simple dans le navigateur : cliquer sur "Ajouter un projet", remplir le formulaire. Les projets sont sauvegardés dans `localStorage`.
- Pour exporter la liste : cliquer sur "Exporter JSON" — un fichier `projects-export.json` sera téléchargé.
- Pour ajouter manuellement (édition de fichier) : modifier `projects.json` et ajouter un objet avec les clefs `title`, `description`, `tags` (liste), `link`, `image`.

Notes
- Le panneau d'ajout stocke les projets localement uniquement. Pour conserver des modifications permanentes sur le disque, utilisez l'export JSON puis remplacez `projects.json` ou conservez l'export.
- Testez via un serveur HTTP local pour que `fetch('projects.json')` fonctionne correctement.
