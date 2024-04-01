import { createCanvas, registerFont, CanvasRenderingContext2D } from "canvas";
import DOMPurify from "dompurify";
import { useRestApi } from "#imports";

const rest = useRestApi().value;

const allowedTags = ["h1", "h2", "h3", "h4", "h5", "h6", "em", "strong", "del", "a", "img", "ul", "ol", "li", "hr", "p"];
const allowedImageExtensions = ["png", "PNG", "jpg", "JPG", "jpeg", "JPEG", "gif", "GIF"];

export async function sanitize (html: string) {
  const safeHtml = remove_harmful_code(html);
  const htmlWithNoUserTracking = await remove_user_tracking(safeHtml);
  return htmlWithNoUserTracking;
}

function remove_harmful_code (html: string) {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: allowedTags });
}

async function remove_user_tracking (html: string) {
  // Parse the description as HTML to easily manipulate it.
  const parser = new DOMParser();

  const htmlDoc = parser.parseFromString(html, "text/html");

  remove_all_external_links(htmlDoc);

  await replace_images_with_proxied_images(htmlDoc);

  return document_to_html(htmlDoc);
}

function remove_all_external_links (htmlDoc: Document) {
  const links = htmlDoc.querySelectorAll("a");
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && !href.startsWith("#")) {
      link.removeAttribute("href");
    }
  });
}

async function replace_images_with_proxied_images (htmlDoc: Document) {
  const images = htmlDoc.querySelectorAll("img");
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const src = img.getAttribute("src");

    if (src) {
      if (isAllowedImage(src)) {
        try {
          const imageDataSrc = await getImageDataUrl(src);
          img.setAttribute("src", imageDataSrc);
        } catch (e) {
          const imageDataUrl = createImageWithText(`Can't load proxied image: ${src}`, 1000, 50, 15);
          img.setAttribute("src", imageDataUrl);
        }
      } else {
        const imageDataUrl = createImageWithText(`Not allowed image extension. It must be: ${allowedImageExtensions.concat()}`, 1000, 50, 15);
        img.setAttribute("src", imageDataUrl);
      }
    }
  }
}

function document_to_html (descriptionHtml: Document) {
  const body = descriptionHtml.querySelector("body");
  const serializer = new XMLSerializer();
  let html = "";
  if (body) {
    html = serializer.serializeToString(body);
    html = html
      .replace("<body xmlns=\"http://www.w3.org/1999/xhtml\">", "")
      .replace("<body>", "")
      .replace("</body>", "");
  }
  return html;
}

// Returns true if the image is allowed to be displayed.
function isAllowedImage (href: string): boolean {
  const extension = href.split(".").pop().trim();
  return allowedImageExtensions.includes(extension);
}

// Returns a base64 string ready to be use in a "src" attribute in a "img" html tag,
// like this `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gA…IiIiIiIiIiIiIiHyO/P85XT/jxW1glg5Erk==">`.
async function getImageDataUrl (url: string): Promise<string> {
  const imageBlob = await rest.torrent.proxiedImage(url);
  const data = await blobToDataURL(imageBlob);
  return data;
}

// Convert binary data into a base64 encoded string ready to be use in a "src"
// attribute in a "img" html tag, like the following:
// `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gA…IiIiIiIiIiIiIiHyO/P85XT/jxW1glg5Erk==">`.
function blobToDataURL (blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = _e => resolve(reader.result as string);
    reader.onerror = _e => reject(reader.error);
    reader.onabort = _e => reject(new Error("Read aborted"));
    reader.readAsDataURL(blob);
  });
}

function createImageWithText (text: string, width: number, height: number, font: number): string {
  // Create a canvas element
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (context) {
    // Set background color (optional)
    context.fillStyle = "white"; // or "transparent" for a transparent background
    context.fillRect(0, 0, width, height);

    // Set text properties
    context.fillStyle = "black";
    context.font = `${font}px Arial`; // Change font size and family as needed

    // Align text
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Draw text
    context.fillText(text, width / 2, height / 2);
  }

  // Convert canvas to data URL (base64 encoded string)
  return canvas.toDataURL("image/png");
}
