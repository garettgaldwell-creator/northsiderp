# NORTHSIDE RP — Forum Officiel

Forum officiel du serveur Garry's Mod DarkRP **Northside RP**.
Heberge via **GitHub Pages** — gratuit, sans serveur.

## Acces au site

**https://TON_PSEUDO_GITHUB.github.io/northside-rp/**

*(Remplace `TON_PSEUDO_GITHUB` par ton nom d'utilisateur GitHub)*

---

## Structure du projet

```
northside-rp/
├── index.html                  # Accueil du forum
├── style.css                   # Style global
├── annonces.html               # Annonces & News
├── presentations.html          # Presentations
├── nouvelle-presentation.html  # Formulaire presentation
├── discussions.html            # Discussions generales
├── nouveau-sujet.html          # Formulaire nouveau sujet
├── candidatures.html           # Hub recrutement
├── cand-police.html            # Candidature Police
├── cand-medical.html           # Candidature Medecins
├── cand-staff.html             # Candidature Staff
├── signalements.html           # Signalements & Plaintes
├── debans.html                 # Demandes de deban
├── reglement.html              # Reglement complet
├── boutique.html               # Boutique (placeholder)
├── login.html                  # Connexion
└── register.html               # Inscription
```

---

## Deploiement sur GitHub Pages

### Etape 1 — Creer le depot

1. Va sur [github.com](https://github.com) et connecte-toi
2. Clique **"New repository"** (bouton vert en haut a droite)
3. Nom : `northside-rp`
4. Visibilite : **Public** (obligatoire pour GitHub Pages gratuit)
5. Ne coche rien d'autre
6. Clique **"Create repository"**

### Etape 2 — Uploader les fichiers

1. Dans le depot vide, clique **"uploading an existing file"**
2. Glisse-depose **tous les fichiers** du zip (HTML + CSS + README)
3. En bas, laisse le message par defaut et clique **"Commit changes"**

### Etape 3 — Activer GitHub Pages

1. Va dans **Settings** (onglet en haut du depot)
2. Dans le menu de gauche, clique **"Pages"**
3. Sous *Source* : selectionne **"Deploy from a branch"**
4. Branche : **main** — Dossier : **/ (root)**
5. Clique **Save**
6. Attends 1-2 minutes

Ton site est en ligne a :
**https://TON_PSEUDO_GITHUB.github.io/northside-rp/**

---

## Personnalisation

### Changer le nom du serveur
Remplace `NORTHSIDE RP` dans tous les fichiers HTML par ton vrai nom.

### Mettre ta vraie IP
Dans `index.html`, remplace `xxx.xxx.xxx.xxx:27015` par l'IP de ton serveur Hosterfy.

### Lier le Discord
Cherche `btn-discord` dans les fichiers et remplace le `onclick` par :
```js
window.open('https://discord.gg/TON_LIEN', '_blank')
```

### Domaine personnalise (ex: forum.northside-rp.fr)
1. Achete un domaine (OVH, Namecheap...)
2. Dans Settings > Pages > Custom domain, entre ton domaine
3. Chez ton registrar, ajoute un CNAME : `forum` → `TON_PSEUDO.github.io`

---

## Notes importantes

- Le forum est **statique** : les formulaires sont visuels uniquement (pas de vraie BDD)
- Pour des formulaires fonctionnels, utilise **Formspree** (gratuit) : remplace l'action des forms par ton endpoint Formspree
- GitHub Pages est **100% gratuit** pour les projets publics
- Les mises a jour sont instantanees : edite un fichier sur GitHub, le site se met a jour en ~30 secondes

---

*Northside RP — Serious Roleplay sur Garry's Mod*
