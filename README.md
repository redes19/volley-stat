# 🏐 Volley Stats

Application web de statistiques de match de volleyball avec export Excel et PDF.

## 📋 Fonctionnalités

- ✅ Configuration des joueurs avec **rôles** (Passeur, Libéro, R4, Central, Pointu)
- ✅ Saisie intuitive des statistiques par joueur et par set
- ✅ **Statistiques adaptées selon le rôle** du joueur
- ✅ **Scores par set** avec suivi des points
- ✅ **Calcul automatique des fautes** : fautes directes + services ratés + attaques ratées
- ✅ Statistiques suivies :
  - **Service** : ace, mis en difficulté, passé, raté
  - **Attaque** : marqué, placé, raté (sauf Passeur et Libéro)
  - **Passe** : bonne, moyen, mauvaise (tous sauf Libéro avant, maintenant inclus)
  - **Réception** : zone passeur, 3 mètres, mauvais (sauf Passeur et Central)
  - **Défense** : bonne, moyen, mauvaise (sauf Central)
  - **Fautes** : fautes directes + services/attaques ratés
- ✅ Visualisation des statistiques en temps réel
- ✅ Export Excel avec :
  - Scores de chaque set
  - Un onglet par set avec stats détaillées et rôles
  - Un onglet résumé avec totaux, pourcentages et fautes calculées
  - Détail des fautes (directes, services ratés, attaques ratées)
- ✅ **Export PDF** avec mise en page professionnelle
- ✅ Design sobre et épuré
- ✅ Application dockerisée avec docker-compose

## 🎭 Rôles des joueurs

L'application adapte les statistiques disponibles selon le rôle :

- **Passeur** : Service, Passe, Fautes (pas d'attaque ni réception)
- **Libéro** : Réception, Défense, Passe, Fautes (pas de service ni attaque)
- **Central** : Service, Attaque, Passe, Fautes (pas de réception ni défense)
- **R4 et Pointu** : Toutes les catégories (Service, Attaque, Passe, Réception, Défense, Fautes)

## ⚠️ Calcul des fautes

Les fautes totales incluent :
- **Fautes directes** : fautes assignées manuellement
- **Services ratés** : comptabilisés automatiquement comme fautes
- **Attaques ratées** : comptabilisées automatiquement comme fautes

## 🚀 Démarrage rapide

### Développement local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Avec Docker Compose (recommandé)

```bash
# Construire et lancer l'application
docker-compose up --build

# Ou en mode détaché
docker-compose up -d --build
```

L'application sera accessible sur `http://localhost:8080`

```bash
# Arrêter l'application
docker-compose down
```

### Avec Docker (sans compose)

```bash
# Construire l'image
docker build -t volley-stat .

# Lancer le conteneur
docker run -p 8080:80 volley-stat
```

L'application sera accessible sur `http://localhost:8080`

## 📦 Structure du projet

```
volley-stat/
├── src/
│   ├── components/
│   │   ├── PlayerSetup.jsx      # Configuration des joueurs et rôles
│   │   ├── StatEntry.jsx        # Saisie des statistiques par rôle
│   │   └── StatsSummary.jsx     # Résumé et visualisation
│   ├── utils/
│   │   └── excelExport.js       # Export Excel avec SheetJS
│   ├── App.jsx                  # Composant principal
│   ├── App.css                  # Styles de l'app
│   ├── index.css                # Styles globaux
│   └── main.jsx                 # Point d'entrée
├── Dockerfile                   # Configuration Docker
├── docker-compose.yml           # Configuration Docker Compose
├── nginx.conf                   # Configuration nginx
└── package.json                 # Dépendances
```

## 🎯 Utilisation

1. **Configuration** : 
   - Ajoutez les joueurs avec leur nom et rôle
   - Configurez le nombre de sets
   - Renseignez les informations du match

2. **Saisie** : 
   - Sélectionnez un set et un joueur
   - Saisissez le score du set
   - Saisissez les statistiques avec les boutons +/-
   - Les catégories affichées s'adaptent au rôle du joueur

3. **Résumé** : 
   - Visualisez les scores par set
   - Consultez les statistiques par set avec les rôles
   - Consultez le résumé global avec totaux, pourcentages et fautes

4. **Export** : 
   - Téléchargez le fichier Excel avec toutes les statistiques
   - Ou téléchargez le fichier PDF avec mise en page professionnelle
   - Chaque set a son onglet/section avec le score
   - Le résumé inclut les scores et les fautes totales par joueur (directes + ratées)

## 🛠️ Technologies

- **React** - Framework UI
- **Vite** - Build tool
- **SheetJS (xlsx)** - Génération Excel côté client
- **jsPDF** - Génération PDF côté client
- **Docker** - Containerisation
- **Docker Compose** - Orchestration
- **Nginx** - Serveur web

## 📄 License

MIT

