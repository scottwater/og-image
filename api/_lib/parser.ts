import { IncomingMessage } from "http";
import { parse } from "url";
import { ParsedRequest, Theme } from "./types";

export function parseRequest(req: IncomingMessage) {
  console.log("HTTP " + req.url);
  const { pathname = "/", query = {} } = parse(req.url || "", true);
  const { fontSize, images, widths, heights, theme, md, background } = query;

  if (Array.isArray(fontSize)) {
    throw new Error("Expected a single fontSize");
  }
  if (Array.isArray(theme)) {
    throw new Error("Expected a single theme");
  }

  if (Array.isArray(background)) {
    throw new Error("Expected a single background");
  }

  const arr = pathname.slice(1).split(".");
  let extension = "";
  let text = "";
  if (arr.length === 0) {
    text = "";
  } else if (arr.length === 1) {
    text = arr[0];
  } else {
    extension = arr.pop() as string;
    text = arr.join(".");
  }

  const parsedRequest: ParsedRequest = {
    fileType: extension === "jpeg" ? extension : "png",
    text: decodeURIComponent(text),
    theme: theme === "black" ? "black" : "white",
    md: md === "1" || md === "true",
    fontSize: fontSize || "96px",
    images: getArray(images),
    widths: getArray(widths),
    heights: getArray(heights),
    background: background || "none"
  };
  parsedRequest.images = getDefaultImages(
    parsedRequest.images,
    parsedRequest.theme
  );
  return parsedRequest;
}

function getArray(stringOrArray: string[] | string): string[] {
  return Array.isArray(stringOrArray) ? stringOrArray : [stringOrArray];
}

function getDefaultImages(images: string[], theme: Theme): string[] {
  if (
    images.length > 0 &&
    images[0] &&
    images[0].startsWith("https://swassets.scottwater.now.sh/")
  ) {
    return images;
  }
  return theme === "white"
    ? ["https://swassets.scottwater.now.sh/black/code.svg"]
    : ["https://swassets.scottwater.now.sh/white/code.svg"];
}
