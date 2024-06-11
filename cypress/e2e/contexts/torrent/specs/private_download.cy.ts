import { type RegistrationForm, random_user_registration_data } from "../../user/registration";
import { parseInfoHash } from "../api";
import { generateRandomTestTorrentInfo } from "../test_torrent_info";

describe("In private mode, a registered user", () => {
  let registration_form: RegistrationForm;

  before(() => {
    registration_form = random_user_registration_data();
    cy.register_and_login(registration_form);
  });

  after(() => {
    cy.delete_user_from_database(registration_form.username);
  });

  if (Cypress.env("TRACKER_MODE") === "private") {
    it("should be able to download a preexisting torrent with the tracker key", () => {
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

        // todo: ensure that the torrent contains the tracker key

        // Delete the test torrent generated for this test
        const torrentInfoHash = parseInfoHash(interception.response.headers["x-torrust-torrent-infohash"]);
        cy.delete_torrent_from_database_and_fixture(torrent_info, torrentInfoHash);
      });
    });
  }
});
