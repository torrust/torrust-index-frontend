import { type RegistrationForm, random_user_registration_data } from "../../../user/registration";
import { generateRandomTestTorrentInfo } from "../../test_torrent_info";

describe("A guest user", () => {
  let registration_form: RegistrationForm;

  before(() => {
    registration_form = random_user_registration_data();
    cy.register_and_login(registration_form);
  });

  after(() => {
    cy.delete_user_from_database(registration_form.username);
  });

  it("should be able get the a torrent magnet link", () => {
    const torrent_info = generateRandomTestTorrentInfo();

    cy.upload_torrent(torrent_info);

    // Get the infohash
    cy.get("[data-cy=\"torrent-action-info-hash\"]").invoke("text").then((infoHash) => {
      // Get the magnet link
      cy.get("[data-cy=\"torrent-action-magnet-link\"]").invoke("attr", "href").then((href) => {
        // cspell:disable-next-line
        expect(href).to.include(`magnet:?xt=urn:btih:${infoHash}&dn=${torrent_info.title}`);
      });

      cy.delete_torrent_from_database_and_fixture(torrent_info, infoHash);
    });
  });
});
