/// <reference types="cypress" />
import React from 'react'
import Navbar from '../../src/components/Navbar'
import { BrowserRouter } from 'react-router-dom'

describe('Navbar Component', () => {
  it('renders correctly', () => {
    cy.mount(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )
    
    cy.contains('Gestion des Commandes').should('be.visible')
    
    cy.contains('Clients').should('be.visible')
    cy.contains('Commandes').should('be.visible')
  })
  
  it('has working navigation links', () => {
    cy.mount(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )
    
    cy.contains('Clients').should('exist')
    cy.contains('Commandes').should('exist')
    
    cy.contains('Clients').click()
    cy.contains('Commandes').click()
  })
}) 