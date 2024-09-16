// Custom commands for torrent context
import { parseInfoHash } from "./api";

Cypress.Commands.add("upload_torrent", (torrent_info) => {
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
});

Cypress.Commands.add("delete_torrent_from_database_and_fixture", (torrent_info, infohash) => {
  // Delete the torrent in the database
  cy.task("deleteTorrent", { infohash });

  // Delete the torrent file in the fixtures folder
  cy.exec(`rm ${torrent_info.path}`);
});

Cypress.Commands.add("clear_torrents_info_from_database", () => {
  cy.task("deleteTorrentsInfoFromDatabase");
});
