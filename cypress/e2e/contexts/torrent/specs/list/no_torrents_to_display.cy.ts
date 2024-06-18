describe("Users", () => {
  before(() => {
    // Deletes all torrents and their related info from the database so the test can pass
    cy.clear_torrents_info_from_database();
  });

  it("Should be able to see the list page when there are no torrents", () => {
    cy.visit("/torrents");
    cy.url().should("match", /\/torrents$/);
    cy.get("[data-cy=\"no-results-element\"] img").should("have.attr", "src", "/spinner.gif");
  });
});
