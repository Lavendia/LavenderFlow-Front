# LavenderFlow - Frontend

Un gestionnaire de tâches collaboratif moderne en temps réel, inspiré par Trello. Créez, organisez et gérez vos projets en équipe avec synchronisation instantanée.

## Fonctionnalités

### Gestion des Tableaux
- **Création et édition** de tableaux collaboratifs
- **Gestion des membres** avec attribution de rôles
- **Paramètres personnalisables** par tableau

### Gestion des Listes et Cartes
- **Glisser-déposer intuitif** pour réorganiser listes et cartes
- **Création instantanée** de listes et cartes
- **Persistance automatique** des modifications
- **Suppression** avec confirmation

### Système d'Étiquettes (Labels)
- **Étiquettes colorées** personnalisables par tableau
- **Code couleur** affiché sur les cartes (Trello-style)
- **Effets visuels** : glow et surbrillance lors de la sélection
- **Gestion complète** : ajout, modification, suppression
- **Synchronisation en temps réel** via SignalR

### Assignations et Collaboration
- **Assigner des utilisateurs** aux cartes
- **Gestion des assignés** avec interface intuitive
- **Affichage du nombre d'assignés** sur la carte
- **Synchronisation instantanée** des assignations

### Système de Checklist
- **Créer des checklists** détaillées dans les cartes
- **Ajouter des éléments** avec coches
- **Suivi de progression** (X/Y items complétés)
- **Affichage du nombre** de checklists sur la carte
- **Mises à jour en temps réel**

### Métadonnées des Cartes
- **Badges informatifs** : nombre d'assignés, checklists, commentaires
- **Mises à jour en direct** lors des modifications
- **Statut visuel** des tâches

### Système de Commentaires
- **Commentaires en temps réel** sur les cartes
- **Synchronisation instantanée** avec tous les clients connectés

### Synchronisation Temps Réel
- **WebSocket via SignalR (Azure)** pour les mises à jour instantanées
- **Événements en temps réel** :
  - Création/modification/suppression de cartes
  - Gestion des listes
  - Assignations des utilisateurs
  - Modifications de checklists
  - Ajout/suppression d'étiquettes
  - Nouveaux commentaires
- **Pas de rechargement nécessaire** - tout se met à jour automatiquement

### Authentification
- **Système de login/register** sécurisé
- **Gestion des sessions** utilisateur
- **Contrôle d'accès** par tableau

## Prérequis

### Logiciels Requis
- **Node.js** 18.x ou supérieur
- **npm** 9.x ou supérieur (ou yarn)

### Services Backend
- **Backend LavenderFlow** accessible à `http://localhost:5000`
- **SignalR Hub** sur `http://localhost:5000/lavenderFlowHub`

## Installation et Lancement

### 1. Cloner le Projet
```bash
git clone <repository-url>
cd LavenderFlow-Front
```

### 2. Installer les Dépendances
```bash
npm install
```

### 3. Configuration de l'Environnement
Créer un fichier `.env.local` à la racine du projet (si nécessaire) :
```env
VITE_API_URL=http://localhost:5000
```

### 4. Lancer en Développement
```bash
npm run dev
```

L'application sera accessible à `http://localhost:5173`

### Commandes Disponibles
```bash
npm run dev      # Lancer le serveur de développement
npm run build    # Compiler pour la production
npm run lint     # Exécuter les vérifications ESLint
npm run preview  # Prévisualiser la build production
```

## Stack Technologique

- **Frontend Framework** : React 18 + TypeScript
- **Build Tool** : Vite
- **Styling** : Tailwind CSS
- **Drag & Drop** : @dnd-kit
- **Real-time** : SignalR (Azure)
- **Icons** : lucide-react
- **State Management** : React Hooks
- **HTTP Client** : Fetch API

## Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI de base
│   ├── board/          # Composants du tableau
│   ├── auth/           # Composants d'authentification
│   ├── profile/        # Pages de profil
│   └── index/          # Pages d'accueil
├── pages/              # Pages principales
├── services/           # Services (SignalR, etc.)
├── api_utils/          # Utilitaires API
├── models/             # Types et interfaces
├── constants/          # Constantes (couleurs, etc.)
└── assets/             # Images et ressources
```

## Notes de Sécurité

- Le token JWT est stocké dans `localStorage` sous la clé `authToken`
- Les appels API incluent automatiquement le Bearer token
- Les redirections vers `/login` se font sur erreur 401

## Troubleshooting

### Erreur de connexion SignalR
- Vérifier que le backend est lancé sur `http://localhost:5000`
- Vérifier que le token d'authentification est valide
- Consulter la console du navigateur pour les messages d'erreur

### Le build échoue
```bash
npm run build
```
- Vérifier qu'il n'y a pas d'erreurs TypeScript
- Vérifier les logs du build pour plus de détails

---
## Contributeurs
- Loïc DELPRAT
- Romain BARREAU

