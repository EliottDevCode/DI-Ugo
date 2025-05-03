/// <reference types="cypress" />

import './commands'

import '../../src/index.css'


declare global {
  namespace Cypress {
    interface Chainable {
      mount: (component: React.ReactNode, options?: object) => Chainable<any>
    }
  }
} 