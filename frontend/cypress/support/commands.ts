/// <reference types="cypress" />
// ***********************************************
// Ce fichier peut être utilisé pour définir des commandes personnalisées
// et surcharger des commandes existantes.
// ***********************************************

// Pour plus d'informations sur les commandes personnalisées voir:
// https://on.cypress.io/custom-commands

import { mount } from 'cypress/react'

// Ajout de la commande mount pour les tests de composants React
Cypress.Commands.add('mount', mount)

// -- Exemple de commande personnalisée --
// Cypress.Commands.add('login', (email, password) => { ... })
//
// -- Exemple de surcharge de commande existante --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })