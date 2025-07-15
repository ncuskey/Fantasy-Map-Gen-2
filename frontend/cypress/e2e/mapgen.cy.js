describe('Fantasy Map Gen 2 UI', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('renders SVG map', () => {
    cy.get('svg#map-svg').should('exist');
  });

  it('updates map on sea level change', () => {
    cy.get('input[type="range"]').first().invoke('val', 0.5).trigger('input').trigger('change');
    cy.wait(500); // allow re-render
    cy.get('#map-svg').should('not.be.empty');
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