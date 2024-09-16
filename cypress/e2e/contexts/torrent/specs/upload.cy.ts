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

  it("should be able to upload a torrent", () => {
    const torrent_info = generateRandomTestTorrentInfo();

    cy.request({
      url: `http://localhost:3001/v1/torrent/meta-info/random/${torrent_info.id}`,
      encoding: "binary"
    }).then((response) => {
      const torrentInfoHash = parseInfoHash(response.headers["x-torrust-torrent-infohash"]);
      cy.wrap(torrentInfoHash).as("infohash");
      cy.log(`random torrent with info-hash '${torrentInfoHash}' downloaded to '${torrent_info.path}'`);
      cy.writeFile(torrent_info.path, response.body, "binary");
    });

    cy.visit("/upload");

    cy.get("input[data-cy=\"upload-form-title\"]").type(torrent_info.title);
    cy.get("textarea[data-cy=\"upload-form-description\"]").type(torrent_info.description);
    cy.get("select[data-cy=\"upload-form-category\"]").select("software");
    cy.get("input[data-cy=\"upload-form-torrent-upload\"]").selectFile(
      {
        contents: torrent_info.path,
        fileName: torrent_info.filename,
        mimeType: "application/x-bittorrent"
      }, { force: true });
    // todo: add tag.
    // By default there are no tags, so we need to create them first with
    // a custom command. We can enable this feature after writing the test for
    // the tags context.  We could even create some tags before running all the
    // tests.
    // cy.get("input[data-cy=\"upload-form-torrent-upload\"]").select('fractals');
    cy.get("input[data-cy=\"upload-form-agree-terms\"]").check();
    cy.get("button[data-cy=\"upload-form-submit\"]").click();

    cy.get("@infohash").then((infohash) => {
      // It should redirect to the torrent detail page.
      cy.url().should("include", `/torrent/${infohash}`);

      // Delete the torrent in the database
      cy.task("deleteTorrent", { infohash });

      // Delete the torrent file in the fixtures folder
      cy.exec(`rm ${torrent_info.path}`);
    });
  });
});

describe("A guest user", () => {
  before(() => {
    cy.visit("/");
  });

  it("should not be able to upload a torrent", () => {
    cy.visit("/upload");
    cy.contains("Please sign in to upload");
  });
});
