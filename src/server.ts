import http, {IncomingMessage, ServerResponse} from 'http';

const Port = 4000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, ({'Content-Type': 'application/json'}));
    res.end(JSON.stringify({message: 'Hello world'}));
};

const server = http.createServer(requestListener);

server.listen(Port, () => {
    console.log(`Server is running on htttp://localhost:${Port}`);
});