import { IncomingMessage, ServerResponse } from "node:http";
import { getSongs, getSongById, addSong } from "../controllers/songs";
import { error } from "node:console";

//http:/localhost:4000/songs

export const songsRoute = (req: IncomingMessage, res: ServerResponse) => {
  if (req.url?.startsWith("/songs")) {
    const parts = req.url.split("/");

    const id = parts[2] ? parseInt(parts[2]) : undefined;

    if (req.method === "GET" && !id) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(getSongs()));
      return;
    }

    if (req.method === "GET" && id) {
      
      if (isNaN(id)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid song ID" }));
        return;
      }
      const song = getSongById(id);
      if(!song){
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid song ID" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(song));
      return;
    }

    if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
           
            try {
                 const { title, artist, duration } = JSON.parse(body);
                 if (!title || typeof title !== "string") {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Song title is required" }));
                 }
                 if (!artist || typeof artist !== "string") {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "artist is required" }));
                 }
                 if (!duration || typeof duration !== "number") {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Song duration is required" }));
                    return;
                 }

                 const newSong = addSong(title, artist, duration);
                 res.writeHead(201, { "Content-Type": "application/json" });
                 res.end(JSON.stringify(newSong));
                    return;
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON payload" }));
            }

        })
            return;
    }

    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }
};
