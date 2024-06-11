import { type RegistrationForm, random_user_registration_data } from "../../user/registration";
import { parseInfoHash } from "../api";
import { generateRandomTestTorrentInfo } from "../test_torrent_info";

describe("A registered user", () => {
  let registration_form: RegistrationForm;

  before(() => {
    registration_form = random_user_registration_data();
    cy.register_and_login(registration_form);
  });

  after(() => {
    cy.delete_user_from_database(registration_form.username);
  });

  it("should be able to download a preexisting torrent", () => {
    const torrent_info = generateRandomTestTorrentInfo();

    cy.upload_torrent(torrent_info);

    cy.intercept({
      method: "GET",
      url: "/*/torrent/download/*"
    }).as("download");

    cy.get("button[data-cy=\"torrent-action-download\"]").click();

    cy.wait("@download").then((interception) => {
      // Ensure the filename is correct
      expect(interception.response.headers["content-disposition"]).to.include(torrent_info.filename);

      // Delete the test torrent generated for this test
      const torrentInfoHash = parseInfoHash(interception.response.headers["x-torrust-torrent-infohash"]);
      cy.delete_torrent_from_database_and_fixture(torrent_info, torrentInfoHash);
    });
  });
});

describe("A guest user", () => {
  let uploader_registration_form: RegistrationForm;

  before(() => {
    uploader_registration_form = random_user_registration_data();

    cy.visit("/");
    cy.visit("/signup");
    cy.register(uploader_registration_form);
  });

  after(() => {
    cy.delete_user_from_database(uploader_registration_form.username);
  });

  if (Cypress.env("TRACKER_MODE") === "public") {
    it("should be able to download a preexisting torrent", () => {
      const torrent_info = generateRandomTestTorrentInfo();

      cy.login(uploader_registration_form.username, uploader_registration_form.password);

      cy.upload_torrent(torrent_info);

      cy.get("div[data-cy=\"user-menu\"]").click();

      cy.logout();

      // Ensure we are still on the torrent details page
      cy.url().should("include", "/torrent/");

      cy.intercept({
        method: "GET",
        url: "/*/torrent/download/*"
      }).as("download");

      cy.get("button[data-cy=\"torrent-action-download\"]").click();

      cy.wait("@download").then((interception) => {
        // Ensure the filename is correct
        expect(interception.response.headers["content-disposition"]).to.include(torrent_info.filename);

        // Delete the test torrent generated for this test
        const torrentInfoHash = parseInfoHash(interception.response.headers["x-torrust-torrent-infohash"]);
        cy.delete_torrent_from_database_and_fixture(torrent_info, torrentInfoHash);
      });
    });
  }
});
