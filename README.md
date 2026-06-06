# LavenderFlow - Frontend

Un **gestionnaire de tâches collaboratif moderne en temps réel**, inspiré par Trello. Créez, organisez et gérez vos projets en équipe avec synchronisation instantanée.

## Présentation du Service Frontend

### Objectifs du Service Frontend
- Fournir une interface utilisateur moderne, intuitive et réactive
- Synchroniser les données en temps réel avec le backend via WebSocket
- Gérer l'authentification et les sessions utilisateur
- Offrir une expérience de drag & drop fluide et responsable
- Optimiser les performances avec React et Vite

### Fonctionnalités Principales
- **Interface collaborative** en temps réel
- **Drag & drop intuitif** pour listes et cartes
- **Système d'étiquettes** avec codes couleur
- **Assignations** et **checklists**
- **Commentaires** en temps réel
- **Authentification** sécurisée (JWT)
- **Synchronisation instantanée** de tous les événements

## Table des matières

- [Présentation du service](#-présentation-du-service-frontend)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation et lancement](#installation-et-lancement)
- [Stack technologique](#stack-technologique)
- [Structure du projet](#structure-du-projet)
- [Communication avec le backend](#communication-avec-le-backend)
- [Notes de sécurité](#notes-de-sécurité)
- [Troubleshooting](#troubleshooting)
---

## Architecture

### Vue d'ensemble

Le frontend LavenderFlow suit une **architecture modulaire** basée sur des composants React réutilisables:

```
┌──────────────────────────────────────────┐
│     Pages (Routes React)                 │
│  - Index/Home                            │
│  - Auth (Login/Register)                 │
│  - Workspaces                            │
│  - Board View                            │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│     Composants React (UI)                │
│  - Tableau kanban                        │
│  - Cartes et listes                      │
│  - Modales et formulaires                │
│  - Navigation                            │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│     Services (Logique)                   │
│  - SignalR Connection                    │
│  - API Client                            │
│  - State Management (Hooks)              │
│  - Authentification                      │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼──────────────────────────┐
│     Backend API                           │
│  - REST endpoints                         │
│  - WebSocket (SignalR)                    │
└──────────────────────────────────────────┘
```

### Couches Architecturales

#### **Pages**
Routes principales de l'application:
- `LoginPage` - Authentification utilisateur
- `RegisterPage` - Création de compte
- `WorkspacesPage` - Liste des workspaces
- `BoardPage` - Vue principale du tableau kanban
- `ProfilePage` - Gestion du profil utilisateur

#### **Composants**
Composants React réutilisables organisés par feature:
- **Components/Auth** - Formulaires d'authentification
- **Components/Board** - Tableau, listes, cartes
- **Components/UI** - Composants génériques (boutons, modales, etc.)
- **Components/Profile** - Gestion du profil

#### **Services**
Logique métier et communication:
- **SignalR Service** - Gestion WebSocket temps réel
- **API Client** - Appels HTTP au backend
- **Auth Service** - Gestion de l'authentification
- **State Hooks** - Gestion d'état locale

#### **Models**
Types TypeScript et interfaces:
- `User`, `Workspace`, `Board`, `Card`
- `ListItem`, `Label`, `Assignment`, etc.

### Flux de Données

**Cycle de vie: Création d'une carte**

```
1. Utilisateur remplit le formulaire
   ↓
2. Événement onClick → appel API
   └─> POST /api/lists/{listId}/cards
       Headers: { Authorization: Bearer <token> }
   ↓
3. Frontend reçoit la réponse avec la nouvelle carte
   ↓
4. Backend émet via SignalR: "CardCreated"
   ↓
5. Service SignalR reçoit l'événement
   ↓
6. React Hook met à jour le state local
   ↓
7. Composant se re-render avec la nouvelle carte
   ↓
8. UI affiche la carte sans rechargement
```

### Gestion de l'État

React Hooks utilisés pour la gestion d'état:

```typescript
// État local du composant
const [cards, setCards] = useState<Card[]>([]);
const [loading, setLoading] = useState(false);

// Effets (appels API, subscriptions)
useEffect(() => {
  fetchCards();
  subscribeToCardEvents();
}, [boardId]);

// Context API pour état global (auth, user)
const { user, token } = useAuth();
```

### Intégration SignalR (Temps Réel)

```typescript
// 1. Établir la connexion
const connection = new HubConnectionBuilder()
  .withUrl("http://localhost:5000/lavenderFlowHub", {
    accessTokenFactory: () => getToken()
  })
  .withAutomaticReconnect()
  .build();

// 2. S'abonner aux événements
connection.on("CardCreated", (card) => {
  setCards([...cards, card]);
});

// 3. Envoyer des messages (si nécessaire)
await connection.invoke("JoinWorkspace", workspaceId);
```

---
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

---

## Communication avec le Backend

### Requêtes HTTP

Toutes les requêtes HTTP incluent automatiquement le token JWT:

```typescript
// Exemple d'appel API
const response = await fetch("http://localhost:5000/api/cards", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
  },
  body: JSON.stringify({ name: "Nouvelle tâche", listItemId: 1 })
});
```

### Événements SignalR (Temps Réel)

Le frontend s'abonne à ces événements:

```
- BoardCreated / BoardUpdated / BoardDeleted
- CardCreated / CardUpdated / CardDeleted
- LabelAddedToCard / LabelRemovedFromCard
- UserAssignedToCard / UserUnassignedFromCard
- ChecklistItemUpdated
- ChatMessageAdded
- ... et autres
```

### Gestion des Erreurs

- **401 Unauthorized** → Redirection vers `/login`
- **403 Forbidden** → Affichage d'une erreur d'accès
- **404 Not Found** → Gestion gracieuse avec message utilisateur
- **500 Server Error** → Log de l'erreur + message à l'utilisateur

---

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

