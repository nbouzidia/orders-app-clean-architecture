# Travail Pratique

## Fonctionnalités (15 points)

- Mettre en place une infrastructure avec l'implémentation de votre choix (in-memory, sqlite, ...) pour persister les données.
- Pouvoir placer un ordre de commande.
- Pouvoir annuler une commande.
- Pouvoir modifier une ligne de commande.
- Une commande doit avoir au moins une ligne de commande.
- La quantité d'une ligne de commande doit être supérieure à 0.
- Une commande ne peut pas être annulée si elle est déjà payée ou expédiée.
- Une ligne de commande ne peut pas être modifiée si la commande est annulée ou expédiée.
- Le montant total d'une commande affichée est la somme des montants de ses lignes de commande.
- Chaque commande a un statut (en attente, payée, expédiée, annulée).
- Une commande est initialement créée avec le statut "en attente".
- Le statut d'une commande ne peut pas être changé à un état antérieur (par exemple, de "expédiée" à "payée").
- L'ajout d'une ligne de commande à une commande existante met à jour le montant total de la commande.
- La suppression d'une ligne de commande d'une commande existante met à jour le montant total de la commande.
- S'assurer qu'un produit ne puisse être ajouté qu'une seule fois par commande. Si le produit est déjà présent, il faut plutôt mettre à jour la quantité.

## Bonus (5 points)

- Utiliser de l'event sourcing plutôt que de stocker l'état final dans une base de données.
- Mettre en place une authentification pour sécuriser les points d'accès de l'API.
- Utiliser un broker de messages (comme RabbitMQ ou Kafka) pour gérer les commandes de manière asynchrone.
- Ajouter une suite de tests (unitaires, intégration) pour valider le comportement de l'application.
- Containeriser l'application avec Docker pour faciliter le déploiement.
- Mettre en place un système de notification (par email par exemple) pour informer les clients des changements de statut de leur commande.
