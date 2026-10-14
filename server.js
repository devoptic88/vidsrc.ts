import { createServer } from "node:http";
import tmdbScrape from "./dist/vidsrc.js";

const port = Number(process.env.PORT || 3000);
const positiveInteger = value => /^[1-9]\d*$/.test(value ?? "") && Number.isSafeInteger(Number(value));

createServer(async (request, response) => {
  const send = (status, body) => {
    response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify(body));
  };
  try {
    const url = new URL(request.url, "http://localhost");
    if (request.method !== "GET") {
      response.setHeader("Allow", "GET");
      return send(405, { error: "Method not allowed" });
    }
    if (url.pathname === "/health") return send(200, { status: "ok" });
    if (url.pathname === "/") return send(200, {
      endpoints: ["/health", "/api?tmdbId=123&type=movie", "/api?tmdbId=123&type=tv&season=1&episode=1"]
    });
    if (url.pathname !== "/api") return send(404, { error: "Not found" });
    const id = url.searchParams.get("tmdbId");
    const type = url.searchParams.get("type");
    const season = url.searchParams.get("season");
    const episode = url.searchParams.get("episode");
    if (!positiveInteger(id) || !["movie", "tv"].includes(type)) {
      return send(400, { error: "Provide a positive integer tmdbId and type=movie or type=tv" });
    }
    if (type === "tv" && (!positiveInteger(season) || !positiveInteger(episode))) {
      return send(400, { error: "TV requests require positive integer season and episode" });
    }
    if (type === "movie" && (season !== null || episode !== null)) {
      return send(400, { error: "Movie requests must omit season and episode" });
    }
    return send(200, await tmdbScrape(id, type,
      type === "tv" ? Number(season) : undefined,
      type === "tv" ? Number(episode) : undefined));
  } catch (error) {
    console.error(error);
    return send(502, { error: "Unable to retrieve upstream data" });
  }
}).listen(port, "0.0.0.0", () => console.log(`Listening on port ${port}`));
