# 📋 Modèle de Fiche Réalisation — Programactor

Ce modèle sert de questionnaire et de trame standard pour collecter rapidement les informations d'une nouvelle étude de cas (projet client ou produit R&D) auprès d'un client, d'un designer ou de l'équipe produit.

Une fois ce formulaire rempli, les données peuvent être copiées directement dans l'**espace d'administration** (`/fr/admin` → Projets → Nouveau Projet) ou collées dans le fichier `data/projects.json`.

---

## 1. Informations Générales

| Champ | Description | Exemple / Valeur à renseigner |
| :--- | :--- | :--- |
| **Nom du produit / projet** | Nom public affiché sur la carte | *Ex: BongoSpace* |
| **Slug URL** | Identifiant unique dans l'URL (sans espaces ni accents) | *Ex: bongospace ou fintech-momo* |
| **Client / Commanditaire** | Nom de l'entreprise ou "Confidentiel" | *Ex: Propriétaire / Express Dispatch* |
| **Secteur d'activité** | Industrie ciblée | *Ex: Commerce & Comptabilité, Logistique, Santé...* |
| **Ville & Pays** | Localisation du déploiement terrain | *Ex: Douala, Cameroun / Libreville, Gabon* |
| **Année de réalisation** | Année de livraison | *Ex: 2026* |
| **Durée du sprint** | Délai du kickoff au produit en ligne | *Ex: 3 semaines (ou 15 jours, 6 semaines)* |
| **Mise en avant sur l'accueil** | Visible dans le top 4 de la page d'accueil ? | *Oui (featured) / Non* |
| **Ordre d'affichage** | Priorité d'apparition (1 = premier) | *Ex: 1, 2, 3...* |
| **Image de couverture** | Chemin du mockup ou visuel | *Ex: /projects/bongospace.jpg* |
| **Tags / Technologies** | 3 à 5 mots-clés | *Ex: Mobile Money, Offline-First, PWA, SAAS, ERP* |

---

## 2. Récit de l'Étude de Cas (Français)

### 📌 Phrase d'accroche (Tagline)
> *Une phrase courte et percutante qui résume la proposition de valeur pour l'utilisateur final.*
* **Votre texte :** 
  > *Ex: Encaissement instantané QR code et USSD pour commerçants de proximité.*

---

### ⚠️ Le Défi Terrain (Challenge)
> *Quel était le problème concret rencontré par les utilisateurs en Afrique centrale ? (Connexions lentes 3G/EDGE, absence d'adresses postales formelles, téléphones d'entrée de gamme, habitudes informelles...)*
* **Votre texte :**
  > *Ex: Réseaux 3G/EDGE instables dans les marchés de Douala, commerçants réticents aux interfaces chargées et retards fréquents de validation des notifications SMS d'opérateurs.*

---

### 💡 La Réponse Produit (Solution)
> *Comment Programactor a résolu ce problème par le design et la technique ? (Architecture offline-first, repères visuels géolocalisés, tunnel d'achat en 3 clics sur WhatsApp...)*
* **Votre texte :**
  > *Ex: Architecture offline-first avec synchronisation automatique en tâche de fond, génération instantanée de QR codes dynamiques et confirmation audio bilingue (français/pidgin) à chaque encaissement.*

---

### 🎯 Impact Mesuré (Résultats)
> *Quels sont les résultats concrets obtenus après le déploiement sur le terrain ?*
* **Votre texte :**
  > *Ex: -40% sur le temps d'encaissement à la caisse, 100% opérationnel même en coupure de réseau, testé et validé par 20 commerçants en 15 jours.*

---

### 📦 Livrables Finaux
> *Liste à puces des éléments concrètement conçus et livrés (3 à 5 éléments).*
1. 
2. 
3. 
4. 

*(Exemples : PWA offline-first ultra-légère < 2 Mo, Passerelle MTN MoMo & Orange Money, Design system mobile haute densité, Console web dispatch...)*

---

## 3. Métriques Clés d'Impact (Les 2 ou 3 Chiffres Chocs)

Ces chiffres apparaissent sous forme de badges sur la fiche de réalisation :

* **Métrique 1 :**
  - **Valeur :** `Ex: -40%`
  - **Libellé (FR) :** `Ex: Temps d'encaissement`
  - **Libellé (EN) :** `Ex: Checkout completion time`

* **Métrique 2 :**
  - **Valeur :** `Ex: 100%`
  - **Libellé (FR) :** `Ex: Fonctionnement offline`
  - **Libellé (EN) :** `Ex: Offline-ready operations`

* **Métrique 3 :**
  - **Valeur :** `Ex: 15j`
  - **Libellé (FR) :** `Ex: Du brief au test marchand`
  - **Libellé (EN) :** `Ex: Kickoff to live test`

---

## 4. Version Anglaise (Optionnelle / Bilingue)

Si le projet est bilingue (recommandé pour les partenaires internationaux et investisseurs) :

* **Tagline (EN) :**
* **Challenge (EN) :**
* **Solution (EN) :**
* **Deliverables (EN) :**
  1. 
  2. 
  3. 

---

## 5. Modèle JSON Prêt à Copier (Pour Intégration Directe)

```json
{
  "_id": "proj-votre-slug",
  "slug": "votre-slug",
  "name": "Nom du Projet",
  "client": "Nom du Client",
  "sector": "Secteur d'activité",
  "city": "Douala / Libreville",
  "year": "2026",
  "duration": "3 semaines",
  "status": "PUBLISHED",
  "featured": true,
  "displayOrder": 1,
  "coverImageUrl": "/projects/votre-slug.jpg",
  "tags": ["Produit", "Mobile", "Terrain"],
  "contentFr": {
    "tagline": "Phrase d'accroche en français.",
    "challenge": "Description du défi terrain.",
    "solution": "Description de la solution apportée.",
    "impact": "Résultat mesuré.",
    "deliverables": [
      "Livrable 1",
      "Livrable 2",
      "Livrable 3"
    ]
  },
  "contentEn": {
    "tagline": "English tagline.",
    "challenge": "Field challenge in English.",
    "solution": "Product solution in English.",
    "impact": "Measured impact in English.",
    "deliverables": [
      "Deliverable 1",
      "Deliverable 2",
      "Deliverable 3"
    ]
  },
  "metrics": [
    { "value": "-40%", "labelFr": "Temps d'encaissement", "labelEn": "Checkout time" },
    { "value": "100%", "labelFr": "Fonctionnement offline", "labelEn": "Offline uptime" },
    { "value": "15j", "labelFr": "Du brief au test", "labelEn": "Brief to test" }
  ]
}
```
