// Fetches a file from the server and
// returns the content of the file as
// text
//
// Throws an error if the fetch request
// went wrong or if the file returned
// is not of type text/markdown

class FetchTextFileError extends Error { }

export async function fetchTextFile (fileName: string) {
  try {
    const fetchResponse = await fetch(fileName);
    if (!fetchResponse.ok || !fetchResponse.headers.get("content-type").includes("text/markdown")) {
      throw new FetchTextFileError(`Couldn't fetch the file: ${fileName}`);
    }
    const fileContent = await fetchResponse.text();
    return fileContent;
  } catch (error) {
    throw new FetchTextFileError(`Couldn't fetch the file: ${fileName}`);
  }
}
