/// <reference types="cypress" />
import React from 'react'
import CustomerForm from '../../src/components/CustomerForm'
import { Customer } from '../../src/services/api'

describe('CustomerForm Component', () => {
  // init data for edit
  const initialData: Customer = {
    id: 1,
    title: 'm',
    lastname: 'Dupont',
    firstname: 'Jean',
    postalCode: 75000,
    city: 'Paris',
    email: 'jean.dupont@example.com'
  }
  
  it('renders empty form correctly', () => {
    const mockOnClose = cy.stub().as('onClose')
    const mockOnSubmit = cy.stub().as('onSubmit')
    
    // Mount the component as a new form
    cy.mount(
      <CustomerForm 
        open={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
        initialData={null}
      />
    )
    
    // check form title
    cy.contains('Ajouter un client').should('be.visible')
    
    // Check form and its fields are present
    cy.get('form').should('exist')
    cy.get('form').within(() => {
      cy.get('input').should('have.length.at.least', 5) // Au moins 5 champs de formulaire
    })
    
    // Check buttons
    cy.contains('button', 'Annuler').should('be.visible')
    cy.contains('button', 'Ajouter').should('be.visible')
  })
  
  it('renders edit form with initial data', () => {
    // Create stubs inside the test
    const mockOnClose = cy.stub().as('onClose')
    const mockOnSubmit = cy.stub().as('onSubmit')
    
    // Mount the component with initial data
    cy.mount(
      <CustomerForm 
        open={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
        initialData={initialData}
      />
    )
    
    // Check form title
    cy.contains('Modifier le client').should('be.visible')
    
    // Check fields are pre-filled with initial data
    cy.contains('label', 'Nom').parent().find('input').should('have.value', 'Dupont')
    cy.contains('label', 'Prénom').parent().find('input').should('have.value', 'Jean')
    cy.contains('label', 'Code postal').parent().find('input').should('have.value', '75000')
    cy.contains('label', 'Ville').parent().find('input').should('have.value', 'Paris')
    cy.contains('label', 'Email').parent().find('input').should('have.value', 'jean.dupont@example.com')
    
    // Check submit button
    cy.contains('button', 'Modifier').should('be.visible')
  })
  
  it('submits the form with entered data', () => {
    // Create stubs inside the test
    const mockOnClose = cy.stub().as('onClose')
    const mockOnSubmit = cy.stub().as('onSubmit')
    
    // Mount the component
    cy.mount(
      <CustomerForm 
        open={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
        initialData={null}
      />
    )
    
    // Fill the form
    cy.contains('label', 'Civilité').parent().click() 
    cy.contains('M.').click()  
    
    cy.contains('label', 'Nom').parent().find('input').type('Martin')
    cy.contains('label', 'Prénom').parent().find('input').type('Sophie')
    cy.contains('label', 'Code postal').parent().find('input').type('69000')
    cy.contains('label', 'Ville').parent().find('input').type('Lyon')
    cy.contains('label', 'Email').parent().find('input').type('sophie.martin@example.com')
    
    // Submit the form
    cy.contains('button', 'Ajouter').click()
    
    // Verify that onSubmit was called with the correct data
    cy.get('@onSubmit').should('have.been.calledWith', {
      title: 'm',
      lastname: 'Martin',
      firstname: 'Sophie',
      postalCode: 69000,
      city: 'Lyon',
      email: 'sophie.martin@example.com'
    })
  })
}) 