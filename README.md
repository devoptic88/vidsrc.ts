# vidsrc.ts
A cool vidsrc(.me/.net/.xyz/.in/.io) extractor in typescript.(proof of concept)

### QUICK
- *API (vercel)* :

  [https://github.com/cool-dev-guy/vidsrc.ts/tree/vercel](https://github.com/cool-dev-guy/vidsrc.ts/tree/vercel)

  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cool-dev-guy/vidsrc.ts/tree/vercel)
- MODULE (node/deno) :

  [https://github.com/cool-dev-guy/vidsrc.ts/tree/main](https://github.com/cool-dev-guy/vidsrc.ts/tree/main)
  
### Railway deployment

Run `npm ci`, then `npm run build` and `npm start` locally. Railway
detects the build and start scripts automatically. The server listens on
`0.0.0.0` using Railway's `PORT` variable (3000 locally).

Set the Railway healthcheck path to `/health`. Deploy from this repository's
root directory. Commit `package-lock.json` alongside the source changes.

Use `npm start` so the TLS bootstrap loads the bundled, authenticated Let's
Encrypt cross-certificate before the server starts. This repairs the observed
incomplete upstream chain while retaining HTTPS certificate verification.
Commit `tls-bootstrap.js` and the `certs` directory as well. No Railway TLS
environment variable is required. See `certs/README.md` for provenance and expiry.
Upstream requests time out after 15 seconds; failures log the endpoint and cause.

- `GET /` lists the available endpoints.
- `GET /health` checks service readiness without contacting upstream sites.
- `GET /api?tmdbId=76479&type=tv&season=1&episode=1` extracts a TV episode.
- `GET /api?tmdbId=123&type=movie` extracts a movie.

Invalid parameters return 400; upstream failures return 502. Successful
requests return the module's JSON array. Upstream availability and extractor
compatibility are separate from deployment health.

### FEATURES
- Nodejs & deno compatible (Deno : `deno run --allow-net vidsrc.ts`)
- Function (`tmdbScrape`) importable in any server libs (axios/hono/cf-workers)
- Deployable everywhere.

### USAGE (INPUT)
```ts
import tmdbScrape from "vidsrc.ts"; 
console.log(await tmdbScrape("76479", "tv",1,1));

await tmdbScrape("TMDB_ID", "movie"); // movies (TMDB_ID:string,"movie")
await tmdbScrape("TMDB_ID","tv",1,1); // series (TMDB_ID:string,"tv",season:number,episode:number)
```

### RETURN TYPE

** supposed to change later.

```js
[
  {
    name: "",
    image: "",
    mediaId: "996",
    stream: "https://playlist.m3u8",
  }
]
```
