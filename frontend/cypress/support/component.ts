/// <reference types="cypress" />

// Import des commandes Cypress
import './commands'

// Importation du style (si nécessaire)
import '../../src/index.css'

// À partir de Cypress 10+, le framework de montage est automatiquement configuré
// Nous n'avons plus besoin d'importer et d'enregistrer mount manuellement

// Types pour TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      mount: (component: React.ReactNode, options?: object) => Chainable<any>
    }
  }
} 