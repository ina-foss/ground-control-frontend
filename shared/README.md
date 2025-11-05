# 2IA Common components

Le projet **Common Components** a pour objectif de centraliser et de partager des composants d'interface utilisateur
réutilisables au sein des différentes applications de l'écosystème. Il adopte une approche modulaire en structurant les
composants selon les principes de **Atomic Design**, incluant les atomes, les molécules et les organismes.

## Principales fonctionnalités

- **Atomes** : Composants UI de base tels que les boutons, les icônes ou les champs de texte.
- **Molécules** : Combinaisons simples d'atomes, comme un champ de recherche avec son bouton associé.
- **Organismes** : Composants complexes combinant plusieurs molécules et atomes, comme une barre de navigation ou un
  formulaire.

## Objectifs

- **Réduction des efforts de développement** : Faciliter la réutilisation des composants dans différentes applications.
- **Consistance visuelle et fonctionnelle** : Uniformiser l'apparence et les comportements dans toutes les interfaces
  utilisateur.
- **Maintenance simplifiée** : Améliorer la maintenabilité du code en centralisant les évolutions des composants.

## Technologies utilisées

- **Frameworks Frontend** : Vue.js.
- **Systèmes de gestion de paquets** : npm
- **Outils de documentation** : Storybook pour visualiser et tester les composants en isolation.

Ce projet joue un rôle clé dans l’amélioration de la productivité des développeurs et dans l’expérience utilisateur
globale en garantissant des interfaces harmonieuses et modulaires.


## Git Submodules

```shell
git submodule add git@git.infra.sas.ina:ia/code/ihmia/common-components.git shared
```
