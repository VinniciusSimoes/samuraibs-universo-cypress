

it('webapp deve estar online', () => {
    // teste
    cy.visit('/');
    cy.title()
        .should('eq', 'Samurai Barbershop by QAninja')
});
