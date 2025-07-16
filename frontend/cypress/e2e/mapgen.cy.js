describe('Fantasy Map Gen 2 UI', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('renders SVG map', () => {
    cy.get('svg#map-svg').should('exist');
  });

  it('updates map on sea level change', () => {
    cy.get('input[type="range"]')
      .first()
      .invoke('val', 0.5)
      .trigger('input')
      .trigger('change');
    // wait up to 20 seconds (or whatever you configure) for the map to redraw
    cy.get('#map-svg', { timeout: 20000 }).should('not.be.empty');
  });

  it('exports SVG, PNG, and JSON', () => {
    cy.window().then(win => {
      cy.stub(win.URL, 'createObjectURL').returns('blob:fake');
    });
    cy.get('button').contains('Download SVG').click();
    cy.get('button').contains('Download PNG').click();
    cy.get('button').contains('Download JSON').click();
    // Optionally, check that anchor elements are created and have correct hrefs
  });
}); 