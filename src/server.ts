import http, {IncomingMessage, ServerResponse} from 'http';
import { start } from 'repl';
import { songsRoute } from './routes/songs';

const Port = 4000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    if (req.url?.startsWith("/songs")) {
        songsRoute(req, res);
    } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "404: not found" }));
    }
    
};

const server = http.createServer(requestListener);

server.listen(Port, () => {
    console.log(`Server is running on http://localhost:${Port}`);
});