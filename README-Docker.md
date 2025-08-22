# 🐳 Eat Day - Guide Docker

Ce guide vous explique comment utiliser l'application Eat Day avec Docker.

## 📋 Prérequis

- Docker installé sur votre système
- Docker Compose (inclus avec Docker Desktop)

## 🚀 Démarrage rapide

### Option 1 : Avec Docker Compose (Recommandé)

```bash
# Cloner le projet
git clone <votre-repo>
cd eat-day

# Lancer l'application
docker-compose up -d
```

L'application sera accessible sur : http://localhost:3001

### Option 2 : Avec Docker uniquement

```bash
# Construire l'image
docker build -t eat-day .

# Lancer le conteneur
docker run -p 3001:3001 eat-day
```

## 💾 Persistance des données

### Avec volumes bind (Recommandé pour le développement)

1. Créez un dossier local pour les données :
```bash
mkdir -p ./data
```

2. Modifiez le `docker-compose.yml` en décommentant la ligne :
```yaml
volumes:
  - ./data:/app/data
```

3. Relancez l'application :
```bash
docker-compose down
docker-compose up -d
```

### Avec volumes nommés Docker

1. Modifiez le `docker-compose.yml` :
```yaml
volumes:
  - eat-day-data:/app/data
```

2. Relancez l'application :
```bash
docker-compose down
docker-compose up -d
```

## 🔧 Commandes utiles

### Gestion de l'application

```bash
# Démarrer l'application
docker-compose up -d

# Arrêter l'application
docker-compose down

# Voir les logs
docker-compose logs -f

# Redémarrer l'application
docker-compose restart

# Reconstruire l'image
docker-compose build --no-cache
docker-compose up -d
```

### Gestion des données

```bash
# Sauvegarder les données (avec volumes bind)
cp -r ./data ./backup-$(date +%Y%m%d)

# Restaurer les données
cp -r ./backup-YYYYMMDD/* ./data/

# Réinitialiser les données
rm -rf ./data/*
docker-compose restart
```

### Debugging

```bash
# Accéder au conteneur
docker-compose exec eat-day sh

# Voir l'état de santé
docker-compose ps

# Inspecter les volumes
docker volume ls
docker volume inspect eat-day_eat-day-data
```

## 📁 Structure des données

Quand vous utilisez la persistance, vos données sont organisées comme suit :

```
./data/
├── database.sqlite    # Base de données SQLite
└── uploads/          # Images uploadées
    ├── recipe1.jpg
    ├── recipe2.png
    └── ...
```

## 🔍 Vérification de l'installation

1. **Application web** : http://localhost:3001
2. **API Health Check** : http://localhost:3001/recipes
3. **Logs du conteneur** :
   ```bash
   docker-compose logs eat-day
   ```

## ⚠️ Dépannage

### L'application ne démarre pas

```bash
# Vérifier les logs
docker-compose logs eat-day

# Vérifier que le port n'est pas utilisé
lsof -i :3001

# Reconstruire complètement
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

### Problèmes de permissions (Linux/macOS)

```bash
# Ajuster les permissions du dossier data
sudo chown -R $USER:$USER ./data
chmod -R 755 ./data
```

### Base de données corrompue

```bash
# Supprimer la base de données (elle sera recréée)
rm ./data/database.sqlite
docker-compose restart
```

## 🔧 Configuration avancée

### Variables d'environnement

Vous pouvez personnaliser l'application via des variables d'environnement dans le `docker-compose.yml` :

```yaml
environment:
  - NODE_ENV=production
  - PORT=3001
  - DB_PATH=/app/data/database.sqlite
```

### Utilisation d'un port différent

```yaml
ports:
  - "8080:3001"  # Application accessible sur le port 8080
```

## 📊 Monitoring

L'application inclut un health check automatique qui vérifie :
- La disponibilité de l'API
- La connectivité à la base de données

Statut visible avec :
```bash
docker-compose ps
```

## 🚀 Déploiement en production

Pour un déploiement en production, considérez :

1. **Utiliser un reverse proxy** (nginx, traefik)
2. **Configurer HTTPS**
3. **Sauvegardes automatiques** des volumes
4. **Monitoring** avec des outils comme Prometheus
5. **Logs centralisés** avec ELK stack ou similaire

---

## 📞 Support

En cas de problème :
1. Consultez les logs : `docker-compose logs eat-day`
2. Vérifiez la documentation Docker officielle
3. Ouvrez une issue sur le repository du projet