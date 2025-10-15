import { IncomingMessage, ServerResponse } from "node:http";
import { getSongs, getSongById, addSong } from "../controllers/songs";

//http:/localhost:4000/songs

export const songsRoute = (req: IncomingMessage, res: ServerResponse) => {
  if (req.url?.startsWith("/songs")) {
    console.log(req.url, "request url");

    //http:/localhost:4000/songs/1
    const parts = req.url.split("/");
    console.log(parts, "url parts");

    const id = parts[2] ? parseInt(parts[2]) : undefined;

    if (req.method === "GET" && !id) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(getSongs()));
      return;
    }

    if (req.method === "GET" && id) {
        const song = getSongById(id);
        res.writeHead(song? 200 : 404, { "Content-Type": "application/json" });
        res.end(JSON.stringify(song || {message: 'Song not found'}));
        return;
    }

    if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            console.log(chunk, "chunk");
            body += chunk.toString();
            console.log(body, "body");
        });
        req.on("end", () => {
            const {title, artist, duration} = JSON.parse(body);
            const newSong = addSong(title, artist, duration);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify(newSong));
        })
            return;
    }
  }
};
