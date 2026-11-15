# Gestionnaire de Contacts (React + Vite + Tailwind CSS)

Application complète de gestion de contacts personnels et professionnels développée avec React (`useState` et `useEffect`).

## Installation et démarrage

```bash
npm install
npm run dev
```

## Fonctionnalités incluses

- **Composants modulaires** : `ContactCard`, `ContactList`, `ContactForm`, `SearchBar`
- **Persistance automatique** dans `localStorage` via `useEffect`
- **Ajout & Modification** avec pré-remplissage du formulaire et validation des champs
- **Suppression** ciblée par identifiant unique (`Date.now()`)
- **Recherche instantanée** par nom complet
- **Tri alphabétique** (A–Z / Z–A)
