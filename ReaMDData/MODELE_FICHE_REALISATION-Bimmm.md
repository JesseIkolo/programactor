# 📋 Modèle de Fiche Réalisation — Programactor

Ce modèle sert de questionnaire et de trame standard pour collecter rapidement les informations d'une nouvelle étude de cas (projet client ou produit R&D) auprès d'un client, d'un designer ou de l'équipe produit.

Une fois ce formulaire rempli, les données peuvent être copiées directement dans l'**espace d'administration** (`/fr/admin` → Projets → Nouveau Projet) ou collées dans le fichier `data/projects.json`.

---

## 1. Informations Générales

| Champ | Description | Valeur renseignée |
| :--- | :--- | :--- |
| **Nom du produit / projet** | Nom public affiché sur la carte | **Bimaround** |
| **Slug URL** | Identifiant unique dans l'URL (sans espaces ni accents) | **bimaround** |
| **Client / Commanditaire** | Nom de l'entreprise ou "Confidentiel" | **Produit R&D OnetouchLabs** |
| **Secteur d'activité** | Industrie ciblée | **Beauté & Bien-être, BeautyTech, Commerce & POS** |
| **Ville & Pays** | Localisation du déploiement terrain | **Douala, Cameroun** *(avec Libreville)* |
| **Année de réalisation** | Année de livraison | **2026** |
| **Durée du sprint** | Délai du kickoff au produit en ligne | ** 8 semaines** |
| **Mise en avant sur l'accueil** | Visible dans le top 4 de la page d'accueil ? | **Oui (featured)** |
| **Ordre d'affichage** | Priorité d'apparition (1 = premier) | **2** |
| **Image de couverture** | Chemin du mockup ou visuel | **/projects/bimaround.jpg** |
| **Tags / Technologies** | 3 à 5 mots-clés | **BeautyTech, Mobile-First, POS & Caisse, Mobile Money, WhatsApp** |

---

## 2. Récit de l'Étude de Cas (Français)

### 📌 Phrase d'accroche (Tagline)
> *Une phrase courte et percutante qui résume la proposition de valeur pour l'utilisateur final.*
* **Votre texte :** 
  > **La suite tout-en-un qui transforme les prestataires de la beauté africains en entrepreneurs organisés et rentables.**

---

### ⚠️ Le Défi Terrain (Challenge)
> *Quel était le problème concret rencontré par les utilisateurs en Afrique centrale ? (Connexions lentes 3G/EDGE, absence d'adresses postales formelles, téléphones d'entrée de gamme, habitudes informelles...)*
* **Votre texte :**
  > En Afrique centrale et de l'ouest, plus de 80% des salons de coiffure, barbiers et esthéticiennes exercent dans l'informel et subissent des pertes financières chroniques (15% à 30% du revenu mensuel). Leurs défis quotidiens sont sévères : encaissements en liquide non tracés et sources de conflits avec les employés, oublis massifs de rendez-vous sans système de relance, et comptabilité manuelle sur cahier papier. Les logiciels SaaS internationaux (Fresha, Treatwell) échouent sur ce marché : ils exigent une connexion permanente à haut débit, ignorent les paiements Mobile Money (Orange Money, MTN MoMo, Wave) et ne s'intègrent pas aux usages WhatsApp, canal central du commerce local.

---

### 💡 La Réponse Produit (Solution)
> *Comment Programactor a résolu ce problème par le design et la technique ? (Architecture offline-first, repères visuels géolocalisés, tunnel d'achat en 3 clics sur WhatsApp...)*
* **Votre texte :**
  > Programactor a conçu et développé Bimaround comme un système d'exploitation métier ultra-léger et centré sur l'humain, adapté aux réalités des smartphones d'entrée de gamme et des connexions instables :
  > 1. **Caisse & POS Hybride :** Enregistrement ultra-rapide des prestations en cash ou Mobile Money avec reçus dématérialisés instantanés.
  > 2. **Rappels Automatisés WhatsApp :** Système de réservation en ligne synchronisé qui envoie les rappels directement sur WhatsApp pour neutraliser les no-shows.
  > 3. **Gestion d'Équipe & Commissions :** Répartition automatique du chiffre d'affaires entre le patron et les coiffeurs/employés pour supprimer tout litige en fin de journée.
  > 4. **Suivi des Stocks & Alertes :** Notification des produits critiques (shampooings, mèches, lames) pour éviter les ruptures en plein service.
  > 5. **Design Inclusif & Ergonomie Terrain :** Interface mobile tactile conçue pour un usage intensif à une main en salon, bilingue (français/anglais), avec contraste élevé pour écrans d'entrée de gamme et onboarding immédiat sans carte bancaire.

---

### 🎯 Impact Mesuré (Résultats)
> *Quels sont les résultats concrets obtenus après le déploiement sur le terrain ?*
* **Votre texte :**
  > **+96 professionnels de la beauté** pré-inscrits en liste d'attente dès la phase de lancement bêta, un temps de clôture de caisse divisé par 3 (passage de 45 min de calculs manuels à moins de 5 min), et une projection de réduction de **80% des rendez-vous non honorés** grâce à l'automatisation des confirmations WhatsApp.

---

### 📦 Livrables Finaux
> *Liste à puces des éléments concrètement conçus et livrés (3 à 5 éléments).*
1. **Application Web & PWA Responsive :** Espaces dédiés aux gérants de salon, collaborateurs indépendants et clients finaux.
2. **Terminal POS & Module de Caisse :** Gestion des encaissements multi-devises (FCFA, devises locales), paiements fractionnés Cash/MoMo et reçus numériques.
3. **Moteur de Réservation & Passerelle WhatsApp :** Tunnel de prise de rendez-vous 24/7 et rappels automatiques.
4. **Tableau de Bord Analytique Financier :** Suivi en direct du chiffre d'affaires, des commissions du staff et de la marge nette.
5. **Landing Page à Haute Conversion :** Tunnel d'acquisition avec liste d'attente progressive en 2 étapes (zéro perte de leads).

---

## 3. Métriques Clés d'Impact (Les 2 ou 3 Chiffres Chocs)

Ces chiffres apparaissent sous forme de badges sur la fiche de réalisation :

* **Métrique 1 :**
  - **Valeur :** `+96`
  - **Libellé (FR) :** `Prestataires sur liste d'attente`
  - **Libellé (EN) :** `Beauty pros on waitlist`

* **Métrique 2 :**
  - **Valeur :** `< 5 min`
  - **Libellé (FR) :** `Pour clôturer la caisse du salon`
  - **Libellé (EN) :** `Daily salon register closing time`

* **Métrique 3 :**
  - **Valeur :** `2 Villes`
  - **Libellé (FR) :** `Marchés pilotes (Douala & Libreville)`
  - **Libellé (EN) :** `Pilot cities (Douala & Libreville)`

---

## 4. Version Anglaise (Optionnelle / Bilingue)

Si le projet est bilingue (recommandé pour les partenaires internationaux et investisseurs) :

* **Tagline (EN) :**  
  > The all-in-one platform turning African beauty professionals into organized, profitable entrepreneurs.

* **Challenge (EN) :**  
  > Over 80% of barbers, hair stylists, and beauty salons in Central and West Africa operate informally, losing 15% to 30% of their monthly income to untracked cash payments, frequent client no-shows, and manual paper book-keeping. Western salon software completely fails in this ecosystem: too heavy for erratic 3G connections, zero integration with local Mobile Money networks (Orange Money, MTN MoMo, Wave), and disconnected from WhatsApp where customer interactions actually happen.

* **Solution (EN) :**  
  > Programactor engineered Bimaround from the ground up for the African street economy: an ultra-responsive, mobile-first operating system combining a lightweight POS cash register (supporting Cash + Mobile Money), automated booking confirmations via WhatsApp, multi-staff commission calculations, and real-time inventory alerts, packaged in an offline-ready, accessible interface.

* **Deliverables (EN) :**  
  1. **Responsive Web App & PWA:** Custom dashboards for salon owners, booth renters, and solo stylists.
  2. **Hybrid Point of Sale (POS):** Fast checkout flow supporting Cash and Mobile Money with shareable digital receipts.
  3. **Automated WhatsApp Booking Engine:** 24/7 client booking pipeline with automatic appointment reminders.
  4. **Financial & Staff Analytics:** Real-time visibility on revenue, inventory, and staff commission payouts.
  5. **High-Conversion Acquisition Landing Page:** Optimized two-step waitlist engine with zero lead drop-off.

---

## 5. Modèle JSON Prêt à Copier (Pour Intégration Directe)

```json
{
  "_id": "proj-bimaround",
  "slug": "bimaround",
  "name": "Bimaround",
  "client": "Produit R&D OnetouchLabs",
  "sector": "Beauté & Bien-être / POS & Micro-entreprises",
  "city": "Douala, Cameroun (avec Libreville)",
  "year": "2026",
  "duration": "8 semaines",
  "status": "PUBLISHED",
  "featured": true,
  "displayOrder": 2,
  "coverImageUrl": "/projects/bimaround.jpg",
  "tags": ["BeautyTech", "Mobile-First", "POS & Caisse", "Mobile Money", "WhatsApp"],
  "contentFr": {
    "tagline": "La suite tout-en-un qui transforme les prestataires de la beauté africains en entrepreneurs organisés et rentables.",
    "challenge": "En Afrique centrale et de l'ouest, plus de 80% des salons de coiffure et barbiers exercent dans l'informel et perdent jusqu'à 30% de leurs revenus à cause des paiements cash non contrôlés, des no-shows fréquents et d'une gestion manuelle sur cahier. Les solutions occidentales sont inadaptées : pas de Mobile Money, pas d'intégration WhatsApp et trop gourmandes en data 3G.",
    "solution": "Programactor a conçu Bimaround comme un OS métier ultra-léger et tout-en-un : caisse tactile hybride Cash + Mobile Money, rappels automatiques sur WhatsApp pour éliminer les no-shows, calcul instantané des commissions du personnel, suivi des stocks et design ergonomique pensé pour un usage intensif à une main sur écrans d'entrée de gamme.",
    "impact": "+96 professionnels inscrits en liste d'attente au pré-lancement, temps de clôture de caisse divisé par 3 et réduction estimée de 80% des rendez-vous manqués grâce aux rappels WhatsApp.",
    "deliverables": [
      "Application web responsive & PWA (salons, indépendants, clients)",
      "Terminal POS tactile avec encaissement Cash & Mobile Money",
      "Passerelle de réservation 24/7 et rappels automatisés WhatsApp",
      "Tableau de bord financier et analytique des commissions en temps réel",
      "Landing page à très haute conversion avec liste d'attente résiliente"
    ]
  },
  "contentEn": {
    "tagline": "The all-in-one platform turning African beauty professionals into organized, profitable entrepreneurs.",
    "challenge": "Over 80% of African beauty and barber businesses lose up to 30% of their monthly income to untracked cash leakage, no-show appointments, and manual pen-and-paper tracking. Western tools fail due to high data usage, lack of Mobile Money support, and absence of WhatsApp integration.",
    "solution": "Programactor built Bimaround: a lightweight, mobile-first operating system featuring a hybrid Cash + Mobile Money POS, automated WhatsApp reminders to eliminate no-shows, automatic staff commission splits, and a high-contrast UI tailored for one-handed salon use on entry-level devices.",
    "impact": "+96 beauty pros joined the waitlist at pre-launch, daily accounting time cut by 3x, and an estimated 80% drop in no-shows via automated WhatsApp confirmations.",
    "deliverables": [
      "Responsive Web App & PWA for salon owners, staff, and clients",
      "Touch-friendly POS register with Cash & Mobile Money checkout",
      "24/7 booking engine with automated WhatsApp reminders",
      "Financial dashboard tracking revenue, staff splits, and stock",
      "High-converting landing page with resilient 2-step waitlist engine"
    ]
  },
  "metrics": [
    { "value": "+96", "labelFr": "Prestataires en liste d'attente", "labelEn": "Pros on waitlist" },
    { "value": "< 5 min", "labelFr": "Pour clôturer la caisse du salon", "labelEn": "Daily cash closing time" },
    { "value": "2 Villes", "labelFr": "Marchés pilotes (Douala & Libreville)", "labelEn": "Pilot launch cities" }
  ]
}
```
