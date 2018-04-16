const http = require("http");
const Static = require("node-static");
const GameSession = require("./GameSession");
const WebSocketServer = new require("ws");

const sessions = [];
const webSocketServer = new WebSocketServer.Server({port: 8081});
webSocketServer.on("connection", function(ws) {
	let playerAdded = false;
	for (const session of sessions) {
		if (session.addPlayer(ws)) {
			playerAdded = true;
			break;
		}
	}
	if (!playerAdded)
	{
		const newSession = new GameSession();
		newSession.addPlayer(ws);
		sessions.push(newSession);
	}
});


const fileServer = new Static.Server("./client");
http.createServer(function (req, res) {
	fileServer.serve(req, res);
}).listen(8080);

console.log("Сервер запущен на портах 8080, 8081");

