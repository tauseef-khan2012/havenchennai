describe('booking flow', () => {
  it('completes direct payment flow', () => {
    cy.visit('/booking')
    cy.get('input[type=date]').first().type('2025-01-01')
    cy.get('input[type=date]').last().type('2025-01-02')
    cy.contains('Continue').click()
    cy.get('input[placeholder=Name]').type('Test User')
    cy.get('input[placeholder=Email]').type('test@example.com')
    cy.get('input[placeholder=Phone]').type('1234567890')
    cy.contains('Continue').click()
    cy.contains('Booking Confirmed')
  })
})

