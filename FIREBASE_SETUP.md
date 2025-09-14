# Configuration Firebase pour le Dashboard IoT Volailles

## Étapes de configuration

### 1. Créer un projet Firebase
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Nommez votre projet (ex: "volaille-iot-dashboard")
4. Suivez les étapes de configuration

### 2. Activer Realtime Database
1. Dans votre projet Firebase, allez dans "Realtime Database"
2. Cliquez sur "Créer une base de données"
3. Choisissez le mode "Test" pour commencer (règles ouvertes)
4. Sélectionnez une région proche de vous

### 3. Obtenir la configuration
1. Allez dans "Paramètres du projet" (icône engrenage)
2. Dans l'onglet "Général", descendez jusqu'à "Vos applications"
3. Cliquez sur "Ajouter une application" puis sélectionnez "Web"
4. Nommez votre application et cliquez sur "Enregistrer l'application"
5. Copiez la configuration qui s'affiche

### 4. Configurer l'application
1. Ouvrez le fichier `src/lib/firebase.ts`
2. Remplacez les valeurs de `firebaseConfig` par celles de votre projet:

```typescript
const firebaseConfig = {
  apiKey: "votre-api-key",
  authDomain: "votre-projet.firebaseapp.com",
  databaseURL: "https://votre-projet-default-rtdb.firebaseio.com",
  projectId: "votre-projet-id",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "votre-app-id"
};
```

### 5. Règles de sécurité (optionnel)
Pour la production, configurez des règles de sécurité dans Realtime Database:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

## Structure de la base de données

L'application créera automatiquement cette structure:

```
volaille-iot-dashboard/
├── sensorData/
│   ├── temperature: number
│   ├── humidity: number
│   ├── airQuality: number
│   ├── lightLevel: number
│   ├── birdCount: number
│   ├── activityLevel: number
│   └── timestamp: string
├── equipment/
│   ├── ventilation-zone-a/
│   ├── heating-main/
│   ├── lighting-led/
│   └── watering-system/
└── alerts/
    ├── alert-1/
    └── alert-2/
```

## Fonctionnalités temps réel

✅ **Données capteurs** - Mise à jour automatique toutes les 5 secondes
✅ **Contrôle équipements** - Boutons fonctionnels en temps réel
✅ **Alertes** - Suppression et ajout en temps réel
✅ **Mode Jour/Nuit** - Contrôle automatique des équipements
✅ **Simulation** - Génération automatique de données de test

## Démarrage

1. Configurez Firebase comme indiqué ci-dessus
2. Lancez l'application: `npm run dev`
3. L'application initialisera automatiquement les données par défaut
4. Toutes les interactions sont maintenant connectées à Firebase

## Dépannage

- **Erreur de connexion**: Vérifiez que les clés Firebase sont correctes
- **Données non synchronisées**: Vérifiez les règles de sécurité
- **Application ne démarre pas**: Vérifiez que Firebase est bien installé (`npm install firebase`)
