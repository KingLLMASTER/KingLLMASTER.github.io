# ShiftBase - Application de Gestion du Personnel

## Description

ShiftBase est une application web complète de gestion du personnel, similaire à Shiftbase. Elle permet de gérer les employés, planifier les horaires de travail, suivre le temps, gérer les absences et générer des rapports.

## Fonctionnalités

### 📊 Tableau de bord
- Vue d'ensemble des statistiques en temps réel
- Nombre d'employés actifs
- Présences et absences du jour
- Total des heures travaillées dans la semaine
- Aperçu du planning hebdomadaire
- Historique des activités récentes

### 👥 Gestion des Employés
- Ajouter de nouveaux employés
- Modifier les informations des employés
- Supprimer des employés
- Recherche d'employés
- Gestion des statuts (actif/inactif)
- Informations détaillées : nom, poste, email, téléphone, département, taux horaire

### 📅 Planning des Horaires
- Vue hebdomadaire du planning
- Navigation entre les semaines (précédente/suivante)
- Ajout de shifts par employé
- Visualisation des horaires de travail
- Modification et suppression des shifts
- Code couleur par employé

### ⏱️ Suivi du Temps
- Horloge en temps réel
- Pointage d'arrivée (clock in)
- Pointage de sortie (clock out)
- Calcul automatique des heures travaillées
- Feuille de temps hebdomadaire
- Historique des pointages

### 🏖️ Gestion des Absences
- Demande d'absence
- Types d'absence : congés payés, maladie, congé personnel, sans solde
- Workflow d'approbation (en attente, approuvée, refusée)
- Calcul automatique de la durée
- Filtrage par statut
- Validation ou rejet des demandes

### 📈 Rapports
- Heures par employé
- Taux de présence
- Coûts de personnel
- Export en PDF et Excel (fonctionnalité à implémenter)

## Installation

1. Cloner ou télécharger les fichiers suivants :
   - `shiftbase.html`
   - `shiftbase-styles.css`
   - `shiftbase-app.js`

2. Ouvrir `shiftbase.html` dans un navigateur web moderne

## Utilisation

### Démarrage
- Au premier lancement, l'application charge des données de démonstration
- 3 employés sont créés automatiquement
- Des shifts sont générés pour la semaine en cours

### Gestion des Employés
1. Cliquez sur "Employés" dans le menu latéral
2. Cliquez sur "Ajouter un employé" pour créer un nouvel employé
3. Remplissez le formulaire et cliquez sur "Enregistrer"
4. Utilisez les icônes d'édition et de suppression pour gérer les employés

### Planification
1. Cliquez sur "Planning" dans le menu latéral
2. Utilisez les flèches pour naviguer entre les semaines
3. Cliquez sur "Ajouter un shift" pour créer un nouveau shift
4. Sélectionnez l'employé, la date et les horaires
5. Cliquez sur un shift existant pour le supprimer

### Pointage
1. Cliquez sur "Suivi du temps" dans le menu latéral
2. Cliquez sur "Pointer l'arrivée" pour enregistrer une arrivée
3. Cliquez sur "Pointer la sortie" pour enregistrer une sortie
4. Les heures sont calculées automatiquement

### Absences
1. Cliquez sur "Absences" dans le menu latéral
2. Cliquez sur "Demander une absence"
3. Remplissez le formulaire avec les informations de l'absence
4. Les demandes apparaissent avec le statut "En attente"
5. Utilisez les boutons d'approbation/rejet pour gérer les demandes

## Technologies Utilisées

- **HTML5** : Structure sémantique de l'application
- **CSS3** : Design moderne avec variables CSS, Grid et Flexbox
- **JavaScript Vanilla** : Logique applicative sans framework
- **localStorage** : Persistance des données côté client
- **Material Icons** : Icônes modernes de Google
- **Google Fonts (Inter)** : Typographie professionnelle

## Stockage des Données

Les données sont stockées localement dans le navigateur via localStorage :
- `shiftbase_employees` : Liste des employés
- `shiftbase_shifts` : Plannings et shifts
- `shiftbase_absences` : Demandes d'absence
- `shiftbase_timeEntries` : Entrées de pointage

**Note** : Les données sont persistantes mais restent locales au navigateur. Pour un usage en production, il est recommandé d'implémenter un backend avec une base de données.

## Caractéristiques du Design

- Interface moderne et intuitive
- Design responsive (mobile, tablette, desktop)
- Palette de couleurs professionnelle
- Animations fluides et transitions
- Navigation latérale fixe
- Modales pour les formulaires
- Feedback visuel sur les actions
- Badges de statut colorés

## Améliorations Futures

- Backend avec API REST
- Authentification et gestion des rôles
- Notifications push
- Intégration de Chart.js pour les graphiques
- Export réel en PDF/Excel
- Gestion multi-entreprises
- Application mobile native
- Calendrier interactif drag & drop
- Gestion de la paie
- Rapports avancés et analytics

## Compatibilité

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Support

Pour toute question ou suggestion, veuillez ouvrir une issue sur le dépôt GitHub.

## Licence

Ce projet est un exemple éducatif. Libre d'utilisation et de modification.

---

**Développé avec ❤️ pour une gestion efficace du personnel**
