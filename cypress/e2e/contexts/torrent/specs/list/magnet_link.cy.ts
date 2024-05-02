import { type RegistrationForm, random_user_registration_data } from "../../../user/registration";
import { generateRandomTestTorrentInfo } from "../../test_torrent_info";

describe("A guest user", () => {
  let registration_form: RegistrationForm;

  before(() => {
    registration_form = random_user_registration_data();
    cy.register_and_login(registration_form);
    // Generates and upload a random torrent file for the tests
    const torrent_info = generateRandomTestTorrentInfo();
    Cypress.env("torrent_info", torrent_info);
    cy.upload_torrent(torrent_info);
    // Stores the infoHash in the Cypress's env variables
    cy.get("[data-cy=\"torrent-action-info-hash\"]").invoke("text").then((infoHash) => {
      Cypress.env("infoHash", infoHash);
    });
  });

  beforeEach(() => {
    cy.visit("/torrents");
  });

  after(() => {
    cy.delete_user_from_database(registration_form.username);
  });

  it("should be able get the a torrent magnet link from the torrents list", () => {
    // Get the magnet link
    cy.get("[data-cy=\"torrent-list-magnet-link\"]").invoke("attr", "href").then((href) => {
      expect(href).to.include(`magnet:?xt=urn:btih:${Cypress.env("infoHash")}`);
    });
  });

  it("should be able get the a torrent magnet link from the torrents table", () => {
    // Sets the layout to "table"
    cy.get("[data-cy=\"torrents-table-layout-selector\"]").click();
    // Gets the magnet link
    cy.get("[data-cy=\"torrent-table-magnet-link\"]").invoke("attr", "href").then((href) => {
      expect(href).to.include(`magnet:?xt=urn:btih:${Cypress.env("infoHash")}`);
    });
  });
});
